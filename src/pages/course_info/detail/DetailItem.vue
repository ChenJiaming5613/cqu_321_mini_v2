<template>
  <view class="cu-list menu card-menu std-page-margin margin-top">
      <view class="cu-item" @click="isExpand = !isExpand">
      <view class="flex row">
        <image class="circle margin-right-sm" :src="getSvgPath('circle')"/>
        <view class="content">{{detail.teacherName}}</view>
      </view>
        <text :class="['lg', 'std-color-primary', isExpand ? 'cuIcon-fold' : 'cuIcon-unfold']"></text>
      </view>
    <view v-if="isExpand" v-for="(item, index) in detail.details" :key="index" class="cu-item">
      <view class="content padding">
        <view class="text-bold">{{item.termName}}</view>
        <view class="flex justify-between text-grey text-sm">
          <text>最低分：{{item.min}}</text>
          <text>最高分：{{item.max}}</text>
        </view>
        <view class="flex justify-between text-grey text-sm">
          <text>平均分：{{item.average.toFixed(2)}}</text>
          <text>参考人数：{{item.num}}</text>
        </view>
        <view class="cu-progress std-box-shadow">
          <view
              v-for="(num, idx) in item.levels"
              :style="{width: num / item.num * 100 + '%'}"
              :class="`bg-${ScoreLevels[idx][0]}`"
              :key="idx">
            <view v-if="num > 0" class="std-text-shadow text-xxs">{{num}}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import {ref} from "vue";
  import type {Detail} from "@/models/CourseInfoModel";
  import {ScoreLevels} from "@/pages/course_info/detail/util";
  import {getSvgPath} from "@/utils/resource";
  defineProps<{ detail: Detail }>();
  const isExpand = ref(false);
</script>

<style scoped>
  .circle {
    width: 10rpx;
    height: 10rpx;
  }
  .row {
    align-items: center;
  }
</style>