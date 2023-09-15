<template>
  <view class="bar">
    <image @click="() => { $emit('click', 'home') }" class="item" :src="`/static/images/icon_home${curr === 'home' ? '_selected' : ''}.svg`"/>
    <image @click="() => { $emit('click', 'settings') }" class="item" :src="`/static/images/icon_person${curr === 'settings' ? '_selected' : ''}.svg`"/>
  </view>
</template>

<script setup lang="ts">
  const props = defineProps<{
    curr: "home" | "settings"
  }>();
  defineEmits<{
    (e: 'click', newCurr: "home" | "settings"): void
  }>();
</script>

<style scoped>
  .bar {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 110rpx;
    border-top-left-radius: 40rpx;
    border-top-right-radius: 40rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #ffffff;
    box-shadow: 0 6rpx 16rpx 0 rgba(0, 0, 0, 0.16);
  }

  .item {
    width: 52rpx;
    height: 52rpx;
  }
</style>