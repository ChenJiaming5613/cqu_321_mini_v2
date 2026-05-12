<template>
  <view class="overview">
    <view class="gpa-row">
      <view class="gpa-card">
        <view class="gpa-label">综合绩点（教务网）</view>
        <view class="gpa-value">{{formatValue(gpaInfo.gpa)}}</view>
      </view>
      <button class="sync-btn" :disabled="isLoading" @click="$emit('update')">
        <text class="cuIcon-people"></text>
        <text class="sync-text">{{isLoading ? '同步中' : '教务网'}}</text>
      </button>
    </view>
    <view class="rank-row">
      <view class="rank-card">
        <view class="rank-label">专业排名</view>
        <view class="rank-value">{{formatValue(gpaInfo.majorRanking)}}</view>
      </view>
      <view class="rank-card">
        <view class="rank-label">班级排名</view>
        <view class="rank-value">{{formatValue(gpaInfo.classRanking)}}</view>
      </view>
      <view class="rank-card">
        <view class="rank-label">年级排名</view>
        <view class="rank-value">{{formatValue(gpaInfo.gradeRanking)}}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import type {GpaInfo} from "@/models/GradeModel";
  defineProps<{ gpaInfo: GpaInfo, isLoading: boolean }>();
  defineEmits<{
    (e: 'update'): void
  }>();

  function formatValue(value: number | null) {
    if (value === null || value === undefined) return '--';
    return value;
  }
</script>

<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.gpa-row {
  display: flex;
  gap: 16rpx;
}

.gpa-card,
.rank-card,
.sync-btn {
  border: 2rpx solid #dedede;
  border-radius: 8rpx;
  background: #f9f9f9;
}

.gpa-card {
  flex: 1;
  height: 78rpx;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
}

.gpa-label,
.gpa-value {
  display: flex;
  align-items: center;
  justify-content: center;
}

.gpa-label {
  color: #6d7480;
  font-size: 23rpx;
  border-right: 2rpx solid #dedede;
}

.gpa-value,
.rank-value {
  color: #e6505f;
  font-size: 26rpx;
  font-weight: 700;
}

.sync-btn {
  width: 78rpx;
  height: 78rpx;
  padding: 0;
  margin: 0;
  line-height: 1;
  color: #777;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sync-btn::after {
  border: none;
}

.sync-btn .cuIcon-people {
  font-size: 32rpx;
  line-height: 34rpx;
}

.sync-text {
  margin-top: 2rpx;
  font-size: 14rpx;
  transform: scale(0.82);
  transform-origin: center;
  white-space: nowrap;
}

.rank-row {
  display: flex;
  justify-content: space-between;
  gap: 24rpx;
}

.rank-card {
  flex: 1;
  height: 78rpx;
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  overflow: hidden;
}

.rank-label,
.rank-value {
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-label {
  color: #6d7480;
  font-size: 23rpx;
  border-right: 2rpx solid #dedede;
}
</style>
