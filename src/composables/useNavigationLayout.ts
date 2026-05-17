import {computed, onMounted, ref} from "vue";

type NavigationMetrics = {
  navHeight: number
  actionTop: number
  actionSize: number
  actionLeft: number
  actionRight: number
  titleTop: number
};

const DEFAULT_METRICS: NavigationMetrics = {
  navHeight: 90,
  actionTop: 46,
  actionSize: 35,
  actionLeft: 17,
  actionRight: 18,
  titleTop: 57
};

export function useNavigationLayout() {
  const metrics = ref<NavigationMetrics>(DEFAULT_METRICS);
  let shouldUseDynamicMetrics = false;

  // #ifndef H5
  shouldUseDynamicMetrics = true;
  // #endif

  onMounted(() => {
    if (!shouldUseDynamicMetrics) return;
    metrics.value = getDynamicNavigationMetrics();
  });

  const navStyle = computed(() => {
    if (!shouldUseDynamicMetrics) return {};
    const curr = metrics.value;
    return {
      "--nav-height": `${curr.navHeight}px`,
      "--nav-action-top": `${curr.actionTop}px`,
      "--nav-action-size": `${curr.actionSize}px`,
      "--nav-action-left": `${curr.actionLeft}px`,
      "--nav-action-right": `${curr.actionRight}px`,
      "--nav-title-top": `${curr.titleTop}px`
    };
  });

  return {
    navStyle
  };
}

function getDynamicNavigationMetrics(): NavigationMetrics {
  const windowInfo = uni.getSystemInfoSync();
  const statusBarHeight = windowInfo.statusBarHeight ?? 0;
  const fallbackActionSize = 35;
  let actionTop = statusBarHeight + 10;
  let actionSize = fallbackActionSize;
  let titleTop = actionTop + actionSize / 2;
  let navHeight = Math.max(DEFAULT_METRICS.navHeight, actionTop + actionSize + 18);
  let actionRight = DEFAULT_METRICS.actionRight;

  // #ifdef MP-WEIXIN
  const menuButton = uni.getMenuButtonBoundingClientRect();
  actionTop = menuButton.top;
  actionSize = menuButton.height;
  titleTop = menuButton.top + menuButton.height / 2;
  navHeight = Math.max(DEFAULT_METRICS.navHeight, menuButton.bottom + 14);
  actionRight = Math.max(DEFAULT_METRICS.actionRight, windowInfo.windowWidth - menuButton.left + 8);
  // #endif

  return {
    navHeight,
    actionTop,
    actionSize,
    actionLeft: DEFAULT_METRICS.actionLeft,
    actionRight,
    titleTop
  };
}
