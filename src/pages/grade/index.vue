<template>
  <view
    class="page"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="resetPullState"
  >
    <NavigationBar page-title="成绩管理"/>
    <view
      v-if="pullDistance > 0 || isLoading"
      class="pull-indicator"
      :style="{transform: `translateY(${Math.min(pullDistance, 80)}rpx)`}"
    >
      {{isLoading ? '刷新中' : pullDistance >= pullRefreshThreshold ? '释放刷新' : '下拉刷新'}}
    </view>
    <view v-if="pageState === 'ready'" class="content">
      <Overview
        v-if="gpaInfo !== null"
        :gpa-info="gpaInfo"
        :is-loading="isLoading"
        @update="updateGradeInfo"
      />
      <view class="terms">
        <TermOverview
          v-for="term in termGroups"
          :key="term.name"
          :term-name="term.name"
          :credit="term.credit"
          :term-avg-gpa="term.gpa"
          :is-expand="expandedTerms.has(term.name)"
          @toggle="toggleTerm(term.name)"
        >
          <GradeItem
            v-for="(item, index) in term.items"
            :key="`${item.moreInfo.code}-${index}`"
            :score-item="item"
            :show-new="index === 0"
          />
        </TermOverview>
      </view>
    </view>
    <view v-else class="state-wrap">
      <PageState
        :state="pageState"
        empty-message="暂无成绩"
        empty-hint="当前账号暂时没有可展示的成绩数据"
        error-message="成绩加载失败"
        @retry="loadGradeInfo"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
  import GradeModel, {GpaType, type GradeInfo, type ScoreItem} from "@/models/GradeModel";
  import {computed, ref} from "vue";
  import {
    convertToTermName,
    filterCourseWhenCalcGpa,
    scoreToNumber,
    scoreToPoint
  } from "@/pages/grade/util";
  import Overview from "@/pages/grade/Overview.vue";
  import TermOverview from "@/pages/grade/TermOverview.vue";
  import GradeItem from "@/pages/grade/GradeItem.vue";
  import PageState from "@/pages/components/PageState.vue";
  import NavigationBar from "@/pages/components/NavigationBar.vue";
  import {useAuthorizedPageData} from "@/composables/useAuthorizedPageData";

  const gradeModel = GradeModel.getInstance();

  // 成绩信息
  const gradeInfo = ref<GradeInfo | null>(null);
  const expandedTerms = ref(new Set<string>());
  const pullStartY = ref<number | null>(null);
  const pullDistance = ref(0);
  const pullRefreshThreshold = 80;

  const hasGradeData = computed(() => {
    return gpaInfo.value !== null || (gradeInfo.value?.scoreItems.length ?? 0) > 0;
  });

  const {
    isLoading,
    pageState,
    loadPageData: loadGradeInfo,
    refreshPageData: updateGradeInfo
  } = useAuthorizedPageData({
    hasReadyData: () => hasGradeData.value,
    hasInitialData: () => gradeInfo.value !== null,
    loadData: async () => {
      gradeInfo.value = await gradeModel.get();
      if (gradeInfo.value === null) {
        await gradeModel.update();
        gradeInfo.value = await gradeModel.get();
      }
      expandFirstTerm();
    },
    refreshData: async () => {
      await gradeModel.update();
    },
    clearData: () => {
      gradeInfo.value = null;
    },
    logTag: "GradePage",
    successMessage: "更新完成",
    registerOnShow: true,
    registerPullDownRefresh: true
  });
  const termGroups = computed(() => {
    const termMap = new Map<string, ScoreItem[]>();
    gradeInfo.value?.scoreItems.forEach(item => {
      const name = convertToTermName(item.session);
      const items = termMap.get(name) ?? [];
      items.push(item);
      termMap.set(name, items);
    });
    return Array.from(termMap.entries())
      .sort((a, b) => termSortValue(b[0]) - termSortValue(a[0]))
      .map(([name, items]) => {
        const sortedItems = [...items].reverse();
        return {
          name,
          items: sortedItems,
          credit: calcCredit(sortedItems),
          gpa: calcTermGpa(sortedItems)
        };
      });
  });
  // 总览信息
  const gpaInfo = computed(() => gradeInfo.value?.gpaInfo || null);

  function calcTermGpa(scoreItems: ScoreItem[]): {four: number, five: number} {
    let allCredit = 0;
    let avgGpa = {four: 0, five: 0};
    const candidates = scoreItems.filter(filterCourseWhenCalcGpa);
    const calcItems = candidates.length > 0
      ? candidates
      : scoreItems.filter(it => it.credit > 0 && scoreToNumber(it.score) >= 0);
    calcItems.forEach(it => {
        allCredit += it.credit;
        avgGpa.four += it.credit * scoreToPoint(scoreToNumber(it.score), GpaType.FOUR);
        avgGpa.five += it.credit * scoreToPoint(scoreToNumber(it.score), GpaType.FIVE);
      });
    if (allCredit === 0) return avgGpa;
    avgGpa.four = Number((avgGpa.four / allCredit).toFixed(4));
    avgGpa.five = Number((avgGpa.five / allCredit).toFixed(4));
    return avgGpa;
  }

  function calcCredit(scoreItems: ScoreItem[]) {
    return scoreItems
      .filter(it => it.credit > 0)
      .reduce((sum, item) => sum + item.credit, 0);
  }

  function termSortValue(termName: string) {
    const year = Number(termName.slice(0, 4));
    return year * 2 + (termName.endsWith('秋') ? 1 : 0);
  }

  function toggleTerm(termName: string) {
    const next = new Set(expandedTerms.value);
    if (next.has(termName)) next.delete(termName);
    else next.add(termName);
    expandedTerms.value = next;
  }

  function expandFirstTerm() {
    if (expandedTerms.value.size > 0 || termGroups.value.length === 0) return;
    expandedTerms.value = new Set([termGroups.value[0].name]);
  }

  function onTouchStart(event: TouchEvent) {
    if (isLoading.value || getScrollTop() > 0) return;
    pullStartY.value = event.touches[0]?.clientY ?? null;
  }

  function onTouchMove(event: TouchEvent) {
    if (pullStartY.value === null || isLoading.value) return;
    const currentY = event.touches[0]?.clientY ?? pullStartY.value;
    const distance = currentY - pullStartY.value;
    if (distance <= 0) {
      pullDistance.value = 0;
      return;
    }
    pullDistance.value = Math.min(Math.round(distance / 2), 120);
  }

  async function onTouchEnd() {
    if (pullStartY.value === null) return;
    const shouldRefresh = pullDistance.value >= pullRefreshThreshold;
    resetPullState();
    if (shouldRefresh) await updateGradeInfo();
  }

  function resetPullState() {
    pullStartY.value = null;
    pullDistance.value = 0;
  }

  function getScrollTop() {
    // H5 预览使用 window 滚动；小程序端不存在 window 时回落为 0。
    if (typeof window === "undefined") return 0;
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f7fb;
}

.content {
  padding: 208rpx 28rpx 54rpx;
}

.pull-indicator {
  position: fixed;
  top: 180rpx;
  left: 0;
  right: 0;
  height: 48rpx;
  line-height: 48rpx;
  color: #de3f4a;
  font-size: 24rpx;
  text-align: center;
  z-index: 99;
  pointer-events: none;
  transition: transform 0.16s ease;
}

.terms {
  margin-top: 28rpx;
}

.state-wrap {
  padding-top: 180rpx;
}

@media screen and (min-width: 600px) {
  .content {
    max-width: 920px;
    margin: 0 auto;
    padding: 180px 28px 64px;
    box-sizing: border-box;
  }

  .terms {
    margin-top: 24px;
  }

  .state-wrap {
    max-width: 720px;
    margin: 0 auto;
    padding-top: 154px;
  }
}

@media screen and (min-width: 900px) {
  .content {
    max-width: 980px;
    padding-top: 112px;
  }

  .state-wrap {
    padding-top: 90px;
  }
}
</style>
