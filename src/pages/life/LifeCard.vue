<template>
  <view class="card std-page-margin">
    <view class="row1">
      <image class="row1-icon" :src="getSvgPath('card')"/>
      <view class="row1-text">{{lifeCardType}}</view>
    </view>
    <view class="row2"> {{info}} </view>
    <view class="row3">
      <view class="row3-item" v-for="(balance, index) in balanceList" :key="balance.title">
        <view v-if="index > 0" class="row3-line"></view>
        <view class="row3-col">
          <view class="row3-col-text1">{{ balance.title }}</view>
          <view class="row3-col-text2">¥{{ balance.amount }}</view>
        </view>
      </view>
      <image class="row3-icon"  :src="getSvgPath('life_circle')"/>
    </view>
  </view>
</template>

<script setup lang="ts">
  import {getSvgPath} from "@/utils/resource";
  defineProps<{
    lifeCardType: string
    info: string
    balanceList: {
      title: string
      amount: number
    }[]
  }>();

</script>

<style scoped>
.card {
  border-radius: 40rpx;
  background: rgba(254, 59, 57, 0.5);
  padding: 50rpx 50rpx 30rpx 50rpx;
  color: white;
  margin-bottom: 30rpx;
}
.row1 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.row1-icon {
  width: 56rpx;
  height: 40rpx;
}
.row1-text {
  font-size: 30rpx;
  font-weight: bold;
}
.row2 {
  font-size: 30rpx;
  margin-top: 40rpx;
  margin-bottom: 80rpx;
}
.row3 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 110rpx;
}
.row3-icon {
  width: 110rpx;
  height: 110rpx;
}
.row3-col {
  display: flex;
  flex-direction: column;
}
.row3-col-text1 {
  font-size: 24rpx;
  opacity: 0.8;
}
.row3-col-text2 {
  font-size: 34rpx;
  font-weight: bold;
}
.row3-line {
  width: 2rpx;
  height: 56rpx;
  background-color: white;
  margin-right: 20rpx;
}
.row3-item {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>