<template>
  <PageShell title="详情" content-class="content-card std-box-shadow">
    <ua-markdown :source="markdownContent"/>
  </PageShell>
</template>

<script setup lang="ts">
  import {onLoad} from "@dcloudio/uni-app";
  import {getMarkdownUrl} from "@/core/common";
  import {ref} from "vue";
  import UaMarkdown from "@/pages/components/ua-markdown/ua-markdown.vue";
  import PageShell from "@/pages/components/PageShell.vue";
  const markdownContent = ref("");
  onLoad(async (option?: Record<string, any>) => {
    const res = await uni.request({ url: getMarkdownUrl(option?.url || ""), method: "GET" });
    if (res.statusCode === 200) markdownContent.value = res.data as string;
  });
</script>
