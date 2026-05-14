<template>
  <NavigationBar pageTitle="查课详情"/>
  <view class="std-bg-primary padding-bottom-xl padding">
    <TitleCard :name="courseDetail.name" :code="courseDetail.code"/>
    <DetailItem
      v-for="(detail, index) in courseDetail.details"
      :key="index"
      :detail="detail" />
  </view>
</template>

<script setup lang="ts">
  import NavigationBar from "@/pages/components/NavigationBar.vue";
  import {onLoad} from "@dcloudio/uni-app";
  import {ref} from "vue";
  import CourseInfoModel from "@/models/CourseInfoModel";
  import type {CourseDetail} from "@/models/CourseInfoModel";
  import TitleCard from "@/pages/course_info/detail/TitleCard.vue";
  import DetailItem from "@/pages/course_info/detail/DetailItem.vue";
  const courseDetail = ref<CourseDetail>({} as CourseDetail);
  onLoad(async (option: any) => {
    const code = decodeURIComponent(option.code || "");
    const name = decodeURIComponent(option.name || "");
    courseDetail.value = await CourseInfoModel.queryDetail(code);
    courseDetail.value.name = name;
    courseDetail.value.code = code;
  });
</script>
