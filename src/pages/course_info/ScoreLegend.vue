<template>
  <view class="score-legend">
    <view v-for="item in scoreLevels" :key="item.label" class="legend-item">
      <view class="legend-dot" :style="{ backgroundColor: item.color }"></view>
      <text>{{item.label}}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
  const scoreLevels = [
    { label: "[0,60]", color: "#ff3d46" },
    { label: "[60,70]", color: "#ff9718" },
    { label: "[70,80]", color: "#6fc45c" },
    { label: "[80,90]", color: "#11b7bb" },
    { label: "[90,100]", color: "#0a65d8" }
  ];
</script>

<style scoped>
.score-legend {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 22rpx 48rpx 34rpx;
  color: #667381;
  font-size: 20rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  min-width: 0;
}

.legend-dot {
  width: 18rpx;
  height: 18rpx;
  margin-right: 8rpx;
  border-radius: 3rpx;
}

@media screen and (min-width: 600px) {
  .score-legend {
    margin: 18px 6px 24px;
    font-size: 13px;
  }

  .legend-dot {
    width: 10px;
    height: 10px;
    margin-right: 6px;
    border-radius: 2px;
  }
}
</style>
