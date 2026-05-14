<template>
  <SegmentedTabs
    :value="searchType"
    :items="tabItems"
    scrollable
    @update:value="value => emit('click', value as SearchType)"
  />
</template>

<script setup lang="ts">
  import SegmentedTabs, {type SegmentedTabItem} from "@/pages/components/SegmentedTabs.vue";
  import {SearchType} from "@/models/CourseInfoModel";

  defineProps<{ searchType: SearchType }>();
  const emit = defineEmits<{ (e: 'click', newSearchType: SearchType): void }>();

  const tabItems: SegmentedTabItem[] = [
    {label: '搜课程', value: SearchType.CourseName},
    {label: '搜老师', value: SearchType.TeacherName}
  ];
</script>
