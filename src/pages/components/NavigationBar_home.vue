<template>
  <view class="bar-background">
    <image class="cqu-buildings" :src="getSvgPath('cqu_buildings')"/>
  </view>
</template>

<script setup lang="ts">
import {getSvgPath} from "@/utils/resource";
</script>

<style scoped>
.cqu-buildings {
  height: 80rpx;
  width: 432rpx;
  margin: 0 auto;
  margin-top: auto;
  z-index: 1;
}

.bar-background {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 180rpx;
  width: 100%;
}

</style>