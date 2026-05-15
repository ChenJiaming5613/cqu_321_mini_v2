<template>
  <view class="page">
    <NavigationBar
      pageTitle="课程表"
      :isFixed="true"
      :show-refresh="true"
      @refresh="updateCourseInfo"
    />
    <view v-if="isRefreshing" class="refresh-mask">
      <text class="cuIcon-loading2 refresh-icon"></text>
      <text>同步中</text>
    </view>
    <template v-if="pageState === 'ready'">
      <Footer
        :week-of-term="weekOfTerm"
        @on-tap-prev-week="onTapPrevWeek"
        @on-tap-next-week="onTapNextWeek"
        @on-tap-switch-term="onTapSwitchTerm"
        @on-tap-more-func="onTapMoreFunc"
      />
      <Header :curr-date="currDate" :day-of-week="dayOfWeek"/>
      <view v-if="isWeixinMiniProgram" class="inline-refresh-row">
        <button class="inline-refresh" @click="updateCourseInfo">
          <text class="cuIcon-refresh"></text>
          <text>刷新课表</text>
        </button>
      </view>
      <view class="table-scroll">
        <CourseTable
            :table-items="tableItems"
            :curr-date="currDate"
            :curr-week-of-term="weekOfTerm"
            :fixed-week-of-term="fixedWeekOfTerm"
            @on-tap-detail="onTapDetail
        "/>
      </view>
    </template>
    <view v-else class="state-wrap">
      <PageState
        :state="pageState"
        empty-message="暂无课表"
        empty-hint="当前学期暂时没有可展示的课程数据"
        empty-action-text="刷新课表"
        error-message="课表加载失败"
        @empty-action="updateCourseInfo"
        @retry="loadCurriculumPageData"
      />
    </view>
    <CourseDetail
      :courses="activeCourses"
      :is-show="isShowDetail"
      @click="isShowDetail = false"
    />
  </view>
</template>

<script setup lang="ts">
  import NavigationBar from "@/pages/components/NavigationBar.vue";
  import CourseModel, {TermOffset} from "@/models/CourseModel";
  import {onPullDownRefresh} from "@dcloudio/uni-app";
  import {computed, ref} from "vue";
  import stdUser from "@/core/StdUser";
  import {getCourseCells, makeColorMap, makeCoursesMatrix} from "@/pages/curriculum/util";
  import type {UniCourse} from "@/pages/curriculum/util";
  import {
    calcDateAfterNDays,
    calcDayOfWeek,
    calcWeeksBetweenDates,
    stringToDateInChinaTime
  } from "@/utils/datetime";
  import Header from "@/pages/curriculum/Header.vue";
  import Footer from "@/pages/curriculum/Footer.vue";
  import CourseTable from "@/pages/curriculum/CourseTable.vue";
  import CourseDetail from "@/pages/curriculum/CourseDetail.vue";
  import PageState from "@/pages/components/PageState.vue";
  import CustomCourseModel from "@/models/CustomCourseModel";
  import CoursePriorityModel from "@/models/CoursePriorityModel";
  import {useAuthorizedPageData} from "@/composables/useAuthorizedPageData";

  let isWeixinMiniProgram = false;
  // #ifdef MP-WEIXIN
  isWeixinMiniProgram = true;
  // #endif

  const courseModel = CourseModel.getInstance();
  const customCourseModel = CustomCourseModel.getInstance();
  // CONST
  let colorMap: Map<string, string> = new Map<string, string>();
  const fixedWeekOfTerm = ref(0);
  // STATUS
  const termOffset = ref<TermOffset>(TermOffset.CurrTerm);
  const termName = ref<string>("unknown");
  const currDate = ref(new Date());
  const startDate = ref<Date>(new Date());
  const courses = ref<UniCourse[]>([]);
  const activeCourses = ref<UniCourse[]>([]);
  const isShowDetail = ref(false);
  const isRefreshing = ref(false);
  // COMPUTED
  const dayOfWeek = computed(() => calcDayOfWeek(currDate.value));
  const weekOfTerm = computed(() => calcWeeksBetweenDates(startDate.value, currDate.value));
  const currWeekCourses = computed(() => {
    return courses.value
        // 过滤掉非当前周
        .filter(it => it.weeks.includes(weekOfTerm.value))
        // 过滤掉无效时间段
        .filter(it => it.dayTime.period.start !== -1 && it.dayTime.period.end !== -1);
  });
  const coursesMatrix = computed(() => makeCoursesMatrix(currWeekCourses.value));
  const hasTermData = computed(() => termName.value !== "unknown");
  const {
    hasLoadError,
    pageState,
    loadPageData: loadCurriculumPageData
  } = useAuthorizedPageData({
    hasReadyData: () => hasTermData.value,
    hasInitialData: () => hasTermData.value,
    loadData: loadCurriculumData,
    clearData: () => {
      termName.value = "unknown";
      courses.value = [];
    },
    logTag: "CurriculumPage",
    registerOnShow: true
  });
  const tableItems = computed(() => {
    return getCourseCells(coursesMatrix.value).map(it => {
      it.bgColor = colorMap.get(it.course.code) || 'gray';
      return it;
    });
  });

  async function loadCurriculumData() {
    await CoursePriorityModel.getInstance().load();
    termOffset.value = await courseModel.getCurrSelectTerm();
    const coursesData = await courseModel.getCoursesData(termOffset.value);
    courses.value = [];
    if (coursesData !== null) {
      termName.value = coursesData.termName;
      startDate.value = stringToDateInChinaTime(coursesData.startDate);
      fixedWeekOfTerm.value = weekOfTerm.value;
      const tmpCourses: UniCourse[] = [...coursesData.courses];
      tmpCourses.push(...await customCourseModel.get());
      colorMap = makeColorMap(tmpCourses);
      courses.value = tmpCourses;
    }
  }

  onPullDownRefresh(async () => {
    try {
      await updateCourseInfo();
    } finally {
      uni.stopPullDownRefresh();
    }
  });
  async function updateCourseInfo() {
    if (isRefreshing.value) return;
    if (await stdUser.getUserInfo(false) === null) return;
    isRefreshing.value = true;
    try {
      hasLoadError.value = false;
      const isUpdated = await courseModel.update(termOffset.value);
      if (!isUpdated) {
        hasLoadError.value = true;
        return;
      }
      await loadCurriculumData();
      await uni.showToast({
        title: "更新完成",
        icon: "success"
      });
    } finally {
      isRefreshing.value = false;
    }
  }

  function onTapNextWeek() { switchWeek(1); }
  function onTapPrevWeek() { switchWeek(-1); }
  function switchWeek(deltaWeek: number) {
    currDate.value = calcDateAfterNDays(currDate.value, deltaWeek * 7);
  }

  function onTapMoreFunc() {
    uni.showActionSheet({
      itemList: [
        '切换学期',
        '自定义课表'
      ],
      success: async result => {
        if (result.tapIndex === 0) { await onTapSwitchTerm(); }
        else if (result.tapIndex === 1) { await uni.navigateTo({ url: './edit/index' }); }
      }
    });
  }
  async function onTapSwitchTerm() {
    const termNames = await courseModel.getTermNames();
    const itemList = [
      termNames.curr || "【当前学期】点击更新",
      termNames.next || "【下一学期】点击更新"
    ];
    itemList[termOffset.value] += '🍉';
    uni.showActionSheet({
      itemList: itemList,
      success: async result => {
        termOffset.value = result.tapIndex;
        await courseModel.setCurrSelectTerm(termOffset.value);
        await loadCurriculumPageData();
        if ((termOffset.value === TermOffset.CurrTerm ? termNames.curr : termNames.next) === null) {
          await updateCourseInfo();
        }
      }
    });
  }
  function onTapDetail(course: UniCourse) {
    const namesSet = new Set<string>();
    // 保证course第一个显示
    namesSet.add(course.name);
    const targetCourses: UniCourse[] = [course];
    const i = course.dayTime.weekday;
    for (let j = course.dayTime.period.start - 1; j < course.dayTime.period.end; j++) {
      for (const currCourse of coursesMatrix.value[i][j]) {
        if (!namesSet.has(currCourse.name)) {
          targetCourses.push(currCourse);
          namesSet.add(currCourse.name);
        }
      }
    }
    activeCourses.value = targetCourses;
    isShowDetail.value = true;
  }
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f7fb;
}

.refresh-mask {
  position: fixed;
  top: 196rpx;
  right: 28rpx;
  z-index: 200;
  height: 58rpx;
  padding: 0 22rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.94);
  border: 1rpx solid rgba(219, 225, 235, 0.95);
  box-shadow: 0 10rpx 26rpx rgba(31, 43, 58, 0.12);
  color: #de3f4a;
  font-size: 24rpx;
}

.state-wrap {
  padding-top: 180rpx;
}

.inline-refresh-row {
  padding: 14rpx 22rpx;
  background: #fff;
  border-bottom: 1rpx solid #eef1f5;
}

.inline-refresh {
  height: 58rpx;
  padding: 0 22rpx;
  margin: 0 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8rpx;
  border: 1rpx solid rgba(219, 225, 235, 0.95);
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.94);
  color: #de3f4a;
  font-size: 24rpx;
  line-height: 58rpx;
}

.inline-refresh::after {
  border: none;
}

.refresh-icon {
  font-size: 30rpx;
  animation: refresh-rotate 0.9s linear infinite;
}

@keyframes refresh-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media screen and (min-width: 600px) {
  .table-scroll {
    overflow-x: auto;
    max-width: 100vw;
  }

  .refresh-mask {
    top: 150px;
    right: 28px;
    height: 40px;
    padding: 0 16px;
    font-size: 15px;
  }

  .refresh-icon {
    font-size: 20px;
  }

  .state-wrap {
    padding-top: 154px;
  }

  .inline-refresh-row {
    padding: 10px 22px;
  }

  .inline-refresh {
    height: 40px;
    padding: 0 16px;
    font-size: 15px;
    line-height: 40px;
  }
}
</style>
