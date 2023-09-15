<template>
  <view class="flex flex-direction text-center" @click="$emit('click')">
<!--    <view class="icon-bg">-->
<!--      <text class="text-white text-bold icon" :class="iconName"></text>-->
<!--    </view>-->
    <image class="icon" :src="`/static/images/icon_${iconName}.svg`"/>
    <view class="icon-text">{{ title }}</view>
  </view>
</template>

<script setup lang="ts">
  defineProps<{
    iconName: string
    title: string
  }>();
  defineEmits<{
    (e: 'click'):void
  }>();
</script>

<style scoped>
  .icon {
    width: 96rpx;
    height: 96rpx;
  }
  .icon-bg {
    height: 120rpx;
    border-radius: 50%;
    background: linear-gradient(45deg, #FE3B39 30%, #FD8B8A 82%);
  }
  .icon-bg > .icon {
    line-height: 120rpx;
    font-size: 65rpx;
  }
  .icon-text {
    font-size: 28rpx;
    padding-top: 10rpx;
    color: #696969;
  }
</style>