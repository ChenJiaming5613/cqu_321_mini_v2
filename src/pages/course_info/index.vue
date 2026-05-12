<template>
  <NavigationBar pageTitle="查课" show-refresh @refresh="onTapQuery"/>
  <view class="tabs-shell">
    <TabBar :search-type="searchType" @click="(newSearchType: SearchType) => { searchType = newSearchType; }"/>
  </view>
  <view class="page">
    <view class="search-panel">
      <view class="search-form">
        <input
            type="text"
            :placeholder="'请输入' + (searchType === SearchType.CourseName ? '课程' : '老师') + '的名称'"
            v-model="queryInfo"
            confirm-type="search"
            @confirm="onTapQuery"
        />
        <text class="cuIcon-search search-icon"></text>
      </view>
      <view class="query-row">
        <button class="cu-btn query-btn" @click="onTapQuery">查询</button>
      </view>
    </view>
    <view v-if="searchType === SearchType.CourseName">
      <view v-if="dataByCourseName.length > 0">
        <ScoreLegend />
        <CourseItem
            v-for="(courseAbstract, index) in dataByCourseName"
            :key="index"
            :course-abstract="courseAbstract"
        />
      </view>
      <Tip v-else/>
    </view>
    <view v-else>
      <view v-if="dataByTeacherName.length > 0">
        <ScoreLegend />
        <TeacherCourse
            v-for="([teacherName, courseAbstractList], index) in dataByTeacherName"
            :teacher-name="teacherName"
            :course-abstract-list="courseAbstractList"
            :key="index"
            @click="onTapDetail"
        />
      </view>
      <Tip v-else/>
    </view>
  </view>
</template>

<script setup lang="ts">
  import NavigationBar from "@/pages/components/NavigationBar.vue";
  import TabBar from "@/pages/course_info/TabBar.vue";
  import CourseInfoModel, {type CourseAbstract, SearchType} from "@/models/CourseInfoModel";
  import {ref} from "vue";
  import CourseItem from "@/pages/course_info/CourseItem.vue";
  import {arrayGroupBy} from "@/utils/util";
  import TeacherCourse from "@/pages/course_info/TeacherCourse.vue";
  import Tip from "@/pages/course_info/Tip.vue";
  import ScoreLegend from "@/pages/course_info/ScoreLegend.vue";
  const searchType = ref(SearchType.CourseName);
  const dataByCourseName = ref<CourseAbstract[]>([]);
  const dataByTeacherName = ref<[string, CourseAbstract[]][]>([]);
  const queryInfo = ref("");
  async function onTapQuery() {
    if (queryInfo.value.length > 0) {
      await uni.showLoading({ title: "查询中" });
      const data = await CourseInfoModel.query(searchType.value, queryInfo.value);
      uni.hideLoading();
      if (searchType.value === SearchType.CourseName) {
        dataByCourseName.value = data;
      }
      else {
        dataByTeacherName.value = Array.from(arrayGroupBy<string, CourseAbstract>(data, "instructor"));
      }
    }
    else {
      await uni.showToast({
        title: "输入不能为空",
        icon: "error"
      });
    }
  }
  async function onTapDetail(courseAbstract: CourseAbstract) {
    await uni.navigateTo({ url: `./detail/index?name=${courseAbstract.name}&code=${courseAbstract.code}` });
  }
</script>

<style scoped>
.page {
  min-height: calc(100vh - 260rpx);
  padding: 28rpx 0 60rpx;
  background: #f7f7f7;
}

.tabs-shell {
  padding-top: 180rpx;
  background: #fff;
}

.search-panel {
  padding: 0 62rpx;
}

.search-form {
  display: flex;
  align-items: center;
  height: 50rpx;
  padding: 0 18rpx;
  border: 1rpx solid #d8d8d8;
  border-radius: 6rpx;
  background: #fff;
}

.search-form input {
  flex: 1;
  height: 48rpx;
  color: #555;
  font-size: 24rpx;
}

.search-icon {
  color: #777;
  font-size: 34rpx;
}

.query-row {
  display: flex;
  justify-content: center;
  padding: 34rpx 0 8rpx;
}

.query-btn {
  width: 190rpx;
  height: 58rpx;
  line-height: 58rpx;
  border-radius: 14rpx;
  background: #ff3d46;
  color: #fff;
  font-size: 26rpx;
}
</style>
