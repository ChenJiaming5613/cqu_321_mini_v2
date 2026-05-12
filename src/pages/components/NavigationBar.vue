<template>
  <image class="button-back" :src="getSvgPath('back')" @click="handleBack"/>
  <text v-if="showRefresh" class="button-refresh cuIcon-refresh" @click="$emit('refresh')"></text>
  <view class="bg-white bar-background " :class="isFixed ? 'fixed-position' : ''">
    <view class="bar-title text-xl text-black">{{pageTitle}}</view>
    <image class="cqu-buildings" :src="getSvgPath('cqu_buildings')"/>
  </view>
</template>

<script setup lang="ts">
import {getSvgPath} from "@/utils/resource";
const handleBack = () => {
  uni.navigateBack();
}
withDefaults(defineProps<{
  pageTitle: string
  isFixed?: boolean
  showRefresh?: boolean
}>(), {
  isFixed: true,
  showRefresh: false
});
defineEmits<{
  (e: 'refresh'): void
}>();
</script>

<style scoped>
.cqu-buildings {
  height: 80rpx;
  width: 432rpx;
  top: 100rpx;
  margin: 0 auto;
  z-index: 1;
}

.button-back {
  position: fixed;
  height: 50rpx;
  width: 50rpx;
  top: 90rpx;
  left: 40rpx;
  z-index: 1024;
}

.button-refresh {
  position: fixed;
  top: 92rpx;
  right: 48rpx;
  z-index: 1024;
  color: #ff3b3b;
  font-size: 42rpx;
  line-height: 50rpx;
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
  top: 114rpx;
  left: 50%;
  transform: translate(-50%, -50%); /* 使标题居中 */
  z-index: 2; /* 使标题浮在图片上面 */
}

.fixed-position {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

</style>
