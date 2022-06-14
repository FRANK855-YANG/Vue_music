<template>
  <div class="singer">
    <IndexList
    :data="singers"
    @select="selectSinger">
    </IndexList>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/base/index-list/index-list.vue'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'singer',
  components: {
    IndexList
  },
  data() {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  methods: {
    selectSinger(singer) {
      this.selectedSinger = singer
      this.catchSinger(singer)
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    },
    catchSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }
  },
  async created() {
      const result = await getSingerList()
      this.singers = result.singers
    }
}
</script>

<style lang="scss" scoped>
  .singer {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
</style>
