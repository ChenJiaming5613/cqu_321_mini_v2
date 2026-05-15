<template>
  <Form>
    <TextInput title="课程名称" v-model:value="course.name" is-required :check="isCheck"/>
    <TextInput title="上课教室" v-model:value="course.content"/>
    <DayTimeInput v-model:day-time="course.dayTime"/>
    <ComplexSelector
        title="上课周数"
        :display-text="weeksText"
        :options="range(1, 31).map(it => it.toString())"
        v-model:idx-list="course.weeks"
    />
    <FormButton @click="onTapSave">新增课程</FormButton>
  </Form>
</template>
<script setup lang="ts">
  import Form from "@/pages/components/form/Form.vue";
  import {computed, ref} from "vue";
  import TextInput from "@/pages/components/form/TextInput.vue";
  import FormButton from "@/pages/components/form/FormButton.vue";
  import DayTimeInput from "@/pages/curriculum/edit/DayTimeInput.vue";
  import ComplexSelector from "@/pages/components/form/ComplexSelector.vue";
  import {range} from "@/utils/util";
  import {getWeeksText} from "@/utils/course";
  import type {CustomCourse} from "@/models/CustomCourseModel";
  import {useFormCheck} from "@/composables/useFormCheck";

  const props = defineProps<{ oldCustomCourse?: CustomCourse }>();
  const emit = defineEmits<{ (e: 'submit', customCourse: CustomCourse): void }>();
  const course = ref<CustomCourse>({
    name: props.oldCustomCourse?.name || "",
    code: props.oldCustomCourse?.code || "",
    content: props.oldCustomCourse?.content || "",
    dayTime: {
      weekday: props.oldCustomCourse?.dayTime.weekday || 0,
      period: {
        start: props.oldCustomCourse?.dayTime.period.start || 1,
        end: props.oldCustomCourse?.dayTime.period.end || 1
      }
    },
    weeks: [...(props.oldCustomCourse?.weeks || []).map(it => it - 1)]
  });
  const {isCheck, checkPass} = useFormCheck(() => {
    const {period} = course.value.dayTime;
    return course.value.name.length > 0
      && course.value.weeks.length > 0
      && period.start >= 1
      && period.end >= period.start;
  });
  const weeksText = computed(() => getWeeksText(course.value.weeks.map(it => it + 1)));

  function onTapSave() {
    if (!checkPass()) {
      uni.showToast({ title: "请补全课程信息", icon: "none" });
      return;
    }
    emit('submit', {
      ...course.value,
      code: course.value.name,
      weeks: course.value.weeks.map(it => it + 1)
    });
  }
</script>
