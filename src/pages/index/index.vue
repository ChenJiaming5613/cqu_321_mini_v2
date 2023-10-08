<template>
  <Home :activity-items="activityItems" v-if="curr===IndexMode.Home"/>
  <Settings v-else-if="curr===IndexMode.Settings"/>
  <BottomBar :curr="curr" @click="newCurr => { curr = newCurr }" />
</template>

<script setup lang="ts">

import Home from "@/pages/index/_home/Home.vue";
import Settings from "@/pages/index/_settings/Settings.vue";
import {computed, ref} from "vue";
import BottomBar from "@/pages/index/BottomBar.vue";
import {IndexMode} from "@/pages/index/util";
import ActivityModel, {ActivityInfo, ActivityItem} from "@/models/ActivityModel";
import {onShow} from "@dcloudio/uni-app";

const curr = ref<IndexMode>(IndexMode.Home);

const activityModel = ActivityModel.getInstance();
const activityInfo = ref<ActivityInfo | null>(null);
const activityItems = computed<ActivityItem[]>(() => activityInfo.value?.pictures || []);
onShow(async () => { activityInfo.value = await activityModel.get() });

</script>