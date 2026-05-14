<template>
  <scroll-view
    v-if="scrollable"
    scroll-x
    class="segmented-tabs"
    scroll-with-animation
  >
    <view class="segmented-track">
      <view
        v-for="item in items"
        :key="item.value"
        class="segmented-item"
        :class="{ active: item.value === value }"
        @click="emit('update:value', item.value)"
      >
        {{ item.label }}
      </view>
    </view>
  </scroll-view>
  <view v-else class="segmented-tabs">
    <view class="segmented-track">
      <view
        v-for="item in items"
        :key="item.value"
        class="segmented-item"
        :class="{ active: item.value === value }"
        @click="emit('update:value', item.value)"
      >
        {{ item.label }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  export type SegmentedTabValue = string | number;

  export interface SegmentedTabItem {
    label: string;
    value: SegmentedTabValue;
  }

  withDefaults(defineProps<{
    value: SegmentedTabValue;
    items: SegmentedTabItem[];
    scrollable?: boolean;
  }>(), {
    scrollable: false
  });

  const emit = defineEmits<{
    (e: 'update:value', value: SegmentedTabValue): void;
  }>();
</script>

<style scoped>
.segmented-tabs {
  padding: 26rpx 92rpx 28rpx;
  background: #fff;
}

.segmented-track {
  display: flex;
  min-width: 100%;
  height: 52rpx;
  padding: 2rpx;
  border-radius: 28rpx;
  background: #f1f4f8;
  border: 1rpx solid #e7ebf1;
}

.segmented-item {
  flex: 1;
  min-width: 0;
  height: 48rpx;
  line-height: 48rpx;
  border-radius: 26rpx;
  color: #667381;
  font-size: 24rpx;
  text-align: center;
  transition: all 0.2s ease;
}

.segmented-item.active {
  color: #de3f4a;
  background: #fff;
  box-shadow: 0 4rpx 12rpx rgba(31, 43, 58, 0.08);
}
</style>
