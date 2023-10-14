<template>
  <view class="bg-white std-box-shadow text-center std-border-radius std-page-margin padding">
    <view class="padding">
      <view class="text-bold text-xl padding-bottom-sm">{{name}}</view>
      <view class="text-gray text-lg">{{code}}</view>
    </view>
    <view class="flex justify-between">
      <view
          v-for="(item, index) in ScoreLevels"
          :key="index"
          class="text-center text-score" :class="`text-${item[0]}`"
      >
        <text class="cuIcon-ellipse padding-right-xxs"></text>
        <text class="text-gray">{{item[1]}}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import {ScoreLevels} from "@/pages/course_info/detail/util";
  defineProps<{ name: string, code: string }>();
</script>

<style scoped>
  .card {
    padding: 20rpx;
    border-radius: 10rpx;
  }
  .text-score {
    font-size: 22rpx;
    align-items: center;
  }
</style>
