<template>
  <view class="course-reminder std-page-margin std-bottom-margin-normal">
    <view v-if="!hasData" class="no-data" @click="onTapUpdate">
      <view class="update-title">点击更新课程数据</view>
      <view class="update-hint">同步后显示今日课程提醒</view>
    </view>
    <view v-else-if="courses.length === 0" class="empty-day" @click="navToCurriculumPage">
      <view class="week-line">第{{ weekOfTerm }}周 / 周{{ dayOfWeekText }}</view>
      <view class="empty-title">今日无课</view>
    </view>
    <view v-else class="course-state">
      <swiper
          @change="onSwiperChange"
          @click="navToCurriculumPage"
          class="course-swiper"
          circular
          :current="currentIdx"
      >
        <swiper-item v-for="course in courses" :key="course.code + course.dayTime.period.start">
          <view class="course-slide">
            <text class="side-arrow cuIcon-back"></text>
            <view class="course-content">
              <view class="week-line">第{{ weekOfTerm }}周 / 周{{ dayOfWeekText }}</view>
              <view class="course-main">
                <view class="course-left">
                  <view class="course-title-row">
                    <view class="name-left"></view>
                    <view class="course-name">{{ course.name }}</view>
                  </view>
                  <view class="period-line">
                    <text>第{{ course.dayTime.period.start }}-{{ course.dayTime.period.end }}节</text>
                    <image class="timetable" :src="getSvgPath('timetable')"/>
                  </view>
                </view>
                <view class="course-right">
                  <view class="classroom" :class="longRoomName(course) ? 'is-long' : ''">
                    {{ getCourseRoom(course) }}
                  </view>
                  <view class="time-text">{{ getTimeText(course.dayTime).replace(' ~ ', ' - ') }}</view>
                </view>
              </view>
              <view class="timeline-dots">
                <view
                    v-for="(state, index) in courseTimeline"
                    :key="index"
                    class="timeline-dot"
                    :class="[state.status, index === activeIdx ? 'active' : '']"
                ></view>
              </view>
            </view>
            <text class="side-arrow cuIcon-right"></text>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script setup lang="ts">
  import CourseModel, {TermOffset} from "@/models/CourseModel";
  import {computed, onMounted, ref} from "vue";
  import {calcDayOfWeek, calcWeeksBetweenDates, stringToDateInChinaTime} from "@/utils/datetime";
  import {calcCurrPeriod, TIME_TABLE} from "@/domain/course";
  import type {UniCourse} from "@/domain/courseSchedule";
  import {getTimeText} from "@/utils/course";
  import CustomCourseModel from "@/models/CustomCourseModel";
  import {getSvgPath} from "@/utils/resource";

  const props = defineProps<{ curriculumPageUrl: string }>();

  const courseModel = CourseModel.getInstance();
  const customCourseModel = CustomCourseModel.getInstance();
  const currDate = ref(new Date());
  const startDate = ref<Date>(new Date());
  const courses = ref<UniCourse[]>([]);
  const hasData = ref(false);
  const activeIdx = ref(0);

  const dayOfWeekText = computed(() => '一二三四五六日'.split('')[calcDayOfWeek(currDate.value)]);
  const weekOfTerm = computed(() => calcWeeksBetweenDates(startDate.value, currDate.value));
  const currentIdx = computed(() => {
    const curr = calcCurrPeriod(currDate.value)[0];
    let i = 0;
    for (; i < courses.value.length; i++) {
      if (curr <= courses.value[i].dayTime.period.start)
        return i;
    }
    return courses.value.length - 1;
  });
  const courseTimeline = computed(() => {
    const now = currDate.value.getHours() * 60 + currDate.value.getMinutes();
    return courses.value.map(course => {
      const start = getCourseStartMinutes(course);
      const end = getCourseEndMinutes(course);
      if (now > end) return {status: "passed"};
      if (now >= start && now <= end) return {status: "current"};
      return {status: "future"};
    });
  });

  onMounted(initData);
  async function initData() {
    currDate.value = new Date();
    startDate.value = new Date();
    const coursesData = await courseModel.getCoursesData(await courseModel.getCurrSelectTerm());
    hasData.value = coursesData !== null;
    if (coursesData !== null) {
      startDate.value = stringToDateInChinaTime(coursesData.startDate);
      courses.value = [...await customCourseModel.get(), ...coursesData.courses]
          // 过滤掉非当前周和非当天
          .filter(it => it.weeks.includes(weekOfTerm.value) && it.dayTime.weekday === calcDayOfWeek(currDate.value))
          // 过滤掉无效时间段
          .filter(it => it.dayTime.period.start !== -1 && it.dayTime.period.end !== -1)
          // 按照开始时间从小到大进行排序
          .sort((a, b) => a.dayTime.period.start - b.dayTime.period.start);
      activeIdx.value = Math.max(0, currentIdx.value);
    }
  }
  async function onTapUpdate() {
    const result = await courseModel.update(TermOffset.CurrTerm);
    if (!result.ok) return;
    await initData();
    await uni.showToast({
      title: "更新完成",
      icon: "success"
    });
  }
  async function navToCurriculumPage() { await uni.navigateTo({ url: props.curriculumPageUrl }) }

  function onSwiperChange(event: Event) {
    const e = event as unknown as { detail: { current: number } };
    activeIdx.value = e.detail?.current ?? 0;
  }

  function getCourseRoom(course: UniCourse) {
    return 'classroom' in course ? course.classroom : course.content;
  }

  function longRoomName(course: UniCourse) {
    return getCourseRoom(course).length > 8;
  }

  function getCourseStartMinutes(course: UniCourse) {
    const startText = TIME_TABLE[course.dayTime.period.start - 1].split('~')[0];
    return parseTimeText(startText);
  }

  function getCourseEndMinutes(course: UniCourse) {
    const endText = TIME_TABLE[course.dayTime.period.end - 1].split('~')[1];
    return parseTimeText(endText);
  }

  function parseTimeText(timeText: string) {
    const [hour, minute] = timeText.split(':').map(it => parseInt(it));
    return hour * 60 + minute;
  }

</script>

<style scoped>
  .course-reminder {
    min-height: 170rpx;
    border-radius: 24rpx;
    background: #fff;
    box-shadow: 0 12rpx 28rpx rgba(31, 43, 58, 0.11);
    overflow: hidden;
  }

  .no-data,
  .empty-day {
    height: 170rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .update-title,
  .empty-title {
    color: #1f2935;
    font-size: 32rpx;
    font-weight: 700;
  }

  .update-hint {
    margin-top: 12rpx;
    color: #8a95a3;
    font-size: 24rpx;
  }

  .course-swiper {
    height: 170rpx;
  }

  .course-slide {
    height: 170rpx;
    display: grid;
    grid-template-columns: 34rpx 1fr 34rpx;
    align-items: center;
  }

  .side-arrow {
    color: #eef1f5;
    font-size: 40rpx;
    text-align: center;
  }

  .course-content {
    min-width: 0;
    padding: 16rpx 0 12rpx;
  }

  .week-line {
    padding-bottom: 12rpx;
    color: #7d8794;
    font-size: 24rpx;
    text-align: center;
    border-bottom: 1rpx solid #f0f2f5;
  }

  .course-main {
    min-height: 74rpx;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 156rpx;
    column-gap: 16rpx;
    align-items: center;
  }

  .course-left {
    min-width: 0;
  }

  .course-title-row {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .name-left {
    width: 5rpx;
    height: 34rpx;
    flex: 0 0 5rpx;
    background-color: #de3f4a;
    margin-right: 12rpx;
  }

  .course-name {
    min-width: 0;
    color: #1f2935;
    font-size: 32rpx;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .period-line {
    margin-top: 6rpx;
    padding-left: 17rpx;
    display: flex;
    align-items: center;
    color: #98a1ad;
    font-size: 24rpx;
  }

  .timetable {
    width: 28rpx;
    height: 28rpx;
    margin-left: 10rpx;
  }

  .course-right {
    min-width: 0;
    text-align: right;
  }

  .classroom {
    color: #de3f4a;
    font-size: 34rpx;
    font-weight: 800;
    line-height: 42rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .classroom.is-long {
    font-size: 28rpx;
  }

  .time-text {
    margin-top: 6rpx;
    color: #667381;
    font-size: 23rpx;
    white-space: nowrap;
  }

  .timeline-dots {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 11rpx;
    min-height: 18rpx;
  }

  .timeline-dot {
    width: 8rpx;
    height: 8rpx;
    border-radius: 50%;
    border: 2rpx solid currentColor;
    color: #c8d0da;
    background: transparent;
  }

  .timeline-dot.passed {
    color: #b7c0cb;
  }

  .timeline-dot.current {
    width: 12rpx;
    height: 12rpx;
    color: #f39a2b;
    background: #f39a2b;
  }

  .timeline-dot.future {
    color: #6b5ce7;
    background: #6b5ce7;
  }

  .timeline-dot.future:nth-child(3n + 1) {
    color: #48bb78;
    background: #48bb78;
  }

  .timeline-dot.future:nth-child(3n + 2) {
    color: #11b7bb;
    background: #11b7bb;
  }

  .timeline-dot.active {
    transform: scale(1.18);
  }

  @media screen and (min-width: 600px) {
    .course-reminder {
      margin-left: 0;
      margin-right: 0;
      min-height: 132px;
      border-radius: 16px;
    }

    .course-swiper,
    .course-slide {
      height: 132px;
    }

    .course-slide {
      grid-template-columns: 32px 1fr 32px;
    }

    .side-arrow {
      font-size: 28px;
    }

    .course-content {
      padding: 12px 0 8px;
    }

    .week-line {
      padding-bottom: 8px;
      font-size: 15px;
    }

    .course-main {
      min-height: 58px;
      grid-template-columns: minmax(0, 1fr) 150px;
    }

    .name-left {
      width: 4px;
      height: 24px;
      flex-basis: 4px;
      margin-right: 9px;
    }

    .course-name {
      font-size: 22px;
      line-height: 28px;
    }

    .period-line {
      margin-top: 4px;
      padding-left: 13px;
      font-size: 15px;
    }

    .timetable {
      width: 18px;
      height: 18px;
      margin-left: 7px;
    }

    .classroom {
      font-size: 24px;
      line-height: 30px;
    }

    .classroom.is-long {
      font-size: 20px;
    }

    .time-text {
      margin-top: 3px;
      font-size: 14px;
    }

    .timeline-dots {
      gap: 8px;
      min-height: 12px;
    }

    .timeline-dot {
      width: 5px;
      height: 5px;
      border-width: 1px;
    }

    .timeline-dot.current {
      width: 8px;
      height: 8px;
    }
  }
</style>
