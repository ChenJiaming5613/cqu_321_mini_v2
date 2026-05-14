<template>
  <view class="root flex flex-direction text-center" @click="$emit('click')">
    <view class="icon-shell">
      <image class="icon" :src="`/static/images/icon_${iconName}.svg`"/>
    </view>
    <view class="icon-text">{{ title }}</view>
  </view>
</template>

<script setup lang="ts">
  defineProps<{
    iconName: string
    title: string
  }>();
  defineEmits<{
    (e: 'click'):void
  }>();
</script>

<style scoped>
  .root {
    min-width: 132rpx;
  }
  .icon-shell {
    width: 96rpx;
    height: 96rpx;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon {
    width: 96rpx;
    height: 96rpx;
    filter: drop-shadow(0 8rpx 16rpx rgba(222, 63, 74, 0.14));
  }
  .icon-text {
    font-size: 26rpx;
    padding-top: 12rpx;
    color: #1f2935;
    font-weight: 600;
  }

  @media screen and (min-width: 600px) {
    .root {
      min-width: 92px;
    }

    .icon-shell {
      width: 68px;
      height: 68px;
    }

    .icon {
      width: 68px;
      height: 68px;
    }

    .icon-text {
      padding-top: 8px;
      font-size: 16px;
    }
  }

  @media screen and (min-width: 900px) {
    .root {
      min-width: 108px;
    }
  }
</style>
