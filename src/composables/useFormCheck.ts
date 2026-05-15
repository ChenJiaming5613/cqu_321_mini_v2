import {ref} from "vue";

export function useFormCheck(validate: () => boolean) {
  const isCheck = ref(false);

  function checkPass() {
    isCheck.value = true;
    return validate();
  }

  return {
    isCheck,
    checkPass
  };
}
