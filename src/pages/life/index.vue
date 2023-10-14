<template>
  <NavigationBar pageTitle="生活"/>
  <view>
    <LifeCard life-card-type="一卡通" :info="info" :balance-list="yktList"/>
    <LifeCard life-card-type="水电费" info="兰园一栋 614" :balance-list="sdfList"/>
  </view>
</template>

<script setup lang="ts">
  import NavigationBar from "@/pages/components/NavigationBar.vue";
  import LifeCard from "@/pages/life/LifeCard.vue";
  import {ref} from "vue";
  import stdUser from "@/core/StdUser";
  import {onShow} from "@dcloudio/uni-app";
  const yktList = ref([
    {
      title: "一卡通余额",
      amount: 96.86
    }
  ]);
  const sdfList = ref([
    {
      title: "水电费",
      amount: 96.86
    },
    {
      title: "水电费",
      amount: 96.86
    },
    {
      title: "水电费",
      amount: 96.86
    }
  ]);
  const info = ref<string>("");

  onShow(async () => {
    const userInfo = await stdUser.getUserInfo();
    info.value = `${userInfo?.name} ${userInfo?.sid}`;
  });

</script>

<style scoped>

</style>