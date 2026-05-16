<template>
  <view
    class="page-shell"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="resetPullState"
  >
    <NavigationBar pageTitle="考试安排" show-refresh @refresh="onTapUpdate"/>
    <PullRefreshIndicator
      :pull-distance="pullDistance"
      :threshold="pullRefreshThreshold"
      :is-refreshing="isLoading"
      :text="pullText"
    />
    <view class="tabs-shell">
      <TabBar
        :tab-cur="tabCur"
        @on-tap-tab="newTabCur => tabCur = newTabCur"
      />
    </view>
    <view class="page">
      <PageState
          v-if="pageState !== 'ready'"
          :state="pageState"
          empty-message="暂无考试安排"
          empty-hint="当前账号暂时没有可展示的考试安排"
          empty-action-text="刷新考试安排"
          error-message="考试安排加载失败"
          @empty-action="onTapUpdate"
          @retry="loadExamInfo"
      />
      <view v-else class="exam-list">
        <ExamItem
            v-for="examInfo in currExamInfoList"
            :key="examInfo.name"
            :exam-info="examInfo"
            :days="calcDays(examInfo)"
            :is-over="tabCur !== 0"
            :is-self="examModel.isSelfExam(examInfo.name)"
            @click="onTapExamItem"
        />
      </view>
      <view class="custom-entry" @click="onTapAdd">添加自定义考试</view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import NavigationBar from "@/pages/components/NavigationBar.vue";
  import PageState from "@/pages/components/PageState.vue";
  import ExamModel, {type ExamInfo} from "@/models/ExamModel";
  import {computed, ref} from "vue";
  import ExamItem from "@/pages/exam/ExamItem.vue";
  import TabBar from "@/pages/exam/TabBar.vue";
  import {calcDaysBetweenDates, stringToDateInChinaTime, truncDate} from "@/utils/datetime";
  import {useAuthorizedPageData} from "@/composables/useAuthorizedPageData";
  import {usePullRefresh} from "@/composables/usePullRefresh";
  import PullRefreshIndicator from "@/pages/components/PullRefreshIndicator.vue";
  import {usePageScrollTop} from "@/composables/usePageScrollTop";
  const examModel = ExamModel.getInstance();
  const {isAtTop} = usePageScrollTop();
  const examInfoList = ref<ExamInfo[]>([]);
  const tabCur = ref(0);
  const currDate = ref(new Date());

  const currExamInfoList = computed(() => examInfoList.value
      .filter(it => {
        const currTime = currDate.value.getTime();
        const endTime = stringToDateInChinaTime(it.date + ' ' + it.endTime).getTime();
        return tabCur.value === 0 ? currTime <= endTime : currTime > endTime;
      })
      .sort((a, b) => {
        return tabCur.value === 0 ?
            stringToDateInChinaTime(a.date + ' ' + a.startTime).getTime()
            - stringToDateInChinaTime(b.date + ' ' + b.startTime).getTime()
            :
            stringToDateInChinaTime(b.date + ' ' + b.endTime).getTime()
            - stringToDateInChinaTime(a.date + ' ' + a.endTime).getTime();
      })
  );
  const {
    isLoading,
    pageState,
    loadPageData: loadExamInfo,
    refreshPageData: onTapUpdate
  } = useAuthorizedPageData({
    hasReadyData: () => currExamInfoList.value.length > 0,
    hasInitialData: () => examInfoList.value.length > 0,
    loadData: async () => {
      examInfoList.value = await examModel.get();
      currDate.value = new Date();
    },
    refreshData: () => examModel.update(),
    clearData: () => {
      examInfoList.value = [];
    },
    logTag: "ExamPage",
    successMessage: "更新完成",
    registerOnShow: true
  });
  const {
    pullDistance,
    pullRefreshThreshold,
    pullText,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    resetPullState
  } = usePullRefresh({
    isRefreshing: isLoading,
    canStartPull: () => isAtTop.value,
    onRefresh: onTapUpdate
  });

  function calcDays(examInfo: ExamInfo) {
    const examDate = stringToDateInChinaTime(examInfo.date);
    return calcDaysBetweenDates(truncDate(currDate.value), examDate);
  }
  async function onTapAdd() {
    await uni.navigateTo({ url: "./edit/index" });
  }
  async function onTapExamItem(examInfo: ExamInfo) {
    if (!examModel.isSelfExam(examInfo.name)) return;
    await uni.showActionSheet({
      itemList: ['删除', '修改'],
      success: async (result) => {
        if (result.tapIndex === 0) {
          await examModel.deleteByName(examInfo.name);
          examInfoList.value = await examModel.get();
          await uni.showToast({ title: "已删除", icon: "success" });
        }
        else {
          await uni.navigateTo({ url: './edit/index?name=' + encodeURIComponent(examInfo.name) });
        }
      }
    });
  }
</script>

<style scoped>
.page {
  min-height: calc(100vh - 260rpx);
  padding: 26rpx 0 80rpx;
  background: #f5f7fb;
}

.page-shell {
  min-height: 100vh;
  background: #f5f7fb;
}

.tabs-shell {
  padding-top: 180rpx;
  background: #fff;
  border-bottom: 1rpx solid #eef1f5;
}

.custom-entry {
  margin: 24rpx auto 0;
  width: 220rpx;
  height: 54rpx;
  line-height: 54rpx;
  color: #667381;
  font-size: 24rpx;
  text-align: center;
}

@media screen and (min-width: 600px) {
  .page {
    max-width: 920px;
    margin: 0 auto;
    padding: 24px 28px 72px;
    box-sizing: border-box;
  }

  .tabs-shell {
    padding-top: 154px;
  }

  .exam-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 18px;
    row-gap: 18px;
  }

  .custom-entry {
    margin-top: 22px;
    width: 160px;
    height: 38px;
    line-height: 38px;
    font-size: 15px;
  }
}
</style>
