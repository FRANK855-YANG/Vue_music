<template>
  <transition name="mini">
    <div
      class="mini-player"
      v-show="!fullScreen"
      @click="showNormalPlayer"
    >
      <div class="cd-wrapper">
        <div
          class="cd"
        >
          <img
            width="40"
            height="40"
            :src="currentSong.pic"
            ref="minicdImageRef"
          >
        </div>
      </div>
      <div class="name-wrapper">
        <h2 class="name">{{currentSong.name}}</h2>
        <p class="desc">{{currentSong.singer}}</p>
      </div>
      <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist"></i>
          <i
            class="icon-mini"
            :class="miniPlayIcon"
            @click.stop="togglePlay"
          ></i>
      </div>
      <playlist ref="playlistRef"></playlist>
    </div>
  </transition>
</template>

<script>
  import { useStore } from 'vuex'
  import { computed, ref, watch } from 'vue'
  import Playlist from './playlist'

  export default {
    name: 'mini-player',
    components: {
      Playlist
    },
    props: {
      togglePlay: Function
    },
    setup() {
      const playlistRef = ref(null)
      const minicdImageRef = ref(null)

      const store = useStore()
      const fullScreen = computed(() => store.state.fullScreen)
      const currentSong = computed(() => store.getters.currentSong)
      const playing = computed(() => store.state.playing)
      const playlist = computed(() => store.state.playlist)

      const miniPlayIcon = computed(() => {
        return playing.value ? 'icon-pause-mini' : 'icon-play-mini'
      })

      watch(playing, (newPlaying) => {
        if (newPlaying) {
          minicdImageRef.value.style.animationPlayState = 'running'
        } else {
          minicdImageRef.value.style.animationPlayState = 'paused'
        }
      })
      function showNormalPlayer() {
        store.commit('setFullScreen', true)
      }

      function showPlaylist() {
        playlistRef.value.show()
      }

      return {
        playlistRef,
        fullScreen,
        currentSong,
        playlist,
        miniPlayIcon,
        showNormalPlayer,
        showPlaylist,
        minicdImageRef
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;
    .cd-wrapper {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;
      .cd {
        height: 100%;
        width: 100%;
        img {
          border-radius: 50%;
          animation: rotate 10s linear infinite;
        }
      }
    }
    .name-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        margin-bottom: 2px;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text;
      }
      .desc {
        @include no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
    .control {
      display: flex;
      flex-direction: row-reverse;
      flex: 0 0 170px;
      width: 30px;
      padding: 0 10px;
      .icon-playlist {
        position: relative;
        right: 5px;
        font-size: 28px;
        color: $color-theme;
      }
      .icon-mini {
        position: relative;
        right: 20px;
        color: $color-theme;
        font-size: 32px;
      }
    }
    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
    }
    &.mini-enter-from, &.mini-leave-to {
      opacity: 0;
      transform: translate3d(0, 100%, 0)
    }
  }
</style>
