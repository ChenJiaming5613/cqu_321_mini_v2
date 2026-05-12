<template>
  <view class="table-shell flex bg-white">
    <view class="time-column">
      <view
        v-for="period in periods"
        :key="period.index"
        class="time-cell flex flex-direction justify-center align-center"
        :style="getPeriodStyle(period.index)"
      >
        <view class="period-index">{{ period.index }}</view>
        <view>{{ period.start }}</view>
        <view>{{ period.end }}</view>
      </view>
      <view class="break-label lunch-label"></view>
      <view class="break-label dinner-label"></view>
    </view>
    <view class="table-area">
      <view class="grid-container base-table">
        <view
          v-for="cell in tableBgCells"
          :key="`${cell.day}-${cell.period}`"
          class="grid-cell"
          :style="getBgCellStyle(cell.day, cell.period)"
        ></view>
        <view class="break-row lunch-row">午　休</view>
        <view class="break-row dinner-row">晚　休</view>
      </view>
      <view class="grid-container course-table">
        <view
            class="table-item text-df"
            :style="getTableItemStyle(tableItem)"
            v-for="(tableItem, index) in tableItems"
            :key="index"
            @click="$emit('onTapDetail', tableItem.course)"
        >
          <view v-if="tableItem.isOverlap" class="overlap-mark">...</view>
          <view>
            <view class="course-name">{{tableItem.course.name}}</view>
            <view class="course-room">{{getCourseRoom(tableItem.course)}}</view>
          </view>
        </view>
      </view>
      <view class="grid-container bottom-table">
        <view v-if="currWeekOfTerm === fixedWeekOfTerm" class="today-col" :style="{gridColumnStart: dayOfWeek}"></view>
      </view>
      <view class="grid-container top-table">
        <view v-if="currWeekOfTerm === fixedWeekOfTerm" :style="{
          gridColumnStart: dayOfWeek,
          gridRowStart: mapPeriodStartToGridLine(idxOfDay[0] + 1),
          gridRowEnd: mapPeriodEndToGridLine(idxOfDay[0] + 2),
        }"><view :style="{height: `${120 * idxOfDay[1]}rpx`}" class="time-line"></view></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import type {CourseCell, UniCourse} from "@/pages/curriculum/util";
  import {calcDayOfWeek} from "@/utils/datetime";
  import {computed} from "vue";
  import {calcCurrPeriod, TIME_TABLE} from "@/pages/curriculum/util";

  const props = defineProps<{
    tableItems: CourseCell[],
    currDate: Date,
    fixedWeekOfTerm: number,
    currWeekOfTerm: number
  }>();
  defineEmits<{ (e: 'onTapDetail', course: UniCourse) : void }>();
  const dayOfWeek = computed(()=>{
    return calcDayOfWeek(props.currDate) + 1;
  });
  const idxOfDay = computed(() => calcCurrPeriod(props.currDate));
  const periods = TIME_TABLE.map((timeText, index) => {
    const [start, end] = timeText.split('~');
    return {index: index + 1, start, end};
  });
  const tableBgCells = Array.from({length: 7 * 13}, (_, index) => ({
    day: index % 7 + 1,
    period: Math.floor(index / 7) + 1
  }));

  function mapPeriodStartToGridLine(period: number) {
    if (period <= 4) return period;
    if (period <= 9) return period + 1;
    return period + 2;
  }

  function mapPeriodEndToGridLine(periodEnd: number) {
    if (periodEnd <= 5) return periodEnd;
    if (periodEnd <= 10) return periodEnd + 1;
    return periodEnd + 2;
  }

  function getPeriodStyle(period: number) {
    return {
      gridRowStart: mapPeriodStartToGridLine(period),
      gridRowEnd: mapPeriodEndToGridLine(period + 1)
    };
  }

  function getBgCellStyle(day: number, period: number) {
    return {
      gridColumnStart: day,
      gridColumnEnd: day + 1,
      gridRowStart: mapPeriodStartToGridLine(period),
      gridRowEnd: mapPeriodEndToGridLine(period + 1)
    };
  }

  function getTableItemStyle(tableItem: CourseCell) {
    return {
      gridColumnStart: tableItem.pos.gridColumnStart,
      gridColumnEnd: tableItem.pos.gridColumnEnd,
      gridRowStart: mapPeriodStartToGridLine(tableItem.pos.gridRowStart),
      gridRowEnd: mapPeriodEndToGridLine(tableItem.pos.gridRowEnd),
      backgroundColor: toRgba(tableItem.bgColor, 0.22),
      color: tableItem.bgColor
    };
  }

  function toRgba(hexColor: string, alpha: number) {
    const hex = hexColor.replace('#', '');
    if (hex.length !== 6) return hexColor;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function getCourseRoom(course: UniCourse) {
    return 'classroom' in course ? course.classroom : course.content;
  }

</script>

<style scoped>
  .table-shell {
    margin-top: 370rpx;
    padding-bottom: 24rpx;
  }

  .grid-container {
    width: 700rpx;
    display: grid;
    grid-template-columns: repeat(7, 100rpx);
    grid-template-rows: repeat(4, 120rpx) 34rpx repeat(5, 120rpx) 34rpx repeat(4, 120rpx);
    position: absolute;
  }

  .time-column {
    width: 50rpx;
    height: 1628rpx;
    display: grid;
    grid-template-rows: repeat(4, 120rpx) 34rpx repeat(5, 120rpx) 34rpx repeat(4, 120rpx);
    color: #8c8c8c;
    font-size: 17rpx;
    text-align: center;
  }

  .time-cell {
    border-right: 1rpx solid #eeeeee;
    border-bottom: 1rpx solid #eeeeee;
    line-height: 24rpx;
  }

  .period-index {
    color: #555;
    font-size: 36rpx;
    font-weight: bold;
    line-height: 42rpx;
  }

  .break-label {
    background-color: #f1f1f1;
    color: #8c8c8c;
    font-size: 22rpx;
    line-height: 34rpx;
    border-right: 1rpx solid #e8e8e8;
  }

  .lunch-label {
    grid-row: 5 / 6;
  }

  .dinner-label {
    grid-row: 11 / 12;
  }

  .base-table {
    z-index: 0;
  }

  .table-area {
    position: relative;
    width: 700rpx;
    height: 1628rpx;
  }

  .grid-cell {
    border-right: 1rpx solid #eeeeee;
    border-bottom: 1rpx solid #eeeeee;
  }

  .break-row {
    grid-column: 1 / 8;
    background-color: #f1f1f1;
    color: #777;
    font-size: 22rpx;
    line-height: 34rpx;
    text-align: center;
    z-index: 1;
  }

  .lunch-row {
    grid-row: 5 / 6;
  }

  .dinner-row {
    grid-row: 11 / 12;
  }

  .course-table {
    z-index: 3;
  }

  .bottom-table {
    z-index: 2;
  }

  .top-table {
    z-index: 4;
    pointer-events: none;
  }

  .table-item {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    text-align: center;
    border: 1rpx solid rgba(255, 255, 255, 0.9);
    border-radius: 6rpx;
    margin: 2rpx;
    padding: 8rpx 6rpx;
    line-height: 32rpx;
    font-weight: 600;
  }

  .course-name {
    font-size: 24rpx;
    overflow-wrap: break-word;
  }

  .course-room {
    margin-top: 6rpx;
    font-size: 22rpx;
    font-weight: 400;
    opacity: 0.78;
    overflow-wrap: break-word;
  }

  .overlap-mark {
    position: absolute;
    top: 0;
    right: 8rpx;
    font-weight: bold;
  }

  .today-col {
    grid-row-start: 1;
    grid-row-end: 16;
    background-color: rgba(122, 223, 210, 0.18);
  }

  .time-line {
    border-bottom: 6rpx solid #fd6260;
  }
</style>
