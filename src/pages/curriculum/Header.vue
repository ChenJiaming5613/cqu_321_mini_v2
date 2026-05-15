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
  import {getWeekDates} from "@/domain/course";
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
    background: rgba(255, 255, 255, 0.98);
    border-bottom: 1rpx solid #e7ebf1;
    color: #52606f;
    font-size: 27rpx;
  }

  .month-cell {
    width: 50rpx;
    color: #98a1ad;
    font-size: 22rpx;
  }

  .weekday-row {
    width: 700rpx;
  }

  .weekday-cell {
    line-height: 34rpx;
  }

  .weekday-cell.active {
    color: #de3f4a;
    font-weight: bold;
  }

  .date-text {
    font-size: 22rpx;
    color: #98a1ad;
  }

  .weekday-cell.active .date-text {
    color: #de3f4a;
  }

  @media screen and (min-width: 600px) {
    .header {
      top: 214px;
      height: 74px;
      font-size: 17px;
    }

    .month-cell {
      width: 58px;
      font-size: 14px;
    }

    .weekday-row {
      width: calc(100vw - 58px);
      min-width: 700px;
    }

    .weekday-cell {
      line-height: 24px;
    }

    .date-text {
      font-size: 14px;
    }
  }

  @media screen and (min-width: 900px) {
    .weekday-row {
      width: calc(100vw - 58px);
    }
  }

  @media screen and (min-width: 900px) and (orientation: landscape) {
    .header {
      top: 140px;
      height: 54px;
      font-size: 15px;
    }

    .month-cell {
      width: 58px;
      font-size: 13px;
    }

    .weekday-cell {
      line-height: 19px;
    }

    .date-text {
      font-size: 12px;
    }
  }
</style>
