<template>
  <SegmentedTabs
    :value="tabCur"
    :items="tabItems"
    @update:value="value => emit('onTapTab', Number(value))"
  />
</template>

<script setup lang="ts">
  import SegmentedTabs, {type SegmentedTabItem} from "@/pages/components/SegmentedTabs.vue";

  defineProps<{ tabCur: number }>();
  const emit = defineEmits<{ (e: 'onTapTab', idx: number): void }>();

  const tabItems: SegmentedTabItem[] = [
    {label: '未结束', value: 0},
    {label: '已结束', value: 1}
  ];
</script>
