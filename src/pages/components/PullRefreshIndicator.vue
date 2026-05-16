<template>
  <view
    v-if="pullDistance > 0 || isRefreshing"
    class="pull-refresh-indicator"
    :style="{transform: `translateY(${Math.min(pullDistance, threshold)}rpx)`}"
  >
    <text v-if="isRefreshing" class="cuIcon-loading2 refresh-icon"></text>
    <text>{{ text }}</text>
  </view>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  pullDistance: number
  threshold: number
  isRefreshing?: boolean
  text: string
}>(), {
  isRefreshing: false
});
</script>

<style scoped>
.pull-refresh-indicator {
  position: fixed;
  top: 180rpx;
  left: 0;
  right: 0;
  z-index: 220;
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  color: #de3f4a;
  font-size: 24rpx;
  line-height: 52rpx;
  pointer-events: none;
  transition: transform 0.16s ease;
}

.refresh-icon {
  font-size: 28rpx;
  animation: refresh-rotate 0.9s linear infinite;
}

@keyframes refresh-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media screen and (min-width: 600px) {
  .pull-refresh-indicator {
    top: 154px;
    height: 38px;
    font-size: 15px;
    line-height: 38px;
  }

  .refresh-icon {
    font-size: 19px;
  }
}

@media screen and (min-width: 900px) and (orientation: landscape) {
  .pull-refresh-indicator {
    top: 90px;
  }
}
</style>
