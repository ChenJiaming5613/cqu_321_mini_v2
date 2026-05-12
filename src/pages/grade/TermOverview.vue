<template>
  <view class="term-card" :class="isExpand ? 'is-expand' : ''">
    <view class="term-header" @click="$emit('toggle')">
      <view class="term-name">{{termName}}</view>
      <view class="term-meta">
        <text>学分：</text>
        <text class="meta-value">{{credit}}</text>
      </view>
      <view class="term-meta">
        <text>学期绩点：</text>
        <text class="meta-value">{{termAvgGpa.four}}</text>
      </view>
      <text class="toggle-icon" :class="isExpand ? 'cuIcon-fold' : 'cuIcon-unfold'"></text>
    </view>
    <view v-if="isExpand" class="term-content">
      <slot></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
  defineProps<{
    termName: string
    credit: number
    termAvgGpa: {four: number, five: number}
    isExpand: boolean
  }>();
  defineEmits<{
    (e: 'toggle'): void
  }>();
</script>

<style scoped>
.term-card {
  position: relative;
  margin-bottom: 20rpx;
  background: #fff;
  border-radius: 8rpx;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.04);
  overflow: visible;
}

.term-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 24rpx;
  width: 4rpx;
  height: 38rpx;
  background: #e6505f;
  border-radius: 2rpx;
}

.term-header {
  min-height: 84rpx;
  padding: 0 22rpx;
  display: grid;
  grid-template-columns: 128rpx 132rpx 1fr 34rpx;
  align-items: center;
  column-gap: 12rpx;
}

.term-name {
  color: #5e6570;
  font-size: 30rpx;
  font-weight: 600;
}

.term-meta {
  color: #46505d;
  font-size: 26rpx;
  font-weight: 600;
  white-space: nowrap;
}

.meta-value {
  color: #e6505f;
  font-weight: 700;
}

.toggle-icon {
  color: #e6505f;
  font-size: 34rpx;
  text-align: right;
}

.term-content {
  padding: 0 10rpx 10rpx;
  border-top: 2rpx solid #f4f4f4;
}
</style>
