<template>
  <view class="std-bg-primary padding">
    <UserInfoCard :info="info" />
    <MenuItem title="清除缓存" icon-style="cuIcon-refresh text-red" @click="clearCache" />
    <MenuItem title="使用教程" icon-style="cuIcon-read text-orange" has-arrow @click="navToTutorial"/>
    <MenuItem title="关于我们" icon-style="cuIcon-formfill text-green" has-arrow @click="navToAbout"/>
  </view>
</template>

<script setup lang="ts">
  import {stdClearAllStorage} from "@/core/storage";
  import UserInfoCard from "@/pages/index/_settings/UserInfoCard.vue";
  import {onMounted, ref} from "vue";
  import stdUser, {UserInfo} from "@/core/StdUser";
  import MenuItem from "@/pages/index/_settings/MenuItem.vue";
  import StdModel from "@/core/StdModel";

  const info = ref<UserInfo | null>(null);
  onMounted(async () => { info.value = await stdUser.getUserInfo(false) });

  async function clearCache() {
    info.value = null;
    await stdClearAllStorage();
    StdModel.clearAll();
    await uni.showToast({ title: "已清除", icon: "success"});
  }
  async function navToAbout() { await uni.navigateTo({ url: "/pages/index/about/index" }) }
  async function navToTutorial() { await uni.navigateTo({ url: "/pages/index/tutorial/index" }) }
</script>

<style scoped>

</style>