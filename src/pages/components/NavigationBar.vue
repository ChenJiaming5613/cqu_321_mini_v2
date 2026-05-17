<template>
  <view class="nav-shell" :class="isFixed ? 'fixed-position' : ''" :style="navStyle">
    <view class="nav-bg"></view>
    <view class="button-back" @click="handleBack">
      <text class="button-back-icon cuIcon-back"></text>
    </view>
    <text v-if="showRefresh && !isWeixinMiniProgram" class="button-refresh cuIcon-refresh" @click="$emit('refresh')"></text>
    <view class="bar-background">
      <view class="bar-title">{{pageTitle}}</view>
      <image class="cqu-buildings" :src="getSvgPath('cqu_buildings')"/>
    </view>
  </view>
</template>

<script setup lang="ts">
import {getSvgPath} from "@/utils/resource";
import {useNavigationLayout} from "@/composables/useNavigationLayout";
let isWeixinMiniProgram = false;
// #ifdef MP-WEIXIN
isWeixinMiniProgram = true;
// #endif
const handleBack = () => {
  if (getCurrentPages().length > 1) {
    uni.navigateBack();
    return;
  }
  uni.reLaunch({ url: "/pages/index/index" });
}
const {navStyle} = useNavigationLayout();
withDefaults(defineProps<{
  pageTitle: string
  isFixed?: boolean
  showRefresh?: boolean
}>(), {
  isFixed: true,
  showRefresh: false
});
defineEmits<{
  (e: 'refresh'): void
}>();
</script>

<style scoped>
.cqu-buildings {
  height: 66rpx;
  width: 356rpx;
  margin: 98rpx auto 0;
  opacity: 0.9;
  z-index: 1;
}

.button-back {
  position: fixed;
  height: var(--nav-action-size, 70rpx);
  width: var(--nav-action-size, 70rpx);
  top: var(--nav-action-top, 92rpx);
  left: var(--nav-action-left, 34rpx);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.78);
  z-index: 1024;
  box-shadow: 0 8rpx 22rpx rgba(31, 43, 58, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #de3f4a;
  font-size: 38rpx;
  line-height: var(--nav-action-size, 70rpx);
}

.button-back-icon {
  font-size: inherit;
  line-height: inherit;
}

.button-refresh {
  position: fixed;
  top: 92rpx;
  right: var(--nav-action-right, 36rpx);
  width: var(--nav-action-size, 70rpx);
  height: var(--nav-action-size, 70rpx);
  z-index: 1024;
  color: #de3f4a;
  background: rgba(255, 255, 255, 0.82);
  border-radius: 50%;
  box-shadow: 0 8rpx 22rpx rgba(31, 43, 58, 0.08);
  font-size: 38rpx;
  line-height: var(--nav-action-size, 70rpx);
  text-align: center;
}

.nav-shell {
  position: relative;
  width: 100%;
  height: var(--nav-height, 180rpx);
  z-index: 1000;
}

.nav-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.92) 78%, rgba(245, 247, 251, 0) 100%);
}

.bar-background {
  position: relative;
  display: flex;
  flex-direction: column;
  height: var(--nav-height, 180rpx);
  width: 100%;
}

.bar-title {
  position: absolute;
  top: var(--nav-title-top, 114rpx);
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  color: #1b2430;
  font-size: 36rpx;
  font-weight: 700;
  line-height: 48rpx;
}

.fixed-position {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

@media screen and (min-width: 600px) {
  .nav-shell,
  .bar-background {
    height: 154px;
  }

  .cqu-buildings {
    width: 320px;
    height: 60px;
    margin-top: 82px;
  }

  .bar-title {
    top: 92px;
    font-size: 30px;
    line-height: 38px;
  }

  .button-back {
    top: 56px;
    left: 36px;
    width: 54px;
    height: 54px;
    font-size: 30px;
    line-height: 54px;
  }

  .button-refresh {
    top: 56px;
    right: 36px;
    width: 54px;
    height: 54px;
    font-size: 30px;
    line-height: 54px;
  }
}

@media screen and (min-width: 900px) and (orientation: landscape) {
  .nav-shell,
  .bar-background {
    height: 90px;
  }

  .cqu-buildings {
    width: 220px;
    height: 42px;
    margin-top: 42px;
  }

  .bar-title {
    top: 54px;
    font-size: 22px;
    line-height: 28px;
  }

  .button-back {
    top: 34px;
    left: 28px;
    width: 42px;
    height: 42px;
    font-size: 24px;
    line-height: 42px;
  }

  .button-refresh {
    top: 32px;
    right: 28px;
    width: 42px;
    height: 42px;
    font-size: 24px;
    line-height: 42px;
  }
}

</style>
