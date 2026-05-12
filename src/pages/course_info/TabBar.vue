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
  background: #efefef;
  box-shadow: inset 0 0 0 1rpx rgba(0, 0, 0, 0.03);
}

.tab-item {
  flex: 1;
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
  border-radius: 26rpx;
  color: #777;
  font-size: 24rpx;
  transition: all 0.2s ease;
}

.tab-item.active {
  color: #e95b67;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}
</style>
