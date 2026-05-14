<template>
  <view class="course-card">
    <view class="course-head" @click="toggleExpand">
      <view class="title-wrap">
        <view class="red-dot"></view>
        <view class="course-name">{{courseAbstract.name}}</view>
      </view>
      <view class="course-code">{{courseAbstract.code}}</view>
      <text :class="['fold-icon', isExpand ? 'cuIcon-fold' : 'cuIcon-unfold']"></text>
    </view>
    <view v-if="isExpand" class="detail-area">
      <view v-if="isLoading" class="loading">加载中...</view>
      <view v-else-if="detailList.length === 0" class="loading">暂无成绩分布</view>
      <view v-else>
        <view v-for="(detail, detailIndex) in detailList" :key="detailIndex">
          <view
              v-for="(item, itemIndex) in detail.details"
              :key="detail.teacherName + item.termName + itemIndex"
              class="score-panel"
          >
            <view class="teacher-line">
              <text class="teacher-name">{{detail.teacherName || "未知教师"}}</text>
              <text class="term-name">{{item.termName}}</text>
            </view>
            <view class="meta-grid">
              <text>最高分：{{item.max}}</text>
              <text>最低分：{{item.min}}</text>
              <text>平均分：{{item.average.toFixed(0)}}</text>
              <text>参考人数：{{item.num}}</text>
            </view>
            <view class="score-bar">
              <view
                  v-for="(num, idx) in item.levels"
                  :key="idx"
                  class="score-segment"
                  :style="{ width: calcPercent(num, item.num), backgroundColor: scoreColors[idx] }"
              >
                <text v-if="num > 0">{{calcLabel(num, item.num)}}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import CourseInfoModel, {type CourseAbstract, type Detail} from "@/models/CourseInfoModel";
  import {ref} from "vue";

  const props = defineProps<{ courseAbstract: CourseAbstract }>();
  const isExpand = ref(false);
  const isLoading = ref(false);
  const detailList = ref<Detail[]>([]);
  const scoreColors = ["#ff3d46", "#ff9718", "#6fc45c", "#11b7bb", "#0a65d8"];

  async function toggleExpand() {
    isExpand.value = !isExpand.value;
    if (!isExpand.value || detailList.value.length > 0 || isLoading.value) return;
    isLoading.value = true;
    try {
      const detail = await CourseInfoModel.queryDetail(props.courseAbstract.code);
      detailList.value = detail.details;
    }
    finally {
      isLoading.value = false;
    }
  }

  function calcPercent(num: number, total: number) {
    if (total <= 0 || num <= 0) return "0%";
    return num / total * 100 + "%";
  }

  function calcLabel(num: number, total: number) {
    if (total <= 0) return "";
    return Math.round(num / total * 100) + "%";
  }
</script>

<style scoped>
.course-card {
  margin: 0 42rpx 28rpx;
  overflow: hidden;
  border-radius: 24rpx;
  background: #fff;
  border: 1rpx solid rgba(219, 225, 235, 0.95);
  box-shadow: 0 14rpx 34rpx rgba(31, 43, 58, 0.06);
}

.course-head {
  display: flex;
  align-items: center;
  min-height: 96rpx;
  padding: 0 28rpx 0 20rpx;
}

.title-wrap {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.red-dot {
  width: 12rpx;
  height: 12rpx;
  margin-right: 24rpx;
  border-radius: 50%;
  background: #de3f4a;
}

.course-name {
  overflow: hidden;
  color: #1f2935;
  font-size: 26rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.course-code {
  margin-left: 20rpx;
  color: #98a1ad;
  font-size: 24rpx;
}

.fold-icon {
  margin-left: 28rpx;
  color: #de3f4a;
  font-size: 34rpx;
  font-weight: 700;
}

.detail-area {
  margin: 0 18rpx 22rpx;
  padding-top: 18rpx;
  border-top: 1rpx solid #eef1f5;
}

.loading {
  padding: 28rpx 0;
  color: #8a95a3;
  font-size: 24rpx;
  text-align: center;
}

.score-panel {
  margin: 0 8rpx 24rpx;
  padding: 20rpx 22rpx 24rpx;
  border: 1rpx solid #e7ebf1;
  border-radius: 18rpx;
  background: #f9fafc;
}

.teacher-line {
  display: flex;
  align-items: baseline;
  margin-bottom: 12rpx;
}

.teacher-name {
  color: #1f2935;
  font-size: 26rpx;
}

.term-name {
  margin-left: 18rpx;
  color: #de3f4a;
  font-size: 20rpx;
}

.meta-grid {
  display: flex;
  flex-wrap: wrap;
  color: #667381;
  font-size: 20rpx;
}

.meta-grid text {
  width: 50%;
  margin-top: 8rpx;
}

.score-bar {
  display: flex;
  overflow: hidden;
  height: 18rpx;
  margin-top: 16rpx;
  border-radius: 4rpx;
  background: #eeeeee;
}

.score-segment {
  min-width: 0;
  color: #fff;
  font-size: 14rpx;
  line-height: 18rpx;
  text-align: center;
}

@media screen and (min-width: 600px) {
  .course-card {
    margin: 0 0 22px;
    border-radius: 18px;
  }

  .course-head {
    min-height: 70px;
    padding: 0 20px 0 16px;
  }

  .red-dot {
    width: 8px;
    height: 8px;
    margin-right: 16px;
  }

  .course-name {
    font-size: 17px;
  }

  .course-code {
    margin-left: 14px;
    font-size: 14px;
  }

  .fold-icon {
    margin-left: 18px;
    font-size: 24px;
  }

  .detail-area {
    margin: 0 14px 16px;
    padding-top: 14px;
  }

  .score-panel {
    margin: 0 0 14px;
    padding: 16px;
    border-radius: 14px;
  }

  .teacher-name {
    font-size: 17px;
  }

  .term-name {
    font-size: 13px;
  }

  .meta-grid {
    font-size: 13px;
  }
}
</style>
