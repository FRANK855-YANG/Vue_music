<template>
  <my-header></my-header>
  <tab></tab>
  <router-view></router-view>
  <player></player>
</template>

<script>
import MyHeader from '@/components/header/my-header'
import Tab from '@/components/tab/tab.vue'
import Player from '@/components/player/player.vue'
export default {
  components: {
    MyHeader,
    Tab,
    Player
  }
}

</script>
