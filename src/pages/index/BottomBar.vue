<template>
  <view class="bar">
    <view class="item-wrap" :class="{active: curr === IndexMode.Home}" @click="() => { $emit('click', IndexMode.Home) }">
      <image class="item" :src="getSvgPath(`home${curr === IndexMode.Home ? '_selected' : ''}`)"/>
    </view>
    <view class="item-wrap" :class="{active: curr === IndexMode.Settings}" @click="() => { $emit('click', IndexMode.Settings) }">
      <image class="item" :src="getSvgPath(`person${curr === IndexMode.Settings ? '_selected' : ''}`)"/>
    </view>
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
    left: 28rpx;
    right: 28rpx;
    bottom: 28rpx;
    height: 92rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.94);
    border: 1rpx solid rgba(219, 225, 235, 0.95);
    border-radius: 28rpx;
    box-shadow: 0 16rpx 44rpx rgba(31, 43, 58, 0.16);
    z-index: 900;
  }

  .item-wrap {
    width: 116rpx;
    height: 62rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 999rpx;
  }

  .item-wrap.active {
    background: #fff2ef;
  }

  .item {
    width: 42rpx;
    height: 42rpx;
  }

  @media screen and (min-width: 600px) {
    .bar {
      position: static;
      left: auto !important;
      right: auto !important;
      bottom: auto;
      width: min(424px, calc(100vw - 56px));
      height: 58px;
      margin: 18px auto 20px;
      border-radius: 20px;
      transform: none;
    }

    .item-wrap {
      width: 88px;
      height: 40px;
    }

    .item {
      width: 26px;
      height: 26px;
    }
  }
</style>
