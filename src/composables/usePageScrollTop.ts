import {computed, ref} from "vue";
import {onPageScroll} from "@dcloudio/uni-app";

export function usePageScrollTop() {
  const scrollTop = ref(0);

  onPageScroll((event: { scrollTop: number }) => {
    scrollTop.value = Math.max(0, event.scrollTop);
  });

  const isAtTop = computed(() => scrollTop.value <= 0);

  return {
    scrollTop,
    isAtTop
  };
}
