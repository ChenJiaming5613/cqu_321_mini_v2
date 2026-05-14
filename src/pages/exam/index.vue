<template>
  <NavigationBar pageTitle="考试安排" show-refresh @refresh="onTapUpdate"/>
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
</template>

<script setup lang="ts">
  import NavigationBar from "@/pages/components/NavigationBar.vue";
  import PageState from "@/pages/components/PageState.vue";
  import ExamModel, {type ExamInfo} from "@/models/ExamModel";
  import {onPullDownRefresh, onShow} from "@dcloudio/uni-app";
  import {computed, ref} from "vue";
  import stdUser from "@/core/StdUser";
  import ExamItem from "@/pages/exam/ExamItem.vue";
  import TabBar from "@/pages/exam/TabBar.vue";
  import {calcDaysBetweenDates, stringToDateInChinaTime, truncDate} from "@/utils/datetime";
  const examModel = ExamModel.getInstance();
  const examInfoList = ref<ExamInfo[]>([]);
  const hasUserInfo = ref(false);
  const hasLoadError = ref(false);
  const isLoading = ref(false);
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
  const pageState = computed<"loading" | "unauthorized" | "empty" | "error" | "ready">(() => {
    if (isLoading.value && examInfoList.value.length === 0) return "loading";
    if (!hasUserInfo.value) return "unauthorized";
    if (hasLoadError.value) return "error";
    if (currExamInfoList.value.length === 0) return "empty";
    return "ready";
  });

  onShow(async () => {
    await loadExamInfo();
  });
  onPullDownRefresh(async () => {
    try {
      await onTapUpdate();
    } finally {
      uni.stopPullDownRefresh();
    }
  });
  async function loadExamInfo() {
    isLoading.value = true;
    try {
      hasLoadError.value = false;
      hasUserInfo.value = await stdUser.getUserInfo(false) !== null;
      if (!hasUserInfo.value) {
        examInfoList.value = [];
        return;
      }
      examInfoList.value = await examModel.get();
      currDate.value = new Date();
    } catch (e) {
      console.error("[ExamPage] load failed", e);
      examInfoList.value = [];
      hasLoadError.value = true;
    } finally {
      isLoading.value = false;
    }
  }
  async function onTapUpdate() {
    hasUserInfo.value = await stdUser.getUserInfo(false) !== null;
    if (!hasUserInfo.value) return;
    isLoading.value = true;
    try {
      hasLoadError.value = false;
      const isUpdated = await examModel.update();
      if (!isUpdated) {
        hasLoadError.value = true;
        return;
      }
      examInfoList.value = await examModel.get();
      await uni.showToast({ title: "更新完成", icon: "success" });
    } catch (e) {
      console.error("[ExamPage] update failed", e);
      hasLoadError.value = true;
    } finally {
      isLoading.value = false;
    }
  }
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
