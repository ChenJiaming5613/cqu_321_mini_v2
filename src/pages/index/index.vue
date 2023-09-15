<template>
  <Home v-if="curr==='home'"/>
  <Settings v-else-if="curr==='settings'"/>
  <BottomBar :curr="curr" @click="newCurr => { curr = newCurr }" />
</template>

<script setup lang="ts">

import Home from "@/pages/home/Home.vue";
import Settings from "@/pages/settings/Settings.vue";
import {ref} from "vue";
import BottomBar from "@/pages/index/BottomBar.vue";
const curr = ref<"home" | "settings">("home");

</script>