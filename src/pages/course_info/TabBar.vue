<template>
  <scroll-view scroll-x class="tab-wrap" scroll-with-animation>
    <view class="tab-track">
      <view
        v-for="(currType, index) in searchTypes"
        :key="index"
        class="tab-item"
        :class="currType === searchType ? 'active' : ''"
        @click="$emit('click', currType)"
      >{{typeNames[index]}}</view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
  import {SearchType} from "@/models/CourseInfoModel";

  defineProps<{ searchType: SearchType }>();
  defineEmits<{ (e: 'click', newSearchType: SearchType): void }>();
  const searchTypes = [SearchType.CourseName, SearchType.TeacherName];
  const typeNames = ['搜课程', '搜老师'];
</script>

<style scoped>
.tab-wrap {
  padding: 28rpx 92rpx 30rpx;
  background: #fff;
}

.tab-track {
  display: flex;
  height: 52rpx;
  padding: 2rpx;
  border-radius: 28rpx;
  background: #f1f4f8;
  border: 1rpx solid #e7ebf1;
}

.tab-item {
  flex: 1;
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
  border-radius: 26rpx;
  color: #667381;
  font-size: 24rpx;
  transition: all 0.2s ease;
}

.tab-item.active {
  color: #de3f4a;
  background: #fff;
  box-shadow: 0 4rpx 12rpx rgba(31, 43, 58, 0.08);
}
</style>
