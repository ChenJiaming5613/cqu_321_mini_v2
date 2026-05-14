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
  gap: 18rpx;
}

.gpa-row {
  display: flex;
  gap: 16rpx;
}

.gpa-card {
  flex: 1;
  height: 126rpx;
  display: grid;
  grid-template-columns: 1fr 150rpx;
  overflow: hidden;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #ffffff 0%, #fff6f4 100%);
  border: 1rpx solid rgba(222, 63, 74, 0.14);
  box-shadow: 0 16rpx 40rpx rgba(31, 43, 58, 0.07);
}

.gpa-label,
.gpa-value {
  display: flex;
  align-items: center;
  justify-content: center;
}

.gpa-label {
  justify-content: flex-start;
  padding-left: 28rpx;
  color: #667381;
  font-size: 25rpx;
}

.gpa-value,
.rank-value {
  color: #de3f4a;
  font-size: 36rpx;
  font-weight: 700;
}

.sync-btn {
  width: 126rpx;
  height: 126rpx;
  padding: 0;
  margin: 0;
  line-height: 1;
  color: #1f2935;
  border: 1rpx solid rgba(219, 225, 235, 0.95);
  border-radius: 24rpx;
  background: #fff;
  box-shadow: 0 16rpx 40rpx rgba(31, 43, 58, 0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sync-btn::after {
  border: none;
}

.sync-btn .cuIcon-people {
  color: #de3f4a;
  font-size: 38rpx;
  line-height: 40rpx;
}

.sync-text {
  margin-top: 8rpx;
  color: #667381;
  font-size: 20rpx;
  transform: scale(0.9);
  transform-origin: center;
  white-space: nowrap;
}

.rank-row {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.rank-card {
  flex: 1;
  min-height: 112rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  border-radius: 22rpx;
  background: #fff;
  border: 1rpx solid rgba(219, 225, 235, 0.95);
  box-shadow: 0 12rpx 30rpx rgba(31, 43, 58, 0.055);
}

.rank-label,
.rank-value {
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-label {
  color: #7d8794;
  font-size: 22rpx;
}

.rank-value {
  margin-top: 8rpx;
  font-size: 32rpx;
}

@media screen and (min-width: 600px) {
  .overview {
    gap: 14px;
  }

  .gpa-row {
    gap: 14px;
  }

  .gpa-card {
    height: 92px;
    grid-template-columns: 1fr 160px;
    border-radius: 16px;
  }

  .gpa-label {
    padding-left: 24px;
    font-size: 17px;
  }

  .gpa-value,
  .rank-value {
    font-size: 30px;
  }

  .sync-btn {
    width: 92px;
    height: 92px;
    border-radius: 16px;
  }

  .sync-btn .cuIcon-people {
    font-size: 28px;
    line-height: 30px;
  }

  .sync-text {
    margin-top: 6px;
    font-size: 13px;
    transform: none;
  }

  .rank-row {
    gap: 14px;
  }

  .rank-card {
    min-height: 84px;
    border-radius: 16px;
  }

  .rank-label {
    font-size: 15px;
  }

  .rank-value {
    margin-top: 5px;
    font-size: 26px;
  }
}
</style>
