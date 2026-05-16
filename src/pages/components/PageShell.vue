<template>
  <view class="page-shell" :class="pageClass">
    <NavigationBar :page-title="title" :show-refresh="showRefresh" @refresh="$emit('refresh')" />
    <view class="page-content" :class="contentClass">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import NavigationBar from "@/pages/components/NavigationBar.vue";

withDefaults(defineProps<{
  title: string
  showRefresh?: boolean
  pageClass?: string
  contentClass?: string
}>(), {
  showRefresh: false,
  pageClass: "",
  contentClass: ""
});

defineEmits<{
  (e: 'refresh'): void
}>();
</script>

<style scoped>
.page-shell {
  min-height: 100vh;
  background: #f5f7fb;
}

.page-content {
  padding: 204rpx 28rpx 56rpx;
  box-sizing: border-box;
}

.markdown-card,
.content-card {
  background: #fff;
}

.markdown-card {
  min-height: 100vh;
}

.content-card {
  border-radius: 20rpx;
}

@media screen and (min-width: 600px) {
  .page-content {
    max-width: 820px;
    margin: 0 auto;
    padding: 178px 32px 64px;
  }

  .markdown-card {
    min-height: auto;
    border-radius: 16px;
  }

  .content-card {
    border-radius: 16px;
  }
}

@media screen and (min-width: 900px) and (orientation: landscape) {
  .page-content {
    max-width: 900px;
    padding-top: 112px;
  }
}
</style>
