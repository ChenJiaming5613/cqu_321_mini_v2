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
  margin: 0 32rpx 22rpx;
  padding: 0 28rpx;
  border-radius: 24rpx;
  background: #fff;
  color: #52606f;
  font-size: 28rpx;
  border: 1rpx solid rgba(219, 225, 235, 0.95);
  box-shadow: 0 14rpx 34rpx rgba(31, 43, 58, 0.06);
  overflow: hidden;
}

.exam-card.over {
  opacity: 0.38;
}

.accent {
  position: absolute;
  left: 0;
  top: 24rpx;
  width: 6rpx;
  height: 40rpx;
  background: #de3f4a;
  border-radius: 999rpx;
}

.head-row,
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 82rpx;
  border-bottom: 1rpx solid #eef1f5;
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
  color: #1f2935;
  font-size: 29rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.green-dot {
  width: 8rpx;
  height: 8rpx;
  margin-right: 24rpx;
  border-radius: 50%;
  background: #48bb78;
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
  color: #de3f4a;
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
  color: #52606f;
  font-size: 28rpx;
}

@media screen and (min-width: 600px) {
  .exam-card {
    margin: 0;
    padding: 0 20px;
    border-radius: 18px;
    font-size: 16px;
  }

  .accent {
    top: 18px;
    width: 4px;
    height: 30px;
  }

  .head-row,
  .info-row {
    min-height: 58px;
  }

  .exam-name {
    max-width: 260px;
    font-size: 17px;
  }

  .green-dot {
    width: 6px;
    height: 6px;
    margin-right: 14px;
  }

  .green-dot.small {
    width: 4px;
    height: 4px;
    margin-right: 14px;
  }

  .hint-left {
    font-size: 24px;
  }

  .hint-right {
    font-size: 16px;
  }

  .info-row {
    font-size: 15px;
  }
}
</style>
