<template>
  <view class="text std-color-gray std-page-margin std-bottom-margin-narrow">{{content}}</view>
</template>

<script setup lang="ts">
  const props = defineProps<{
    content: string
  }>();
</script>

<style scoped>
  .text{
    font-size: 24rpx;
  }
</style>