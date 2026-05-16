<template>
  <view class="collapsible-panel">
    <view class="panel-header" @click="toggle">
      <slot name="header" />
      <view class="expand-icon" :class="{ expanded: isExpanded }">
        <text>{{ isExpanded ? '▾' : '▸' }}</text>
      </view>
    </view>
    <view v-if="isExpanded" class="panel-body">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = withDefaults(defineProps<{
  initialExpanded?: boolean
}>(), {
  initialExpanded: false
});

const isExpanded = ref(props.initialExpanded);

function toggle() {
  isExpanded.value = !isExpanded.value;
}

defineExpose({ isExpanded, toggle });
</script>

<style scoped>
.panel-header {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.panel-header > :first-child {
  flex: 1;
}
.expand-icon {
  transition: transform 0.2s;
  color: #98a1ad;
  font-size: 24rpx;
  padding: 0 12rpx;
}
.expanded {
  transform: rotate(0deg);
}
</style>
