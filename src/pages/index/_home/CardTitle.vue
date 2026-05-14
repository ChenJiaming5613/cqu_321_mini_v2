<template>
  <view class="text std-page-margin std-bottom-margin-narrow">{{content}}</view>
</template>

<script setup lang="ts">
  const props = defineProps<{
    content: string
  }>();
</script>

<style scoped>
  .text{
    color: #667381;
    font-size: 24rpx;
    font-weight: 700;
  }
</style>
