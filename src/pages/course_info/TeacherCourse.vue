<template>
  <view class="cu-list menu card-menu margin-top">
    <view class="cu-item" @click="isExpand = !isExpand">
      <view class="content">
        <view class="text-lg">{{teacherName}}</view>
      </view>
      <view class="action">
        <text :class="['lg', 'std-color-primary', isExpand ? 'cuIcon-fold' : 'cuIcon-unfold']"></text>
      </view>
    </view>
    <view
      v-if="isExpand"
      v-for="(courseAbstract, index) in courseAbstractList"
      :key="index"
      class="cu-item arrow"
      @click="$emit('click', courseAbstract)"
    >
      <view class="content">
        <view class="text-lg text-black">{{courseAbstract.name}}</view>
      </view>
      <view class="action">
        <view class="text-sm text-gray row">{{courseAbstract.code}}</view>
      </view>
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
.row {
  align-items: center;
}
</style>