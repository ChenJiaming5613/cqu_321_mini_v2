<template>
  <view>
    <view class="cu-custom" :style="{height: CustomBar + 'px'}">
      <view class="cu-bar fixed" :style="barStyle" :class="[bgImage ? 'none-bg text-white bg-img' : '', bgColor]">
        <view class="action" @tap="handleBack" v-if="isBack">
          <text class="cuIcon-back"></text>
          <slot name="backText"></slot>
        </view>
        <view class="content" :style="{top: StatusBar + 'px'}">
          <slot name="content"></slot>
        </view>
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  bgColor?: string
  isBack?: boolean | string
  bgImage?: string
}>();

const systemInfo = uni.getSystemInfoSync();
const StatusBar = systemInfo.statusBarHeight ?? 0;
const CustomBar = StatusBar + 44;

const barStyle = computed(() => {
  let style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
  if (props.bgImage) {
    style = `${style}background-image:url(${props.bgImage});`;
  }
  return style;
});

function handleBack() {
  if (getCurrentPages().length < 2 && typeof (globalThis as any).__wxConfig !== "undefined") {
    const url = "/" + (globalThis as any).__wxConfig.pages[0];
    return uni.redirectTo({ url });
  }
  uni.navigateBack({ delta: 1 });
}
</script>
