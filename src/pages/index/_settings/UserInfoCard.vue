<template>
  <view class="account-card">
    <view class="page-title">Account</view>
    <view class="avatar">
      <image v-if="info !== null" class="avatar-img" :src="getSvgPath('default_avator')" mode="aspectFill"/>
      <text v-else class="avatar-icon cuIcon-people"></text>
    </view>
    <view class="account-name">{{info?.name || '绑定信息'}}</view>
    <view v-if="info !== null" class="account-meta">
      <text class="status-dot"></text>
      <text>统一身份认证</text>
    </view>
    <view v-else class="account-hint">绑定校园账号后可使用成绩、课表、考试等功能</view>
  </view>
</template>

<script setup lang="ts">
  import type {UserInfo} from "@/core/StdUser";
  import {getSvgPath} from "@/utils/resource";

  defineProps<{ info: UserInfo | null }>();
</script>

<style scoped>
.account-card {
  padding: 126rpx 48rpx 42rpx;
  text-align: center;
}

.page-title {
  color: #111;
  font-size: 38rpx;
  line-height: 48rpx;
  font-weight: 700;
}

.avatar {
  width: 174rpx;
  height: 174rpx;
  margin: 56rpx auto 24rpx;
  border-radius: 50%;
  background: #d8d8d8;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.avatar-icon {
  color: #fff;
  font-size: 92rpx;
}

.account-name {
  color: #666;
  font-size: 34rpx;
  font-weight: 700;
  line-height: 48rpx;
}

.account-meta {
  margin-top: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 32rpx;
  font-weight: 700;
}

.status-dot {
  width: 14rpx;
  height: 14rpx;
  margin-right: 20rpx;
  border-radius: 50%;
  background: #69c66d;
}

.account-hint {
  max-width: 520rpx;
  margin: 22rpx auto 0;
  color: #999;
  font-size: 24rpx;
  line-height: 36rpx;
}
</style>
