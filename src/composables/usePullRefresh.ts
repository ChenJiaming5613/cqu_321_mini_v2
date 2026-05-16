import {computed, ref, type Ref} from "vue";

type BoolSource = boolean | Ref<boolean> | (() => boolean);

export function usePullRefresh(options: {
  onRefresh: () => Promise<unknown>
  isRefreshing?: BoolSource
  isDisabled?: BoolSource
  canStartPull?: () => boolean
  threshold?: number
  maxDistance?: number
}) {
  const pullStartY = ref<number | null>(null);
  const pullDistance = ref(0);
  const threshold = options.threshold ?? 80;
  const maxDistance = options.maxDistance ?? 120;

  const refreshing = computed(() => readBool(options.isRefreshing));
  const disabled = computed(() => readBool(options.isDisabled));
  const pullText = computed(() => {
    if (refreshing.value) return "刷新中";
    return pullDistance.value >= threshold ? "释放刷新" : "下拉刷新";
  });

  function onTouchStart(event: TouchEvent) {
    if (refreshing.value || disabled.value || !canStartPull()) return;
    pullStartY.value = event.touches[0]?.clientY ?? null;
  }

  function onTouchMove(event: TouchEvent) {
    if (pullStartY.value === null || refreshing.value || disabled.value) return;
    const currentY = event.touches[0]?.clientY ?? pullStartY.value;
    const distance = currentY - pullStartY.value;
    if (distance <= 0) {
      pullDistance.value = 0;
      return;
    }
    pullDistance.value = Math.min(Math.round(distance / 2), maxDistance);
  }

  async function onTouchEnd() {
    if (pullStartY.value === null) return;
    const shouldRefresh = pullDistance.value >= threshold;
    resetPullState();
    if (shouldRefresh && !refreshing.value && !disabled.value) await options.onRefresh();
  }

  function resetPullState() {
    pullStartY.value = null;
    pullDistance.value = 0;
  }

  function canStartPull() {
    return options.canStartPull?.() ?? true;
  }

  return {
    pullDistance,
    pullRefreshThreshold: threshold,
    pullText,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    resetPullState
  };
}

function readBool(source?: BoolSource) {
  if (typeof source === "function") return source();
  if (typeof source === "object" && source !== null && "value" in source) return source.value;
  return source ?? false;
}
