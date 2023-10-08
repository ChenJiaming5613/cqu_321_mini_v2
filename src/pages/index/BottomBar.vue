<template>
  <view class="bar std-box-shadow">
    <image @click="() => { $emit('click', IndexMode.Home) }" class="item" :src="getSvgPath(`home${curr === IndexMode.Home ? '_selected' : ''}`)"/>
    <image @click="() => { $emit('click', IndexMode.Settings) }" class="item" :src="getSvgPath(`person${curr === IndexMode.Settings ? '_selected' : ''}`)"/>
  </view>
</template>

<script setup lang="ts">
import {getSvgPath} from "@/utils/resource";
import {IndexMode} from "@/pages/index/util";

const props = defineProps<{
    curr: IndexMode
  }>();
  defineEmits<{
    (e: 'click', newCurr: IndexMode): void
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