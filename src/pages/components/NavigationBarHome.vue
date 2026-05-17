<template>
  <view class="bar-background" :style="navStyle">
    <image class="cqu-buildings" :src="getSvgPath('cqu_buildings')"/>
  </view>
</template>

<script setup lang="ts">
import {getSvgPath} from "@/utils/resource";
import {useNavigationLayout} from "@/composables/useNavigationLayout";

const {navStyle} = useNavigationLayout();
</script>

<style scoped>
.cqu-buildings {
  height: 80rpx;
  width: 432rpx;
  margin: 0 auto;
  margin-top: auto;
  opacity: 0.9;
  z-index: 1;
}

.bar-background {
  position: relative;
  display: flex;
  flex-direction: column;
  height: var(--nav-height, 180rpx);
  width: 100%;
  background: linear-gradient(180deg, #ffffff 0%, #f5f7fb 100%);
}

@media screen and (min-width: 600px) {
  .bar-background {
    height: 154px;
  }

  .cqu-buildings {
    width: 320px;
    height: 60px;
    margin-top: 82px;
  }
}

@media screen and (min-width: 900px) and (orientation: landscape) {
  .bar-background {
    height: 90px;
  }

  .cqu-buildings {
    width: 220px;
    height: 42px;
    margin-top: 42px;
  }
}
</style>
