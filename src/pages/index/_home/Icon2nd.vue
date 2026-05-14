<template>
  <view class="flex flex-direction align-center text-center root std-bottom-margin-normal" @click="$emit('click')">
<!--    <view class="icon-bg" :class="disabled ? 'disable' : 'able'">-->
<!--      <text class="text-white icon" :class="iconName"></text>-->
<!--    </view>-->
    <view class="icon-shell">
      <image class="icon" :src="`/static/images/icon_${iconName}.svg`"/>
    </view>
    <view class="icon-text text-df">{{ title }}</view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  iconName: string
  title: string
  disabled?: boolean
}>();
defineEmits<{
  (e: 'click'):void
}>();
</script>

<style scoped>
.root {
  width: 120rpx;
}
.icon-shell {
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon {
  width: 44rpx;
  height: 44rpx;
  filter: drop-shadow(0 5rpx 10rpx rgba(222, 63, 74, 0.1));
}
.icon-text {
  padding-top: 10rpx;
  color: #52606f;
  font-size: 24rpx;
  font-weight: 600;
}

@media screen and (min-width: 600px) {
  .root {
    width: 78px;
    margin-bottom: 14px;
  }

  .icon-shell {
    width: 30px;
    height: 30px;
  }

  .icon {
    width: 30px;
    height: 30px;
  }

  .icon-text {
    padding-top: 6px;
    font-size: 14px;
  }
}
</style>
