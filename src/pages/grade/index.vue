<template>
  <view
    class="page"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="resetPullState"
  >
    <NavigationBar page-title="成绩管理"/>
    <PullRefreshIndicator
      :pull-distance="pullDistance"
      :threshold="pullRefreshThreshold"
      :is-refreshing="isLoading"
      :text="pullText"
    />
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
  import {usePullRefresh} from "@/composables/usePullRefresh";
  import PullRefreshIndicator from "@/pages/components/PullRefreshIndicator.vue";

  const gradeModel = GradeModel.getInstance();

  // 成绩信息
  const gradeInfo = ref<GradeInfo | null>(null);
  const expandedTerms = ref(new Set<string>());

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
    registerOnShow: true
  });
  const {
    pullDistance,
    pullRefreshThreshold,
    pullText,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    resetPullState
  } = usePullRefresh({
    isRefreshing: isLoading,
    onRefresh: updateGradeInfo
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

</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f7fb;
}

.content {
  padding: 208rpx 28rpx 54rpx;
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
