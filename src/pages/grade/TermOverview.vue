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
  margin-bottom: 22rpx;
  background: #fff;
  border: 1rpx solid rgba(219, 225, 235, 0.95);
  border-radius: 24rpx;
  box-shadow: 0 14rpx 34rpx rgba(31, 43, 58, 0.06);
  overflow: visible;
}

.term-card::before {
  content: "";
  position: absolute;
  left: 24rpx;
  top: 28rpx;
  width: 8rpx;
  height: 34rpx;
  background: #de3f4a;
  border-radius: 999rpx;
}

.term-header {
  min-height: 92rpx;
  padding: 0 22rpx 0 46rpx;
  display: grid;
  grid-template-columns: 124rpx 130rpx 1fr 36rpx;
  align-items: center;
  column-gap: 12rpx;
}

.term-name {
  color: #1f2935;
  font-size: 30rpx;
  font-weight: 600;
}

.term-meta {
  color: #667381;
  font-size: 24rpx;
  font-weight: 600;
  white-space: nowrap;
}

.meta-value {
  color: #de3f4a;
  font-weight: 700;
}

.toggle-icon {
  color: #de3f4a;
  font-size: 34rpx;
  text-align: right;
}

.term-content {
  padding: 0 12rpx 14rpx;
  border-top: 1rpx solid #eef1f5;
}

@media screen and (min-width: 600px) {
  .term-card {
    margin-bottom: 18px;
    border-radius: 18px;
  }

  .term-card::before {
    left: 22px;
    top: 25px;
    width: 5px;
    height: 28px;
  }

  .term-header {
    min-height: 78px;
    padding: 0 22px 0 42px;
    grid-template-columns: 130px auto auto 36px;
    column-gap: 20px;
  }

  .term-name {
    font-size: 24px;
  }

  .term-meta {
    font-size: 16px;
  }

  .toggle-icon {
    font-size: 24px;
  }

  .term-content {
    padding: 14px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 14px;
    row-gap: 14px;
  }
}

@media screen and (min-width: 980px) {
  .term-content {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
