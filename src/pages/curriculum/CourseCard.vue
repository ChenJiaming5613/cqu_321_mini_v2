<template>
  <view class="std-border-radius margin-left margin-right padding-left padding-top padding-bottom-sm padding-right std-box-shadow bg-white flex flex-direction text-center std-bottom-margin-normal">
    <view v-if="!hasData" class="bg-white" @click="onTapUpdate">
      <view class="text-bold text-orange padding-bottom-sm">👉 点击更新课程数据 👋</view>
    </view>
    <view v-else-if="courses.length === 0" class="bg-white" @click="navToCurriculumPage">
      <view class="text-grey text-lg row0">第{{ weekOfTerm }}周 / 周{{ dayOfWeekText }}</view>
      <view class="text-bold text-black text-xl  padding-bottom-sm">🎉 今日无课 ✨</view>
    </view>
    <swiper
        v-else
        @click="navToCurriculumPage"
        class="square-dot"
        indicator-dots
        circular
        indicator-color="#767676"
        indicator-active-color="#fd6260"
        style="height: 220rpx;"
        :current="currentIdx"
    >
      <swiper-item class="bg-white" v-for="(course, index) in courses" :key="index">
        <view>
          <view class="text-grey text-df row0">第{{ weekOfTerm }}周 / 周{{ dayOfWeekText }}</view>
          <view class="flex justify-between row1">
            <view class="flex">
              <view class="name-left"></view>
              <view class="course-name std-color-main">{{ formatTextOverflow(course.name, 8) }}</view>
            </view>
            <view class="classroom std-bg-gradient" :style="{ fontSize: ('classroom' in course ? course['classroom'] : course['content']).length > 7 ? '30rpx' : '34rpx' }">{{ formatTextOverflow('classroom' in course ? course['classroom'] : course['content'], 13) }}</view>
          </view>
          <view class="flex justify-between">
            <view class="flex row2">
              <view class="text-df text-grey margin-right-xs">第{{ course.dayTime.period.start }}-{{ course.dayTime.period.end }}节</view>
              <image class="timetable" :src="getSvgPath('timetable')"/>
            </view>
            <view class="text-df text-grey">{{ getTimeText(course.dayTime) }}</view>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup lang="ts">
  import CourseModel, {TermOffset} from "@/models/CourseModel";
  import {computed, onMounted, ref} from "vue";
  import {calcDayOfWeek, calcWeeksBetweenDates, stringToDateInChinaTime} from "@/utils/datetime";
  import {formatTextOverflow} from "@/utils/util";
  import {calcCurrPeriod} from "./util";
  import type {UniCourse} from "./util";
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
    }
  }
  async function onTapUpdate() {
    await courseModel.update(TermOffset.CurrTerm);
    await initData();
    await uni.showToast({
      title: "更新完成",
      icon: "success"
    });
  }
  async function navToCurriculumPage() { await uni.navigateTo({ url: props.curriculumPageUrl }) }

</script>

<style scoped>
  .classroom {
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    font-weight: bold;
    vertical-align: middle;
  }
  .name-left {
    width: 5rpx;
    background-color: #FF8F1F;
    margin-right: 10rpx;
    vertical-align: middle;
  }
  .course-name {
    font-size: 34rpx;
    font-weight: bold;
  }
  .week-name {
    font-size: 34rpx;
  }
  .row0 {
    padding-bottom: 5rpx;
    margin-bottom: 20rpx;
    border-bottom: 1rpx solid #F5F5F5;
  }
  .row1 {
    align-items: center;
    padding-bottom: 10rpx;
  }
  .row1-0 {
    align-items: center;
  }
  .row2 {
    align-items: center;
  }
  .timetable {
    width: 30rpx;
    height: 30rpx;
  }
</style>
