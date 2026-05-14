<template>
  <view class="settings-page">
    <UserInfoCard :info="info" />
    <view class="menu-list">
      <MenuItem
        title="绑定信息"
        icon-style="cuIcon-people"
        has-arrow
        @click="navToLogin"
      />
      <MenuItem
        title="清除缓存"
        icon-style="cuIcon-delete"
        @click="confirmClearCache"
      />
      <MenuItem
        title="使用教程"
        icon-style="cuIcon-copy"
        has-arrow
        @click="navToTutorial"
      />
      <MenuItem
        title="关于我们"
        icon-style="cuIcon-notification"
        has-arrow
        @click="navToAbout"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
  import {stdClearAllStorage} from "@/core/storage";
  import UserInfoCard from "@/pages/index/_settings/UserInfoCard.vue";
  import {onMounted, ref} from "vue";
  import stdUser from "@/core/StdUser";
  import type {UserInfo} from "@/core/StdUser";
  import MenuItem from "@/pages/index/_settings/MenuItem.vue";
  import StdModel from "@/core/StdModel";
  import {onShow} from "@dcloudio/uni-app";

  const info = ref<UserInfo | null>(null);
  onMounted(refreshUserInfo);
  onShow(refreshUserInfo);

  async function refreshUserInfo() {
    info.value = await stdUser.getUserInfo(false);
  }

  async function confirmClearCache() {
    await uni.showModal({
      title: "清除缓存",
      content: "将清除本地账号、课表、成绩等缓存数据。",
      confirmText: "清除",
      confirmColor: "#ff3b3b",
      success: async result => {
        if (!result.confirm) return;
        await clearCache();
      }
    });
  }

  async function clearCache() {
    info.value = null;
    await stdClearAllStorage();
    StdModel.clearAll();
    await uni.showToast({ title: "已清除", icon: "success"});
  }

  async function navToLogin() { await uni.navigateTo({ url: "/pages/index/login/index" }); }
  async function navToAbout() { await uni.navigateTo({ url: "/pages/index/about/index" }); }
  async function navToTutorial() { await uni.navigateTo({ url: "/pages/index/tutorial/index" }); }
</script>

<style scoped>
.settings-page {
  min-height: calc(100vh - 100rpx);
  padding: 0 28rpx 160rpx;
  background: #f5f7fb;
}

.menu-list {
  margin-top: 22rpx;
  overflow: hidden;
  border-radius: 24rpx;
  background: #fff;
  border: 1rpx solid rgba(219, 225, 235, 0.95);
  box-shadow: 0 16rpx 40rpx rgba(31, 43, 58, 0.07);
}

@media screen and (min-width: 600px) {
  .settings-page {
    max-width: 760px;
    margin: 0 auto;
    padding: 0 28px 110px;
    box-sizing: border-box;
  }

  .menu-list {
    margin-top: 22px;
    border-radius: 18px;
  }
}
</style>
