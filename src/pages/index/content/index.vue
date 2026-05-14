<template>
  <view class="page">
    <NavigationBar page-title="详情"/>
    <view class="content std-box-shadow">
      <ua-markdown :source="markdownContent"/>
    </view>
  </view>
</template>

<script setup lang="ts">
  import {onLoad} from "@dcloudio/uni-app";
  import {getMarkdownUrl} from "@/core/old";
  import {ref} from "vue";
  import UaMarkdown from "@/pages/components/ua-markdown/ua-markdown.vue";
  import NavigationBar from "@/pages/components/NavigationBar.vue";
  const markdownContent = ref("");
  onLoad(async (option: any) => {
    const res = await uni.request({ url: getMarkdownUrl(option.url), method: "GET" });
    if (res.statusCode === 200) markdownContent.value = res.data as string;
  });
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f7fb;
}

.content {
  margin: 0 24rpx;
  padding: 204rpx 28rpx 48rpx;
  border-radius: 20rpx;
  background: #fff;
  box-sizing: border-box;
}

@media screen and (min-width: 600px) {
  .content {
    max-width: 760px;
    margin: 0 auto;
    padding: 178px 32px 56px;
    border-radius: 16px;
  }
}

@media screen and (min-width: 900px) and (orientation: landscape) {
  .content {
    max-width: 860px;
    padding-top: 112px;
  }
}
</style>
