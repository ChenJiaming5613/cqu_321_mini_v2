<template>
  <view class="menu-item" @click="$emit('click')">
    <view class="item-main">
      <text class="item-icon" :class="iconStyle"></text>
      <text class="item-title">{{title}}</text>
    </view>
    <view class="item-side">
      <text v-if="value" class="item-value">{{value}}</text>
      <text v-if="hasArrow" class="cuIcon-right item-arrow"></text>
    </view>
  </view>
</template>

<script setup lang="ts">
  defineProps<{
    iconStyle: string
    title: string
    value?: string
    hasArrow?: boolean
  }>();
  defineEmits<{ (e: 'click'): void }>();
</script>

<style scoped>
.menu-item {
  min-height: 108rpx;
  padding: 0 58rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-main,
.item-side {
  display: flex;
  align-items: center;
}

.item-icon {
  width: 56rpx;
  color: #ff3b3b;
  font-size: 42rpx;
  line-height: 1;
}

.item-title {
  margin-left: 34rpx;
  color: #666;
  font-size: 34rpx;
  font-weight: 500;
}

.item-value {
  color: #666;
  font-size: 32rpx;
  font-weight: 600;
}

.item-arrow {
  margin-left: 18rpx;
  color: #666;
  font-size: 44rpx;
  font-weight: 600;
}
</style>
