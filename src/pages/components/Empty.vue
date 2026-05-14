<template>
  <view class="empty-state">
    <view class="illustration">
      <view class="bubble bubble-main"></view>
      <view class="bubble bubble-small"></view>
      <view class="plane"></view>
      <view class="symbol" :class="getClass(iconType)"></view>
    </view>
    <view class="message">{{message}}</view>
    <view v-if="hint" class="hint">{{hint}}</view>
    <button v-if="buttonText" class="action cu-btn" @click="$emit('action')">{{buttonText}}</button>
  </view>
</template>

<style scoped>
.empty-state {
  min-height: 520rpx;
  padding: 104rpx 48rpx 80rpx;
  text-align: center;
  background: #f5f7fb;
  color: #7d8794;
}

.illustration {
  position: relative;
  width: 260rpx;
  height: 240rpx;
  margin: 0 auto 28rpx;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(145deg, #ffffff 0%, #eef2f7 100%);
  border: 2rpx solid rgba(219, 225, 235, 0.9);
  box-shadow: 0 14rpx 30rpx rgba(31, 43, 58, 0.08);
}

.bubble-main {
  width: 160rpx;
  height: 160rpx;
  left: 48rpx;
  top: 54rpx;
}

.bubble-small {
  width: 58rpx;
  height: 58rpx;
  left: 28rpx;
  top: 38rpx;
}

.plane {
  position: absolute;
  right: 44rpx;
  top: 26rpx;
  width: 0;
  height: 0;
  border-left: 42rpx solid #ff3b3b;
  border-top: 18rpx solid transparent;
  border-bottom: 18rpx solid transparent;
  transform: rotate(-38deg);
}

.symbol {
  position: absolute;
  right: 78rpx;
  top: 62rpx;
  color: white;
  font-size: 48rpx;
}

.message {
  font-size: 32rpx;
  color: #1f2935;
  font-weight: 700;
}

.hint {
  margin-top: 22rpx;
  font-size: 24rpx;
  color: #98a1ad;
  line-height: 1.7;
}

.action {
  margin-top: 28rpx;
  min-width: 200rpx;
  height: 72rpx;
  border-radius: 18rpx;
  background: #1f2935;
  color: white;
  font-size: 28rpx;
}
</style>

<script setup lang="ts">
  defineProps<{
    message: string
    iconType: "success" | "warning" | "error"
    hint?: string
    buttonText?: string
  }>();
  defineEmits<{
    (e: 'action'): void
  }>();
  function getClass(iconType: "success" | "warning" | "error") {
    if (iconType === "success") return "cuIcon-check";
    if (iconType === "warning") return "cuIcon-search";
    if (iconType === "error") return "cuIcon-close";
    return "";
  }

</script>
