<template>
  <view class="tab-shell">
    <view class="tab-track">
      <view @click="$emit('onTapTab', 0)" class="tab" :class="tabCur === 0 ? 'active' : ''">未结束</view>
      <view @click="$emit('onTapTab', 1)" class="tab" :class="tabCur === 1 ? 'active' : ''">已结束</view>
    </view>
  </view>
</template>

<script setup lang="ts">
  defineProps<{ tabCur: number }>();
  defineEmits<{ (e: 'onTapTab', idx: number): void }>();
</script>

<style scoped>
.tab-shell {
  padding: 26rpx 92rpx 28rpx;
  background: #fff;
}

.tab-track {
  display: flex;
  height: 52rpx;
  padding: 2rpx;
  border-radius: 28rpx;
  background: #f1f4f8;
  border: 1rpx solid #e7ebf1;
}

.tab {
  flex: 1;
  height: 48rpx;
  line-height: 48rpx;
  border-radius: 26rpx;
  color: #667381;
  font-size: 24rpx;
  text-align: center;
}

.active {
  color: #de3f4a;
  background: #fff;
  box-shadow: 0 4rpx 12rpx rgba(31, 43, 58, 0.08);
}
</style>
