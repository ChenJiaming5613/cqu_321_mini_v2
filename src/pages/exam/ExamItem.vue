<template>
  <view @click="$emit('click', examInfo)" class="exam-card" :class="{ over: isOver }">
    <view class="accent"></view>
    <view class="head-row">
      <view class="name-wrap">
        <view class="green-dot"></view>
        <view class="exam-name">{{displayName}}</view>
      </view>
      <view class="hint" :class="calcHintColorClass(days, isOver)">
        <text class="hint-left">{{hint.left}}</text>
        <text class="hint-right">{{hint.right}}</text>
      </view>
    </view>
    <view class="info-row">
      <view class="info-cell">
        <view class="green-dot small"></view>
        <text>{{examInfo.date}}</text>
      </view>
      <text>{{examInfo.startTime}}~{{examInfo.endTime}}</text>
    </view>
    <view class="info-row">
      <view class="info-cell">
        <view class="green-dot small"></view>
        <text>考场地点：{{examInfo.classroom}}</text>
      </view>
      <text>座位号：{{examInfo.seatNum}}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
  import type {ExamInfo} from "@/models/ExamModel";
  import {computed} from "vue";
  import {calcHintColorClass} from "@/pages/exam/util";
  const props = defineProps<{ examInfo: ExamInfo, days: number, isOver: boolean, isSelf: boolean }>();
  defineEmits<{ (e: 'click', examInfo: ExamInfo): void }>();
  const displayName = computed(() => props.examInfo.name.replace('🍒', ''));
  const hint = computed(() => {
    if (props.isOver) return { left: '已结束', right: '' };
    if (props.days === 0) return { left: '今天', right: '' };
    if (props.days === 1) return { left: '明天', right: ''};
    return {
      left: Math.abs(props.days),
      right: "天" + (props.days > 0 ? "后" : "前")
    };
  });
</script>

<style scoped>
.exam-card {
  position: relative;
  margin: 0 40rpx 22rpx;
  padding: 0 28rpx;
  border-radius: 2rpx;
  background: #fff;
  color: #666;
  font-size: 28rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
}

.exam-card.over {
  opacity: 0.38;
}

.accent {
  position: absolute;
  left: 0;
  top: 24rpx;
  width: 4rpx;
  height: 40rpx;
  background: #e95b67;
}

.head-row,
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 82rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: 0;
}

.name-wrap,
.info-cell {
  display: flex;
  align-items: center;
  min-width: 0;
}

.exam-name {
  overflow: hidden;
  max-width: 430rpx;
  color: #666;
  font-size: 29rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.green-dot {
  width: 8rpx;
  height: 8rpx;
  margin-right: 24rpx;
  border-radius: 50%;
  background: #67cb68;
  flex: 0 0 auto;
}

.green-dot.small {
  width: 6rpx;
  height: 6rpx;
  margin-left: 2rpx;
  margin-right: 26rpx;
}

.hint {
  margin-left: 20rpx;
  color: #e95b67;
  white-space: nowrap;
}

.hint-left {
  font-size: 34rpx;
  font-weight: 700;
}

.hint-right {
  margin-left: 2rpx;
  font-size: 26rpx;
}

.info-row {
  color: #666;
  font-size: 28rpx;
}
</style>
