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
  padding: 120rpx 48rpx 80rpx;
  text-align: center;
  background: #f7f7f7;
  color: #8d8d8d;
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
  background: linear-gradient(145deg, #f8f9fc 0%, #dfe3ec 100%);
  border: 2rpx solid rgba(200, 205, 216, 0.8);
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
  color: #6d6d6d;
  font-weight: 500;
}

.hint {
  margin-top: 22rpx;
  font-size: 24rpx;
  color: #a8a8a8;
  line-height: 1.7;
}

.action {
  margin-top: 28rpx;
  min-width: 200rpx;
  height: 72rpx;
  border-radius: 18rpx;
  background: #6a6a6a;
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
