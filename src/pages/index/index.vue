<template>
  <Home v-if="curr===IndexMode.Home"/>
  <Settings v-else-if="curr===IndexMode.Settings"/>
  <BottomBar :curr="curr" @click="newCurr => { curr = newCurr }" />
</template>

<script setup lang="ts">

import Home from "@/pages/index/_home/Home.vue";
import Settings from "@/pages/index/_settings/Settings.vue";
import {ref} from "vue";
import BottomBar from "@/pages/index/BottomBar.vue";
import {IndexMode} from "@/pages/index/util";

const curr = ref<IndexMode>(IndexMode.Home);

</script>