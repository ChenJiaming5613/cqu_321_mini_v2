<template>
  <view class="header flex text-center bg-white">
    <view class="month-cell flex flex-direction justify-center">
      <view>{{formatNumber(currDate.getMonth() + 1)}}</view>
      <view>月</view>
    </view>
    <view class="weekday-row flex">
      <view
          class="weekday-cell flex-sub flex flex-direction justify-center"
          :class="dayOfWeek === index ? 'active' : ''"
          :key="index"
          v-for="(item, index) in weekDayNames">
        <view>{{item}}</view>
        <view class="date-text">{{formatNumber(weekDates[index])}}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import {formatNumber} from "@/utils/util";
  import {getWeekDates} from "@/pages/curriculum/util";
  import {computed} from "vue";
  const props = defineProps<{
    currDate: Date,
    dayOfWeek: number
  }>();
  const weekDayNames = '一二三四五六日'.split('').map(it => '周' + it);
  const weekDates = computed(() => getWeekDates(props.currDate));
</script>

<style scoped>
  .header {
    position: fixed;
    top: 262rpx;
    width: 100%;
    height: 108rpx;
    z-index: 100;
    border-bottom: 1rpx solid #ececec;
    color: #555;
    font-size: 27rpx;
  }

  .month-cell {
    width: 50rpx;
    color: #8d8d8d;
    font-size: 22rpx;
  }

  .weekday-row {
    width: 700rpx;
  }

  .weekday-cell {
    line-height: 34rpx;
  }

  .weekday-cell.active {
    color: #ef4f5f;
    font-weight: bold;
  }

  .date-text {
    font-size: 22rpx;
    color: #8d8d8d;
  }

  .weekday-cell.active .date-text {
    color: #ef4f5f;
  }
</style>
