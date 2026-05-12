<template>
  <TabBar :tab-cur="tabCur" @on-tap-tab="onTapTab" />
  <view class="std-bg-primary" style="padding: 120rpx 0;">
    <view v-if="tabCur === 0">
      <view v-if="customCourses.length === 0">
        <Empty icon-type="warning" message="暂无自定义课程"/>
        <view class="text-center bg-white padding-bottom">
          <button class="cu-btn bg-blue round" @click="tabCur = 2">去创建</button>
        </view>
      </view>
      <CustomCourseCard
          v-for="(course, index) in customCourses"
          :key="index"
          :course="course"
          @edit="() => { onTapEdit(course) }"
          @delete="() => { onTapDelete(course) }"
      />
    </view>
    <CourseForm v-if="tabCur === 2" @submit="onSubmit" :old-custom-course="oldCustomCourse"/>
    <PriorityPage v-if="tabCur === 1"/>
  </view>
</template>

<script setup lang="ts">
  import TabBar from "@/pages/curriculum/edit/TabBar.vue";
  import {ref} from "vue";
  import CourseForm from "@/pages/curriculum/edit/CourseForm.vue";
  import {onShow} from "@dcloudio/uni-app";
  import type {CustomCourse} from "@/models/CustomCourseModel";
  import CustomCourseModel from "@/models/CustomCourseModel";
  import CustomCourseCard from "@/pages/curriculum/edit/CustomCourseCard.vue";
  import PriorityPage from "@/pages/curriculum/edit/PriorityPage.vue";
  import Empty from "@/pages/components/Empty.vue";

  const customCourseModel = CustomCourseModel.getInstance();
  const tabCur = ref(0);
  const customCourses = ref<CustomCourse[]>([]);
  const oldCustomCourse = ref<CustomCourse>();

  onShow(init);
  async function init() {
    customCourses.value = await customCourseModel.get();
  }
  async function onTapTab(tab: number) {
    tabCur.value = tab;
    if (tab === 2) oldCustomCourse.value = undefined;
  }
  async function onTapEdit(customCourse: CustomCourse) {
    await uni.vibrateShort();
    oldCustomCourse.value = customCourse;
    tabCur.value = 2;
  }
  async function onTapDelete(customCourse: CustomCourse) {
    await uni.vibrateShort();
    uni.showModal({
      title: `是否删除：${customCourse.name}`,
      success: async result => {
        if (result.confirm) {
          await customCourseModel.del(customCourse);
          customCourses.value = await customCourseModel.get();
          await uni.showToast({ title: "已删除", icon: "success" });
        }
      }
    });
  }
  async function onSubmit(customCourse: CustomCourse) {
    if (oldCustomCourse.value !== undefined) {
      await customCourseModel.del(oldCustomCourse.value);
      oldCustomCourse.value = undefined;
    }
    await customCourseModel.add(customCourse);
    await uni.showToast({ title: "添加成功", icon: "success" });
    await init();
    tabCur.value = 0;
  }
</script>
