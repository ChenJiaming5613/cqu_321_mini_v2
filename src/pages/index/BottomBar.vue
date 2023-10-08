<template>
  <view class="bar std-box-shadow">
    <image @click="() => { $emit('click', 'home') }" class="item" :src="getSvgPath(`home${curr === 'home' ? '_selected' : ''}`)"/>
    <image @click="() => { $emit('click', 'settings') }" class="item" :src="getSvgPath(`person${curr === 'settings' ? '_selected' : ''}`)"/>
  </view>
</template>

<script setup lang="ts">
  import {getSvgPath} from "@/utils/resource";

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
    height: 80rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #ffffff;
  }

  .item {
    width: 36rpx;
    height: 36rpx;
  }
</style>