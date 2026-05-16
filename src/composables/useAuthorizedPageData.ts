import {computed, ref} from "vue";
import {onShow} from "@dcloudio/uni-app";
import stdUser from "@/core/StdUser";

export type PageDataState = "loading" | "unauthorized" | "empty" | "error" | "ready";

export function useAuthorizedPageData(options: {
  hasReadyData: () => boolean
  hasInitialData?: () => boolean
  loadData: () => Promise<void>
  refreshData?: () => Promise<boolean | void>
  clearData?: () => void
  logTag?: string
  successMessage?: string
  registerOnShow?: boolean
}) {
  const hasUserInfo = ref(false);
  const hasCheckedUserInfo = ref(false);
  const hasLoadError = ref(false);
  const isLoading = ref(false);

  const pageState = computed<PageDataState>(() => {
    const hasInitialData = options.hasInitialData?.() ?? options.hasReadyData();
    if (!hasCheckedUserInfo.value) return "loading";
    if (isLoading.value && !hasInitialData) return "loading";
    if (!hasUserInfo.value) return "unauthorized";
    if (hasLoadError.value && !hasInitialData) return "error";
    if (!options.hasReadyData()) return "empty";
    return "ready";
  });

  async function checkUserInfo() {
    hasUserInfo.value = await stdUser.getUserInfo(false) !== null;
    hasCheckedUserInfo.value = true;
    if (!hasUserInfo.value) options.clearData?.();
    return hasUserInfo.value;
  }

  async function loadPageData() {
    isLoading.value = true;
    try {
      hasLoadError.value = false;
      if (!await checkUserInfo()) return;
      await options.loadData();
    } catch (e: unknown) {
      console.error(`[${options.logTag || "AuthorizedPage"}] load failed`, e);
      options.clearData?.();
      hasLoadError.value = true;
    } finally {
      isLoading.value = false;
    }
  }

  async function refreshPageData() {
    if (isLoading.value) return false;
    if (!await checkUserInfo()) return false;
    isLoading.value = true;
    try {
      hasLoadError.value = false;
      const isUpdated = await options.refreshData?.();
      if (isUpdated === false) {
        hasLoadError.value = true;
        await uni.showToast({ title: "更新失败", icon: "error" });
        return false;
      }
      await options.loadData();
      if (options.successMessage) {
        await uni.showToast({ title: options.successMessage, icon: "success" });
      }
      return true;
    } catch (e: unknown) {
      console.error(`[${options.logTag || "AuthorizedPage"}] refresh failed`, e);
      hasLoadError.value = true;
      await uni.showToast({ title: "更新失败", icon: "error" });
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  if (options.registerOnShow) {
    onShow(loadPageData);
  }

  return {
    hasUserInfo,
    hasLoadError,
    isLoading,
    pageState,
    loadPageData,
    refreshPageData
  };
}
