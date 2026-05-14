<template>
  <view class="account-card">
    <view class="page-kicker">Account</view>
    <view class="hero-row">
      <view class="avatar">
        <image v-if="info !== null" class="avatar-img" :src="getSvgPath('default_avator')" mode="aspectFill"/>
        <text v-else class="avatar-icon cuIcon-people"></text>
      </view>
      <view class="account-copy">
        <view class="account-name">{{info?.name || '绑定信息'}}</view>
        <view v-if="info !== null" class="account-meta">
          <text class="status-dot"></text>
          <text>统一身份认证</text>
        </view>
        <view v-else class="account-hint">绑定校园账号后可使用成绩、课表、考试等功能</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import type {UserInfo} from "@/core/StdUser";
  import {getSvgPath} from "@/utils/resource";

  defineProps<{ info: UserInfo | null }>();
</script>

<style scoped>
.account-card {
  padding: 104rpx 0 34rpx;
}

.page-kicker {
  margin-left: 6rpx;
  color: #de3f4a;
  font-size: 24rpx;
  line-height: 48rpx;
  font-weight: 700;
}

.hero-row {
  margin-top: 22rpx;
  min-height: 210rpx;
  padding: 34rpx 34rpx;
  display: flex;
  align-items: center;
  border-radius: 28rpx;
  background:
    linear-gradient(135deg, rgba(255, 242, 239, 0.95) 0%, rgba(255, 255, 255, 0.98) 56%),
    #ffffff;
  border: 1rpx solid rgba(219, 225, 235, 0.95);
  box-shadow: 0 18rpx 42rpx rgba(31, 43, 58, 0.08);
}

.avatar {
  width: 132rpx;
  height: 132rpx;
  flex: 0 0 132rpx;
  border-radius: 50%;
  background: #1f2935;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 26rpx rgba(31, 43, 58, 0.16);
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.avatar-icon {
  color: #fff;
  font-size: 72rpx;
}

.account-copy {
  min-width: 0;
  margin-left: 30rpx;
}

.account-name {
  color: #1b2430;
  font-size: 38rpx;
  font-weight: 700;
  line-height: 48rpx;
}

.account-meta {
  margin-top: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667381;
  font-size: 26rpx;
  font-weight: 600;
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
  margin-top: 18rpx;
  color: #7d8794;
  font-size: 25rpx;
  line-height: 36rpx;
}

@media screen and (min-width: 600px) {
  .account-card {
    padding: 86px 0 26px;
  }

  .page-kicker {
    margin-left: 4px;
    font-size: 16px;
    line-height: 34px;
  }

  .hero-row {
    margin-top: 16px;
    min-height: 150px;
    padding: 24px;
    border-radius: 18px;
  }

  .avatar {
    width: 96px;
    height: 96px;
    flex-basis: 96px;
  }

  .account-copy {
    margin-left: 24px;
  }

  .account-name {
    font-size: 28px;
    line-height: 34px;
  }

  .account-meta {
    justify-content: flex-start;
    margin-top: 12px;
    font-size: 18px;
  }

  .status-dot {
    width: 9px;
    height: 9px;
    margin-right: 12px;
  }
}
</style>
