<template>
  <view class="menu-item" @click="$emit('click')">
    <view class="item-main">
      <text class="item-icon" :class="iconStyle"></text>
      <text class="item-title">{{title}}</text>
    </view>
    <view class="item-side">
      <text v-if="value" class="item-value">{{value}}</text>
      <text v-if="hasArrow" class="cuIcon-right item-arrow"></text>
    </view>
  </view>
</template>

<script setup lang="ts">
  defineProps<{
    iconStyle: string
    title: string
    value?: string
    hasArrow?: boolean
  }>();
  defineEmits<{ (e: 'click'): void }>();
</script>

<style scoped>
.menu-item {
  min-height: 112rpx;
  padding: 0 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #eef1f5;
}

.menu-item:last-child {
  border-bottom: 0;
}

.item-main,
.item-side {
  display: flex;
  align-items: center;
}

.item-icon {
  width: 62rpx;
  height: 62rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #de3f4a;
  background: #fff2ef;
  border-radius: 18rpx;
  font-size: 34rpx;
  line-height: 1;
}

.item-title {
  margin-left: 24rpx;
  color: #1f2935;
  font-size: 30rpx;
  font-weight: 600;
}

.item-value {
  color: #667381;
  font-size: 28rpx;
  font-weight: 600;
}

.item-arrow {
  margin-left: 18rpx;
  color: #b3bbc6;
  font-size: 36rpx;
  font-weight: 600;
}

@media screen and (min-width: 600px) {
  .menu-item {
    min-height: 78px;
    padding: 0 24px;
  }

  .item-icon {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    font-size: 25px;
  }

  .item-title {
    margin-left: 18px;
    font-size: 22px;
  }

  .item-arrow {
    font-size: 28px;
  }
}
</style>
