<template>
  <view class="week-switch bg-white text-center flex align-center justify-center">
    <view class="cuIcon-back switch-icon" @click="$emit('onTapPrevWeek')"></view>
    <view class="week-title text-bold" @click="$emit('onTapSwitchTerm')">第 {{ weekOfTerm }} 周</view>
    <view class="cuIcon-right switch-icon" @click="$emit('onTapNextWeek')"></view>
    <view class="cuIcon-apps more-icon" @click="$emit('onTapMoreFunc')"></view>
  </view>
</template>

<script setup lang="ts">
  defineProps<{weekOfTerm: number}>();
  defineEmits<{
    (e: 'onTapPrevWeek'): void
    (e: 'onTapNextWeek'): void
    (e: 'onTapSwitchTerm'): void
    (e: 'onTapMoreFunc'): void
  }>();
</script>

<style scoped>
  .week-switch {
    position: fixed;
    top: 180rpx;
    width: 100%;
    height: 82rpx;
    z-index: 100;
    border-top: 1rpx solid #f8f8f8;
    border-bottom: 1rpx solid #f0f0f0;
  }

  .switch-icon {
    color: #d8d8d8;
    font-size: 42rpx;
    font-weight: bold;
    padding: 20rpx 56rpx;
  }

  .week-title {
    color: #ef4f5f;
    font-size: 34rpx;
    min-width: 156rpx;
    line-height: 82rpx;
  }

  .more-icon {
    position: absolute;
    right: 24rpx;
    top: 0;
    color: #9a9a9a;
    font-size: 38rpx;
    line-height: 82rpx;
    padding: 0 24rpx;
  }
</style>
