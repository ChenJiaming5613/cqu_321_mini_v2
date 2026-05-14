<template>
  <NavigationBar pageTitle="查课"/>
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
      <view v-if="dataByCourseName.length > 0" class="result-list">
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
      <view v-if="dataByTeacherName.length > 0" class="result-list">
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
  background: #f5f7fb;
}

.tabs-shell {
  padding-top: 180rpx;
  background: #fff;
  border-bottom: 1rpx solid #eef1f5;
}

.search-panel {
  margin: 0 42rpx 24rpx;
  padding: 28rpx 24rpx;
  border-radius: 24rpx;
  background: #fff;
  border: 1rpx solid rgba(219, 225, 235, 0.95);
  box-shadow: 0 14rpx 34rpx rgba(31, 43, 58, 0.06);
}

.search-form {
  display: flex;
  align-items: center;
  height: 76rpx;
  padding: 0 22rpx;
  border: 1rpx solid #e7ebf1;
  border-radius: 20rpx;
  background: #f9fafc;
}

.search-form input {
  flex: 1;
  height: 74rpx;
  color: #1f2935;
  font-size: 26rpx;
}

.search-icon {
  color: #98a1ad;
  font-size: 34rpx;
}

.query-row {
  display: flex;
  justify-content: center;
  padding: 24rpx 0 0;
}

.query-btn {
  width: 190rpx;
  height: 58rpx;
  line-height: 58rpx;
  border-radius: 18rpx;
  background: #de3f4a;
  color: #fff;
  font-size: 26rpx;
}

@media screen and (min-width: 600px) {
  .page {
    max-width: 920px;
    margin: 0 auto;
    padding: 28px 28px 72px;
    box-sizing: border-box;
  }

  .tabs-shell {
    padding-top: 154px;
  }

  .search-panel {
    max-width: 720px;
    margin: 0 auto 24px;
    padding: 22px;
    border-radius: 18px;
  }

  .search-form {
    height: 54px;
    padding: 0 18px;
    border-radius: 14px;
  }

  .search-form input {
    height: 52px;
    font-size: 17px;
  }

  .search-icon {
    font-size: 25px;
  }

  .query-row {
    padding-top: 16px;
  }

  .query-btn {
    width: 132px;
    height: 42px;
    line-height: 42px;
    border-radius: 13px;
    font-size: 16px;
  }
}

  @media screen and (min-width: 900px) {
  .search-panel {
    max-width: 920px;
  }

  .result-list {
    max-width: 920px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 18px;
    align-items: start;
  }

  .result-list :deep(.score-legend) {
    grid-column: 1 / -1;
  }
}
</style>
