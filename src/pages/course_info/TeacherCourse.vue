<template>
  <view class="teacher-card">
    <view class="teacher-head" @click="isExpand = !isExpand">
      <view class="title-wrap">
        <view class="red-dot"></view>
        <view class="teacher-name">{{teacherName || "未知教师"}}</view>
      </view>
      <text class="course-count">{{courseAbstractList.length}}门</text>
      <text :class="['fold-icon', isExpand ? 'cuIcon-fold' : 'cuIcon-unfold']"></text>
    </view>
    <view
      v-if="isExpand"
      v-for="(courseAbstract, index) in courseAbstractList"
      :key="index"
      class="course-row"
      @click="$emit('click', courseAbstract)"
    >
      <view class="course-name">{{courseAbstract.name}}</view>
      <view class="course-code">{{courseAbstract.code}}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import {ref} from "vue";
  import type {CourseAbstract} from "@/models/CourseInfoModel";
  defineProps<{
    teacherName: string
    courseAbstractList: CourseAbstract[]
  }>();
  defineEmits<{ (e: 'click', courseAbstract: CourseAbstract):void }>();
  const isExpand = ref(false);
</script>

<style scoped>
.teacher-card {
  margin: 0 56rpx 28rpx;
  overflow: hidden;
  border-radius: 8rpx;
  background: #fff;
  box-shadow: 0 3rpx 12rpx rgba(0, 0, 0, 0.04);
}

.teacher-head,
.course-row {
  display: flex;
  align-items: center;
  min-height: 86rpx;
  padding: 0 28rpx 0 20rpx;
}

.title-wrap {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.red-dot {
  width: 12rpx;
  height: 12rpx;
  margin-right: 24rpx;
  border-radius: 50%;
  background: #ff5661;
}

.teacher-name,
.course-name {
  overflow: hidden;
  color: #666;
  font-size: 26rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.course-count,
.course-code {
  margin-left: 20rpx;
  color: #c9c9c9;
  font-size: 24rpx;
}

.fold-icon {
  margin-left: 28rpx;
  color: #e95b67;
  font-size: 34rpx;
  font-weight: 700;
}

.course-row {
  min-height: 74rpx;
  margin: 0 20rpx;
  padding-right: 8rpx;
  border-top: 1rpx solid #f1f1f1;
}

.course-name {
  flex: 1;
  color: #777;
  font-size: 24rpx;
}
</style>
