<template>
  <view class="margin padding bg-white std-box-shadow std-border-radius">
    <view class="flex row">
      <image class="circle margin-right-sm" :src="getSvgPath('circle')"/>
      <view class="text-bold text-black text-df">{{ title }}</view>
    </view>
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
  import {getSvgPath} from "@/utils/resource";
  defineProps<{ title: string }>();
</script>

<style scoped>
.circle {
  width: 10rpx;
  height: 10rpx;
}
.row {
  align-items: center;
}
</style>