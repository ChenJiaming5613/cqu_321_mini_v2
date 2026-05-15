<template>
  <TabBar v-model:tab-cur="tabCur"/>
  <view class="page std-bg-primary padding-top padding-bottom-xl">
    <PageState
      v-if="pageState !== 'ready'"
      :state="pageState"
      empty-message="暂无借阅"
      empty-hint="当前账号暂时没有可展示的借阅数据"
      error-message="借阅信息加载失败"
      @retry="loadLibraryInfo"
    />
    <view v-else-if="tabCur === 0">
      <BookInfoCard v-for="(bookInfo, index) in currBookInfos" :key="index" :book-info="bookInfo"/>
    </view>
    <view v-else-if="tabCur === 1">
      <BookInfoCard v-for="(bookInfo, index) in prevBookInfos" :key="index" :book-info="bookInfo"/>
    </view>
  </view>
</template>

<script setup lang="ts">
  import LibraryModel from "@/models/LibraryModel";
  import type {BookInfo} from "@/models/LibraryModel";
  import {ref} from "vue";
  import BookInfoCard from "@/pages/library/BookInfoCard.vue";
  import TabBar from "@/pages/library/TabBar.vue";
  import PageState from "@/pages/components/PageState.vue";
  import {useAuthorizedPageData} from "@/composables/useAuthorizedPageData";

  const tabCur = ref(0);
  const currBookInfos = ref<BookInfo[]>([]);
  const prevBookInfos = ref<BookInfo[]>([]);

  const { pageState, loadPageData: loadLibraryInfo } = useAuthorizedPageData({
    hasReadyData: () => tabCur.value === 0 ? currBookInfos.value.length > 0 : prevBookInfos.value.length > 0,
    hasInitialData: () => currBookInfos.value.length > 0 || prevBookInfos.value.length > 0,
    loadData: async () => {
      const libraryModel = LibraryModel.getInstance();
      const [currBooksResult, prevBooksResult] = await Promise.all([
        libraryModel.update(true),
        libraryModel.update(false)
      ]);
      if (!currBooksResult.ok) throw currBooksResult.error;
      if (!prevBooksResult.ok) throw prevBooksResult.error;
      currBookInfos.value = currBooksResult.data;
      prevBookInfos.value = prevBooksResult.data;
    },
    clearData: () => {
      currBookInfos.value = [];
      prevBookInfos.value = [];
    },
    logTag: "LibraryPage",
    registerOnShow: true
  });
</script>

<style scoped>
  .page {
    margin-top: 80rpx;
  }
</style>
