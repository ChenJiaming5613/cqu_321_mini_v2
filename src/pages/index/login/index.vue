<template>
  <view class="page">
    <NavigationBar page-title="绑定信息"/>
    <view class="content">
      <view class="avatar">
        <image class="avatar-img" :src="getSvgPath('default_avator')" mode="aspectFill"/>
      </view>
      <view class="section-title">
        <text class="dot dot-green"></text>
        <text>统一身份认证</text>
      </view>
      <view class="form">
        <view class="field">
          <view class="label">账号</view>
          <view class="input-wrap">
            <input
              v-model="info.username"
              placeholder="请输入你的学号或者统一身份认证账号"
              placeholder-class="placeholder"
              confirm-type="next"
            />
            <text class="cuIcon-edit input-icon"></text>
          </view>
          <view v-if="isCheck && info.username.length === 0" class="error">请输入账号</view>
        </view>
        <view class="field">
          <view class="label">密码</view>
          <view class="input-wrap">
            <input
              v-model="info.password"
              password
              placeholder="请输入你的统一身份认证密码"
              placeholder-class="placeholder"
              confirm-type="done"
              @confirm="onTapLogin"
            />
            <text class="cuIcon-edit input-icon"></text>
          </view>
          <view v-if="isCheck && info.password.length === 0" class="error">请输入密码</view>
        </view>
        <view class="identity-row">
          <view
            class="identity-option"
            :class="info.identity === 0 ? 'active' : ''"
            @click="info.identity = 0"
          >
            <text>本科生</text>
            <text class="radio"></text>
          </view>
          <view
            class="identity-option"
            :class="info.identity === 1 ? 'active' : ''"
            @click="info.identity = 1"
          >
            <text>研究生</text>
            <text class="radio"></text>
          </view>
        </view>
        <button class="bind-btn" :disabled="isLoading" @click="onTapLogin">
          {{isLoading ? '绑定中' : '绑定'}}
        </button>
      </view>
      <view class="privacy-note">绑定后账号信息仅保存在本地，用于调用校园数据接口。</view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import {ref} from "vue";
  import {login} from "@/core/network";
  import {stdShowErrorToast} from "@/core/common";
  import NavigationBar from "@/pages/components/NavigationBar.vue";
  import {getSvgPath} from "@/utils/resource";

  const info = ref({
    username: "",
    password: "",
    identity: 0
  });
  const isCheck = ref(false);
  const isLoading = ref(false);

  function checkInfo() {
    isCheck.value = true;
    return info.value.username.length > 0 && info.value.password.length > 0;
  }

  async function onTapLogin() {
    if (isLoading.value || !checkInfo()) return;
    await uni.showModal({
      title: "用户信息隐私说明",
      content: "学号、姓名、统一认证账号、密码均为本地存储，有特殊功能需要存储于服务器时会单独通知，请放心使用。详细隐私协议可见321CQU小程序隐私保护指引。",
      confirmText: "确定",
      confirmColor: "#ff3b3b",
      success: async result => {
        if (!result.confirm) return;
        await bindAccount();
      }
    });
  }

  async function bindAccount() {
    isLoading.value = true;
    await uni.showLoading({title: "绑定中"});
    try {
      await login(info.value.username, info.value.password);
      uni.hideLoading();
      await uni.showToast({ title: "绑定成功", icon: "success" });
      await uni.navigateBack({ delta: 1});
    } catch (e: any) {
      uni.hideLoading();
      await stdShowErrorToast(e);
    } finally {
      isLoading.value = false;
    }
  }
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f7f7;
}

.content {
  padding: 228rpx 56rpx 64rpx;
}

.avatar {
  width: 172rpx;
  height: 172rpx;
  margin: 0 auto 38rpx;
  border-radius: 50%;
  background: #d8d8d8;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.section-title {
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 34rpx;
  font-weight: 700;
}

.dot {
  width: 14rpx;
  height: 14rpx;
  margin-right: 20rpx;
  border-radius: 50%;
}

.dot-green {
  background: #69c66d;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.label {
  margin: 0 0 14rpx 24rpx;
  color: #666;
  font-size: 28rpx;
  font-weight: 700;
}

.input-wrap {
  height: 92rpx;
  padding: 0 30rpx 0 36rpx;
  border-radius: 28rpx;
  background: #fff;
  display: flex;
  align-items: center;
}

.input-wrap input {
  flex: 1;
  min-width: 0;
  color: #555;
  font-size: 27rpx;
}

.placeholder {
  color: #d5d5d5;
}

.input-icon {
  margin-left: 18rpx;
  color: #777;
  font-size: 34rpx;
}

.error {
  margin: 10rpx 0 0 24rpx;
  color: #ff3b3b;
  font-size: 22rpx;
}

.identity-row {
  display: flex;
  justify-content: center;
  gap: 56rpx;
  padding: 2rpx 0 4rpx;
}

.identity-option {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 32rpx;
  font-weight: 700;
}

.radio {
  width: 44rpx;
  height: 44rpx;
  margin-left: 18rpx;
  border-radius: 50%;
  border: 3rpx solid #d5d5d5;
  background: #fff;
}

.identity-option.active .radio {
  border-color: #ff3b3b;
  box-shadow: inset 0 0 0 10rpx #fff;
  background: #ff3b3b;
}

.bind-btn {
  width: 490rpx;
  height: 82rpx;
  margin: 8rpx auto 0;
  padding: 0;
  border-radius: 14rpx;
  background: #ff3b3b;
  color: #fff;
  font-size: 34rpx;
  font-weight: 700;
  line-height: 82rpx;
}

.bind-btn::after {
  border: none;
}

.bind-btn[disabled] {
  background: #ff8d8d;
  color: #fff;
}

.privacy-note {
  margin-top: 30rpx;
  color: #aaa;
  font-size: 22rpx;
  line-height: 34rpx;
  text-align: center;
}
</style>
