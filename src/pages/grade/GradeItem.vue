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
    border-radius: 20rpx;
    border: 1rpx solid #eef1f5;
    display: flex;
    flex-direction: row;
    min-height: 118rpx;
    align-items: center;
    background-color: white;
    padding: 0 18rpx 0 16rpx;
    justify-content: space-between;
    box-shadow: 0 8rpx 20rpx rgba(31, 43, 58, 0.04);
  }

  .mark {
    position: relative;
    width: 42rpx;
    min-width: 42rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .new-label {
    position: absolute;
    top: -26rpx;
    left: 50%;
    color: #6fd66b;
    font-size: 16rpx;
    font-weight: 700;
    white-space: nowrap;
    transform: translateX(-50%) scale(0.82);
    transform-origin: center;
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
    color: #1f2935;
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
    color: #7d8794;
    font-size: 20rpx;
    line-height: 24rpx;
    border-radius: 999rpx;
    background: #f4f6f9;
    border: 1rpx solid #e7ebf1;
    padding: 1rpx 10rpx;
    margin-right: 8rpx;
  }

  .credit {
    color: #1f2935;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    font-weight: bold;
    width: 84rpx;
    justify-content: center;
    border-right: 1rpx solid #eef1f5;
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
    border-right: 1rpx solid #eef1f5;
  }

  .more {
    width: 48rpx;
    height: 48rpx;
    padding: 0;
    margin: 0 0 0 18rpx;
    border: 1rpx solid #e7ebf1;
    border-radius: 16rpx;
    background: #f9fafc;
    color: #667381;
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
    top: 102rpx;
    min-height: 172rpx;
    padding: 24rpx 28rpx 22rpx 30rpx;
    background: #fff;
    border: 1rpx solid #e7ebf1;
    border-radius: 20rpx;
    box-shadow: 0 18rpx 42rpx rgba(31, 43, 58, 0.14);
    color: #52606f;
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

  @media screen and (min-width: 600px) {
    .item-wrap {
      margin: 0;
      min-width: 0;
    }

    .root {
      min-height: 154px;
      padding: 18px;
      display: grid;
      grid-template-columns: 18px minmax(0, 1fr) auto;
      grid-template-rows: auto 1fr auto;
      column-gap: 12px;
      row-gap: 12px;
      border-radius: 16px;
      align-items: start;
    }

    .mark {
      width: 18px;
      min-width: 18px;
      height: 24px;
      align-items: center;
    }

    .dot {
      width: 8px;
      height: 8px;
    }

    .new-label {
      top: -19px;
      font-size: 10px;
      transform: translateX(-50%);
    }

    .course > .name {
      font-size: 18px;
      line-height: 24px;
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .course > .tags {
      margin-top: 7px;
      flex-wrap: wrap;
      gap: 4px;
    }

    .tags > .tag {
      margin-right: 0;
      padding: 1px 7px;
      font-size: 12px;
      line-height: 18px;
    }

    .credit {
      width: auto;
      grid-column: 2 / 3;
      grid-row: 3 / 4;
      justify-content: flex-start;
      border-right: 0;
    }

    .credit > .value {
      font-size: 24px;
      line-height: 28px;
    }

    .credit > .foot {
      font-size: 11px;
      line-height: 18px;
    }

    .score {
      width: auto;
      grid-column: 3 / 4;
      grid-row: 1 / 3;
      align-self: start;
      min-width: 58px;
      padding-left: 16px;
      font-size: 34px;
      line-height: 42px;
      border-right: 0;
      border-left: 1px solid #eef1f5;
    }

    .more {
      grid-column: 3 / 4;
      grid-row: 3 / 4;
      justify-self: end;
      width: 32px;
      height: 32px;
      margin: 0;
      border-radius: 10px;
      font-size: 20px;
      line-height: 30px;
    }

    .detail {
      top: 132px;
      padding: 16px;
      border-radius: 16px;
      font-size: 14px;
    }

    .detail-grid {
      row-gap: 10px;
      column-gap: 12px;
      line-height: 20px;
    }
  }

</style>
