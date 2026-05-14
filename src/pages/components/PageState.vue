<template>
  <view v-if="state !== 'ready'" class="page-state">
    <view v-if="state === 'loading'" class="loading-state">
      <text class="cuIcon-loading2 loading-icon"></text>
      <text>{{loadingMessage}}</text>
    </view>
    <Empty
      v-else-if="state === 'unauthorized'"
      icon-type="warning"
      :message="unauthorizedMessage"
      :hint="unauthorizedHint"
      :button-text="loginText"
      @action="onLogin"
    />
    <Empty
      v-else-if="state === 'error'"
      icon-type="error"
      :message="errorMessage"
      :hint="errorHint"
      :button-text="retryText"
      @action="$emit('retry')"
    />
    <Empty
      v-else
      icon-type="success"
      :message="emptyMessage"
      :hint="emptyHint"
      :button-text="emptyActionText"
      @action="$emit('emptyAction')"
    />
  </view>
</template>

<script setup lang="ts">
  import Empty from "@/pages/components/Empty.vue";

  withDefaults(defineProps<{
    state: "loading" | "unauthorized" | "empty" | "error" | "ready"
    loadingMessage?: string
    unauthorizedMessage?: string
    unauthorizedHint?: string
    loginText?: string
    emptyMessage?: string
    emptyHint?: string
    emptyActionText?: string
    errorMessage?: string
    errorHint?: string
    retryText?: string
  }>(), {
    loadingMessage: "加载中",
    unauthorizedMessage: "请先绑定账号",
    unauthorizedHint: "绑定账号后即可查看该页面数据",
    loginText: "去绑定",
    emptyMessage: "暂无数据",
    emptyHint: "当前账号暂时没有可展示的数据",
    emptyActionText: "",
    errorMessage: "加载失败",
    errorHint: "请稍后重试",
    retryText: "重试"
  });

  defineEmits<{
    (e: "retry"): void
    (e: "emptyAction"): void
  }>();

  async function onLogin() {
    await uni.navigateTo({ url: "/pages/index/login/index" });
  }
</script>

<style scoped>
.page-state {
  width: 100%;
}

.loading-state {
  min-height: 520rpx;
  padding: 120rpx 48rpx 80rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22rpx;
  color: #7d8794;
  font-size: 28rpx;
  background: #f5f7fb;
}

.loading-icon {
  color: #de3f4a;
  font-size: 52rpx;
  animation: state-rotate 0.9s linear infinite;
}

@keyframes state-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
