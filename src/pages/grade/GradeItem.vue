<template>
  <view class="item-wrap" :class="isExpand ? 'is-expand' : ''">
    <view class="root">
      <view class="mark">
        <view v-if="showNew" class="new-label">NEW</view>
        <view class="dot" :style="{backgroundColor: scoreToColor(scoreToNumber(scoreItem.score))}"></view>
      </view>
      <view class="course">
        <view class="name">{{scoreItem.name}}</view>
        <view class="tags">
          <view class="tag">{{scoreItem.tags.studyNature}}</view>
          <view class="tag">{{scoreItem.tags.courseNature}}</view>
        </view>
      </view>
      <view class="credit">
        <view class="value">{{scoreItem.credit}}</view>
        <view class="foot">分</view>
      </view>
      <view class="score" :style="{color: scoreToColor(scoreToNumber(scoreItem.score))}">{{scoreItem.score}}</view>
      <button class="more" @click="isExpand = !isExpand">
        <text class="cuIcon-more"></text>
      </button>
    </view>
    <view v-if="isExpand" class="detail">
      <view class="detail-line">
        <text class="detail-dot" :style="{backgroundColor: scoreToColor(scoreToNumber(scoreItem.score))}"></text>
        <text class="detail-text">课程：{{scoreItem.name}}</text>
      </view>
      <view class="detail-grid">
        <view>学分：{{scoreItem.credit}}</view>
        <view>类型：{{scoreItem.tags.studyNature}} {{scoreItem.tags.courseNature}}</view>
        <view>课程号：{{courseCode}}</view>
        <view>教师：{{scoreItem.instructor || '--'}}</view>
        <view>分数：{{scoreItem.score}}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import type {ScoreItem} from "@/models/GradeModel";
  import {scoreToColor, scoreToNumber} from "@/pages/grade/util";
  import {computed, ref} from "vue";
  const props = defineProps<{ scoreItem: ScoreItem, showNew?: boolean }>();
  const isExpand = ref(false);
  const courseCode = computed(() => {
    return props.scoreItem.moreInfo.courseNum || props.scoreItem.moreInfo.code || '--';
  });
</script>

<style scoped>
  .item-wrap {
    position: relative;
    margin: 12rpx 0;
    z-index: 1;
  }

  .item-wrap.is-expand {
    z-index: 10;
  }

  .root {
    border-radius: 8rpx;
    border: 2rpx solid #f1f1f1;
    display: flex;
    flex-direction: row;
    height: 112rpx;
    align-items: center;
    background-color: white;
    padding: 0 20rpx 0 14rpx;
    justify-content: space-between;
    box-shadow: 0 4rpx 14rpx rgba(0, 0, 0, 0.025);
  }

  .mark {
    position: relative;
    width: 42rpx;
    min-width: 42rpx;
    display: flex;
    align-items: center;
  }

  .new-label {
    position: absolute;
    top: -26rpx;
    left: 0;
    color: #6fd66b;
    font-size: 16rpx;
    font-weight: 700;
    transform: scale(0.82);
    transform-origin: left center;
  }

  .dot {
    width: 14rpx;
    height: 14rpx;
    border-radius: 50%;
  }

  .course {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .course > .name {
    color: #575f69;
    font-size: 28rpx;
    line-height: 36rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .course > .tags {
    display: flex;
    flex-direction: row;
    margin-top: 8rpx;
  }

  .tags > .tag {
    color: #c7c7c7;
    font-size: 20rpx;
    line-height: 24rpx;
    border-radius: 6rpx;
    border: 1rpx solid #e5e5e5;
    padding: 0 8rpx;
    margin-right: 8rpx;
  }

  .credit {
    color: #384352;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    font-weight: bold;
    width: 84rpx;
    justify-content: center;
    border-right: 2rpx dotted #ececec;
  }

  .credit > .value {
    font-size: 38rpx;
    line-height: 44rpx;
  }

  .credit > .foot {
    font-size: 16rpx;
    line-height: 26rpx;
  }

  .score {
    font-weight: bold;
    font-size: 38rpx;
    width: 84rpx;
    text-align: center;
    border-right: 2rpx dotted #ececec;
  }

  .more {
    width: 48rpx;
    height: 48rpx;
    padding: 0;
    margin: 0 0 0 18rpx;
    border: 2rpx solid #dcdcdc;
    border-radius: 8rpx;
    background: #fff;
    color: #6f747b;
    line-height: 44rpx;
    font-size: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .more::after {
    border: none;
  }

  .detail {
    position: absolute;
    left: 0;
    right: 0;
    top: 96rpx;
    min-height: 172rpx;
    padding: 24rpx 28rpx 22rpx 30rpx;
    background: #fff;
    border-radius: 8rpx;
    box-shadow: 0 10rpx 28rpx rgba(0, 0, 0, 0.16);
    color: #5b6570;
    font-size: 26rpx;
  }

  .detail-line {
    display: flex;
    align-items: center;
    margin-bottom: 18rpx;
  }

  .detail-dot {
    width: 14rpx;
    height: 14rpx;
    border-radius: 50%;
    margin-right: 18rpx;
  }

  .detail-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 18rpx;
    column-gap: 18rpx;
    line-height: 32rpx;
  }

</style>
