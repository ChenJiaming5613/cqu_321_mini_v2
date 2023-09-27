<template>
  <view class="activity-card std-page-margin std-border-radius">
    <swiper
      class="square-dot"
      indicator-dots
      circular
      style="height: 100%;"
    >
      <swiper-item
        v-for="(activityItem, index) in activityItems"
        :key="index"
        class="text-center"
        @click="() => { navToDetail(activityItem) }">
        <image class="img std-border-radius" :src="activityItem.localUrl || activityItem.url" mode="aspectFill" show-menu-by-longpress></image>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup lang="ts">
  import ActivityModel, {ActivityInfo, ActivityItem} from "@/models/ActivityModel";
  import {computed, ref} from "vue";
  import {onShow} from "@dcloudio/uni-app";
  const activityModel = ActivityModel.getInstance();
  const activityInfo = ref<ActivityInfo | null>(null);
  const activityItems = computed<ActivityItem[]>(() => activityInfo.value?.pictures || []);
  onShow(async () => { activityInfo.value = await activityModel.get() });
  async function navToDetail(activityItem: ActivityItem) {
    await uni.navigateTo({ url: './content/index?url=' + activityItem.contentUrl });
  }
  // TODO: 检测活动是否需要更新（目前的策略是缓存中没有活动数据采取更新）
</script>

<style scoped>
  .activity-card {
    height: 350rpx;
    width: 700rpx;
    margin-bottom: 25rpx;
    box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.3);
  }

  .img {
    width: 100%;
    height: 100%;
  }
</style>