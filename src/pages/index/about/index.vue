<template>
  <PageShell title="关于我们" content-class="markdown-card">
    <ua-markdown :source="mdText"/>
  </PageShell>
</template>
<script setup lang="ts">
  import UaMarkdown from "@/pages/components/ua-markdown/ua-markdown.vue";
  import PageShell from "@/pages/components/PageShell.vue";
  import {ref} from "vue";
  import {onShow} from "@dcloudio/uni-app";
  import {oldRequestV1} from "@/core/old";
  const mdText = ref("");
  onShow(async () => {
    const res = await oldRequestV1({ url: "/about/about_us" });
    mdText.value = res.Content;
  });
</script>