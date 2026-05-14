<template>
  <view class="activity-card std-page-margin std-border-radius std-box-shadow std-bottom-margin-wide">
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
  import ActivityModel from "@/models/ActivityModel";
  import type {ActivityInfo, ActivityItem} from "@/models/ActivityModel";
  import {computed, onMounted, ref} from "vue";

  const activityModel = ActivityModel.getInstance();
  const activityInfo = ref<ActivityInfo | null>(null);
  const activityItems = computed<ActivityItem[]>(() => activityInfo.value?.pictures || []);
  onMounted(async () => { activityInfo.value = await activityModel.get() });

  async function navToDetail(activityItem: ActivityItem) {
    if (activityItem.jumpType === "NONE" || activityItem.contentUrl.length === 0) return;
    if (activityItem.jumpType === "URL") {
      await uni.navigateTo({ url: '/pages/index/content/index?url=' + encodeURIComponent(activityItem.contentUrl) });
      return;
    }
    await uni.navigateTo({ url: '/pages/index/content/index?url=' + encodeURIComponent(activityItem.contentUrl) });
  }
  // TODO: 检测活动是否需要更新（目前的策略是缓存中没有活动数据采取更新）
</script>

<style scoped>
.activity-card {
  height: 350rpx;
  width: 700rpx;
  overflow: hidden;
  border: 1rpx solid rgba(219, 225, 235, 0.95);
  background: #fff;
}

@media screen and (min-width: 600px) {
  .activity-card {
    width: 100%;
    max-width: none;
    height: auto;
    aspect-ratio: 2 / 1;
    margin-left: 0;
    margin-right: 0;
    border-radius: 16px;
  }
}

@media screen and (min-width: 900px) {
  .activity-card {
    max-width: 420px;
  }
}

  .img {
    width: 100%;
    height: 100%;
  }
</style>
