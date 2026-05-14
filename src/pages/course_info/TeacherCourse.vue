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
  margin: 0 42rpx 28rpx;
  overflow: hidden;
  border-radius: 24rpx;
  background: #fff;
  border: 1rpx solid rgba(219, 225, 235, 0.95);
  box-shadow: 0 14rpx 34rpx rgba(31, 43, 58, 0.06);
}

.teacher-head,
.course-row {
  display: flex;
  align-items: center;
  min-height: 96rpx;
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
  background: #de3f4a;
}

.teacher-name,
.course-name {
  overflow: hidden;
  color: #1f2935;
  font-size: 26rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.course-count,
.course-code {
  margin-left: 20rpx;
  color: #98a1ad;
  font-size: 24rpx;
}

.fold-icon {
  margin-left: 28rpx;
  color: #de3f4a;
  font-size: 34rpx;
  font-weight: 700;
}

.course-row {
  min-height: 74rpx;
  margin: 0 20rpx;
  padding-right: 8rpx;
  border-top: 1rpx solid #eef1f5;
}

.course-name {
  flex: 1;
  color: #52606f;
  font-size: 24rpx;
}

@media screen and (min-width: 600px) {
  .teacher-card {
    margin: 0 0 22px;
    border-radius: 18px;
  }

  .teacher-head,
  .course-row {
    min-height: 70px;
    padding: 0 20px 0 16px;
  }

  .red-dot {
    width: 8px;
    height: 8px;
    margin-right: 16px;
  }

  .teacher-name,
  .course-name {
    font-size: 17px;
  }

  .course-count,
  .course-code {
    font-size: 14px;
  }

  .fold-icon {
    margin-left: 18px;
    font-size: 24px;
  }

  .course-row {
    min-height: 52px;
  }
}
</style>
