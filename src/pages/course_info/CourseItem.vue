<template>
  <view class="cu-list menu card-menu margin-top">
    <view class="cu-item arrow row" @click="$emit('click', courseAbstract)">
      <view class="content">
        <view class="text-lg">{{courseAbstract.name}}</view>
      </view>
      <view class="action">
        <view class="text-sm text-gray">{{courseAbstract.code}}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import type {CourseAbstract} from "@/models/CourseInfoModel";
  defineProps<{ courseAbstract: CourseAbstract }>();
  defineEmits<{ (e: 'click', courseAbstract: CourseAbstract):void }>();
</script>

<style scoped>
  .row {
    align-items: center;
  }
</style>