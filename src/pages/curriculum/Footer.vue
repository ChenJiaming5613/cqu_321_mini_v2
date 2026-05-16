<template>
  <view class="week-switch bg-white text-center flex align-center justify-center">
    <view class="cuIcon-back switch-icon" @click="$emit('onTapPrevWeek')"></view>
    <view class="week-title text-bold" @click="$emit('onTapSwitchTerm')">第 {{ weekText }} 周</view>
    <view class="cuIcon-right switch-icon" @click="$emit('onTapNextWeek')"></view>
    <view class="cuIcon-apps more-icon" @click="$emit('onTapMoreFunc')"></view>
  </view>
</template>

<script setup lang="ts">
  import {computed} from "vue";

  const props = defineProps<{weekOfTerm: number}>();
  defineEmits<{
    (e: 'onTapPrevWeek'): void
    (e: 'onTapNextWeek'): void
    (e: 'onTapSwitchTerm'): void
    (e: 'onTapMoreFunc'): void
  }>();
  const weekText = computed(() => Number.isFinite(props.weekOfTerm) ? props.weekOfTerm : "-");
</script>

<style scoped>
  .week-switch {
    position: fixed;
    top: 180rpx;
    width: 100%;
    height: 82rpx;
    z-index: 100;
    background: rgba(255, 255, 255, 0.96);
    border-top: 1rpx solid #f5f7fb;
    border-bottom: 1rpx solid #e7ebf1;
    box-shadow: 0 8rpx 22rpx rgba(31, 43, 58, 0.05);
  }

  .switch-icon {
    color: #98a1ad;
    font-size: 42rpx;
    font-weight: bold;
    padding: 20rpx 56rpx;
  }

  .week-title {
    color: #de3f4a;
    font-size: 34rpx;
    min-width: 156rpx;
    line-height: 82rpx;
  }

  .more-icon {
    position: absolute;
    right: 24rpx;
    top: 0;
    color: #667381;
    font-size: 38rpx;
    line-height: 82rpx;
    padding: 0 24rpx;
  }

  @media screen and (min-width: 600px) {
    .week-switch {
      top: 154px;
      height: 60px;
    }

    .switch-icon {
      font-size: 30px;
      padding: 15px 44px;
    }

    .week-title {
      min-width: 132px;
      line-height: 60px;
      font-size: 25px;
    }

    .more-icon {
      right: 24px;
      font-size: 28px;
      line-height: 60px;
      padding: 0 18px;
    }
  }

  @media screen and (min-width: 900px) and (orientation: landscape) {
    .week-switch {
      top: 90px;
      height: 50px;
    }

    .switch-icon {
      font-size: 26px;
      padding: 12px 42px;
    }

    .week-title {
      min-width: 116px;
      line-height: 50px;
      font-size: 22px;
    }

    .more-icon {
      font-size: 24px;
      line-height: 50px;
    }
  }
</style>
