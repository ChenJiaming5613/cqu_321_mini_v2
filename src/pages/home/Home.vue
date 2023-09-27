<template>
  <view>
    <image class="cqu-buildings" :src="getSvgPath('cqu_buildings')"/>
    <ActivityCard />
    <CourseCard curriculum-page-url="../curriculum/index"/>
    <view class="bg-white margin std-border-radius std-box-shadow padding-top padding-bottom">
      <view class="icons-1st padding-bottom">
        <Icon1st title="课表" icon-name="kebiao" @click="navToCurriculumPage"/>
        <Icon1st title="成绩" icon-name="chengji" @click="navToGradePage"/>
        <Icon1st title="查课" icon-name="chake" @click="navToCourseInfoPage"/>
        <Icon1st title="排考" icon-name="paikao" @click="navToExamPage"/>
      </view>
      <view class="icons-1st padding-left padding-right">
        <Icon2nd title="常用信息" icon-name="xinxi" @click="navToGeneralInfoPage" />
        <Icon2nd title="图书馆" icon-name="tushuguan" @click="navToLibraryPage"/>
        <Icon2nd title="生活" icon-name="shenghuo" @click="navToLifePage" />
<!--        <Icon2nd title="空教室" icon-name="cuIcon-location" />-->
        <Icon2nd title="体测查询" icon-name="tice" disabled />
        <Icon2nd title="空教室" icon-name="kongjiaoshi" @click="navToEmptyRoomPage"/>
      </view>
    </view>
  </view>
  <ad-custom unit-id="adunit-67019180b6466026"></ad-custom>
</template>

<script setup lang="ts">
  import Icon1st from "@/pages/home/Icon1st.vue";
  import Icon2nd from "@/pages/home/Icon2nd.vue";
  import CourseCard from "@/pages/curriculum/CourseCard.vue";
  import ActivityCard from "@/pages/home/ActivityCard.vue";
  import {getSvgPath} from "@/utils/resource";

  function navToGradePage() {
    uni.navigateTo({url: "../grade/index"});
  }
  function navToCurriculumPage() {
    uni.navigateTo({url: "../curriculum/index"});
  }
  function navToEmptyRoomPage() {
    uni.navigateTo({url: "../empty_room/index"});
  }
  function navToCourseInfoPage() {
    uni.navigateTo({url: "../course_info/index"});
  }
  function navToExamPage() {
    uni.navigateTo({url: "../exam/index"});
  }
  function navToGeneralInfoPage() {
    uni.navigateTo({url: "../general_info/index"});
  }
  function navToLibraryPage() {
    uni.navigateTo({url: "../library/index"});
  }
  function navToLifePage() {
    uni.navigateTo({url: "../life/index"});
  }
</script>

<style scoped>
  .cqu-buildings {
    height: 100rpx;
    width: 540rpx;
    display: block;
    margin: 0 auto;
  }
  .icons-1st {
    display: flex;
    justify-content: space-evenly;
    border-radius: 20rpx;
  }
</style>