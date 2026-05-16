<template>
  <view class="form-item-row">
    <view class="title"><text class="required-star">* </text>{{title}}</view>
    <picker
        class="content"
        :class="isFocus ? 'active' : ''"
        :range="options"
        :value="idx"
        @change="onChange"
        @click="isFocus = true"
        @cancel="isFocus = false"
    >{{options[idx]}}</picker>
  </view>
</template>

<script setup lang="ts">
  import {ref} from "vue";
  defineProps<{
    title: string
    options: string[]
    idx: number
  }>();
  const emit = defineEmits<{ (e: 'update:idx', newValue: number): void }>();
  const isFocus = ref(false);
  function onChange(event: Event) {
    const e = event as unknown as { detail: { value: number } };
    isFocus.value = false;
    emit('update:idx', e.detail.value);
  }
</script>

<style scoped>
</style>