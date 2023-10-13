<template>
<!--  <view class="cu-list menu card-menu margin-top">-->
<!--    <view class="cu-item" @click="isExpand = !isExpand">-->
<!--      <view class="content" style="max-width: 60%">-->
<!--        <view class="text-lg text-bold">{{scoreItem.name}}</view>-->
<!--      </view>-->
<!--      <view class="action">-->
<!--        <text :class="['margin-right', 'text-bold', scoreToColor(scoreToNumber(scoreItem.score))]">{{scoreItem.score}}</text>-->
<!--        <text :class="['lg', 'text-gray', isExpand ? 'cuIcon-fold' : 'cuIcon-unfold']"></text>-->
<!--      </view>-->
<!--    </view>-->
<!--    <view v-if="isExpand" class="cu-item text-lg text-grey">-->
<!--      <view class="content flex">-->
<!--        <view>学分: </view>-->
<!--        <view>{{scoreItem.credit}}</view>-->
<!--      </view>-->
<!--      <view class="action flex">-->
<!--        <view>教师: </view>-->
<!--        <view>{{scoreItem.instructor}}</view>-->
<!--      </view>-->
<!--    </view>-->
<!--    <view v-if="isExpand" class="cu-item">-->
<!--      <view class="content">-->
<!--        <text class="cu-tag radius light bg-olive">{{scoreItem.tags.studyNature}}</text>-->
<!--        <text class="cu-tag radius light bg-cyan">{{scoreItem.tags.courseNature}}</text>-->
<!--      </view>-->
<!--      <view class="action text-lg text-grey">{{scoreItem.moreInfo.code}}</view>-->
<!--    </view>-->
<!--  </view>-->
  <view class="root">
    <view class="dot" :style="{backgroundColor: scoreToColor(scoreToNumber(scoreItem.score))}"></view>
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
    <image class="more" :src="getSvgPath('grade_item_more')"/>
  </view>
</template>

<script setup lang="ts">
  import type {ScoreItem} from "@/models/GradeModel";
  import {scoreToColor, scoreToNumber} from "@/pages/grade/util";
  import {ref} from "vue";
  import {getSvgPath} from "@/utils/resource";
  defineProps<{ scoreItem: ScoreItem }>();
  const isExpand = ref(false);
</script>

<style scoped>
  .root {
    border-radius: 12rpx;
    border: 4rpx solid #F5F5F5;
    display: flex;
    flex-direction: row;
    height: 124rpx;
    align-items: center;
    background-color: white;
    margin-bottom: 10rpx;
    padding: 0 10rpx;
    justify-content: space-between;
  }

  .dot {
    width: 14rpx;
    height: 14rpx;
    background-color: red;
    border-radius: 50%;
  }

  .course {
    display: flex;
    flex-direction: column;
    width: 55%;
  }

  .course > .name {
    color: #696969;
    font-size: 28rpx;
  }

  .course > .tags {
    display: flex;
    flex-direction: row;
  }

  .tags > .tag {
    color: #D8D8D8;
    font-size: 20rpx;
    border-radius: 8rpx;
    border: 1rpx solid #D8D8D8;
    padding: 0 5rpx;
    margin-right: 4rpx;
  }

  .credit {
    color: #384352;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    font-weight: bold;
  }

  .credit > .value {
    font-size: 40rpx;
  }

  .credit > .foot {
    font-size: 16rpx;
  }

  .score {
    font-weight: bold;
    font-size: 40rpx;
    padding: 0 20rpx;
  }

  .more {
    width: 60rpx;
    height: 60rpx;
  }

</style>