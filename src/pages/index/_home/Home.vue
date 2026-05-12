<template>
  <view>
    <NavigationBarHome />
    <ActivityCard />
    <CardTitle class="std-bottom-margin-narrow" content="课程提醒 Course Reminders"/>
    <CourseCard curriculum-page-url="/pages/curriculum/index"/>
    <CardTitle content="百宝箱 Treasure Chests"/>
    <view class="bg-white std-border-radius std-box-shadow std-page-margin std-bottom-margin-normal">
      <view class="icons-1st padding-top padding-bottom">
        <Icon1st title="课表" icon-name="kebiao" @click="navToPage('curriculum')"/>
        <Icon1st title="成绩" icon-name="chengji" @click="navToPage('grade')"/>
        <Icon1st title="查课" icon-name="chake" @click="navToPage('course_info')"/>
        <Icon1st title="排考" icon-name="paikao" @click="navToPage('exam')"/>
      </view>
      <view class="icons-1st padding-left padding-right">
        <Icon2nd title="常用信息" icon-name="xinxi" @click="navToPage('general_info')" />
        <Icon2nd title="图书馆" icon-name="tushuguan" @click="navToPage('library')"/>
        <Icon2nd title="生活" icon-name="shenghuo" @click="navToPage('life')" />
        <Icon2nd title="体测查询" icon-name="tice" @click="showComingSoon"/>
        <Icon2nd title="志愿时长" icon-name="xinxi" @click="showComingSoon"/>
        <Icon2nd title="空教室" icon-name="kongjiaoshi" @click="showComingSoon"/>
      </view>
    </view>
    <ad-custom unit-id="adunit-67019180b6466026"></ad-custom>
  </view>
</template>

<script setup lang="ts">
  import Icon1st from "@/pages/index/_home/Icon1st.vue";
  import Icon2nd from "@/pages/index/_home/Icon2nd.vue";
  import CourseCard from "@/pages/curriculum/CourseCard.vue";
  import ActivityCard from "@/pages/index/_home/ActivityCard.vue";
  import CardTitle from "@/pages/index/_home/CardTitle.vue";
  import NavigationBarHome from "@/pages/components/NavigationBarHome.vue";

  function navToPage(pageName: string) {
    return uni.navigateTo({url: `/pages/${pageName}/index`});
  }
  function showComingSoon() {
    uni.showModal({
      title: "敬请期待",
      content: "该功能正在规划中，后续版本开放。",
      showCancel: false,
      confirmText: "知道了"
    });
  }
</script>

<style scoped>
  .cqu-buildings {
    height: 80rpx;
    width: 432rpx;
    display: block;
    margin: 0 auto;
  }
  .icons-1st {
    display: flex;
    flex-wrap: wrap;
    row-gap: 12rpx;
    justify-content: space-evenly;
    border-radius: 20rpx;
  }
</style>