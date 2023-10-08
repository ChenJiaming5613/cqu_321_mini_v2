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
  import {ActivityItem} from "@/models/ActivityModel";

  defineProps<{ activityItems: ActivityItem[] }>();

  async function navToDetail(activityItem: ActivityItem) {
    await uni.navigateTo({ url: '/pages/index/content/index?url=' + activityItem.contentUrl });
  }
  // TODO: 检测活动是否需要更新（目前的策略是缓存中没有活动数据采取更新）
</script>

<style scoped>
  .activity-card {
    height: 350rpx;
    width: 700rpx;
  }

  .img {
    width: 100%;
    height: 100%;
  }
</style>