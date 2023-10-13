<template>
  <image class="button-back" :src="getSvgPath('back')" @click="handleBack"/>
  <view class="bg-white bar-background">
    <view class="bar-title text-xl

">{{pageTitle}}</view>
    <image class="cqu-buildings" :src="getSvgPath('cqu_buildings')"/>
  </view>
</template>

<script setup lang="ts">
import {getSvgPath} from "@/utils/resource";
const handleBack = () => {
  uni.navigateBack();
}
defineProps<{
  pageTitle: string
}>();
</script>

<style scoped>
.cqu-buildings {
  height: 80rpx;
  width: 432rpx;
  /* 将图片推到底部 */
  margin: auto auto 0;
  z-index: 1; /* 确保图片在导航背景下方，但在标题下方 */
}

.button-back {
  position: fixed;
  height: 50rpx;
  width: 50rpx;
  top: 90rpx;
  left: 40rpx;
  z-index: 1024;
}

.bar-background {
  position: relative; /* 让子元素可以相对于这个容器进行绝对定位 */
  display: flex;
  flex-direction: column;
  height: 180rpx;
  width: 100%;
}

.bar-title {
  position: absolute;
  top: 110rpx;
  left: 50%;
  transform: translate(-50%, -50%); /* 使标题居中 */
  z-index: 2; /* 使标题浮在图片上面 */
}

</style>
