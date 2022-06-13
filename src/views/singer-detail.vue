<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
    ></music-list>
  </div>
</template>

<script>
  // import createDetailComponent from '@/assets/js/create-detail-component'
  import { getSingerDetail } from '@/service/singer'
  import { processSongs } from '@/service/song'
  import MusicList from '@/components/music-list/music-list.vue'
  import storage from 'good-storage'
  import { SINGER_KEY } from '@/assets/js/constant'

  // export default createDetailComponent('singer-detail', SINGER_KEY, getSingerDetail)
export default {
  name: 'singer-detail',
  components: { MusicList },
  props: {
    // 由router-view传入
    singer: Object
  },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    computedSinger() {
      let ret = null
      const singer = this.singer
      if (singer) {
        ret = singer
      } else {
        const cachedSinger = storage.session.get(SINGER_KEY)
        if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
          ret = cachedSinger
        }
      }
      return ret
    },
    pic() {
      const singer = this.computedSinger
      return singer && singer.pic
    },
    title() {
      const singer = this.computedSinger
      return singer && singer.name
    }
  },
  async created() {
    const result = await getSingerDetail(this.computedSinger)
    this.songs = await processSongs(result.songs)
  }
}
</script>

<style lang="scss" scoped>
  .singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
