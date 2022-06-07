<template>
  <my-header></my-header>
  <tab></tab>
  <router-view></router-view>
</template>

<script>
import MyHeader from '@/components/header/my-header'
import Tab from '@/components/tab/tab.vue'
export default {
  components:{
    MyHeader,
    Tab
  }
}

</script>

