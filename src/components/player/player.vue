<template>
  <div class="player">
    <div
        class="normal-player"
        v-show="fullScreen"
      >
        <div class="background">
          <img :src="currentSong.pic">
        </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd">
          <div
            class="middle-l"
            :style="middleLStyle">
            <div
              class="cd-wrapper">
              <div
                class="cd">
                <img
                  :src="currentSong.pic"
                  class="image"
                  ref="cdImageRef">
              </div>
            </div>
          </div>
          <scroll
            class="middle-r"
            ref="lyricScrollRef"
            :style="middleRStyle">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                class="text"
                :class="{'current': currentLineNum === index}"
                v-for="(line,index) in currentLyric.lines"
                :key="line.num"
              >
                {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged">
              </progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="modeIcon"></i>
            </div>
            <div class="icon i-left" :class="disableClass">
              <i  @click="prev"  class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableClass">
              <i @click="togglePlay"  :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableClass" >
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
    </div>
    <audio
        ref="audioRef"
        @pause="pause"
        @canplay="ready"
        @error="error"
        @timeupdate="updateTime"
        @ended="end"
    >
    </audio>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import progressBar from './progress-bar.vue'
import { formatTime } from '@/assets/js/util'
import { PLAY_MODE } from '@/assets/js/constant'
import useLyric from './use-lyric'
import Scroll from '@/components/base/scroll/scroll.vue'
import useMiddleInteractive from './use-middle-interactive'

export default {
  name: 'player',
  components: {
      progressBar,
      Scroll
    },
    setup() {
      const songReady = ref(false)
      const audioRef = ref(null)
      const currentTime = ref(0)
      let progressChanging = false
      const cdImageRef = ref(null)
      // hook
      const { modeIcon, changeMode } = useMode()
      const { getFavoriteIcon, toggleFavorite } = useFavorite()
      const { currentLyric, currentLineNum, playLyric, lyricScrollRef, lyricListRef, stopLyric } = useLyric({ songReady, currentTime })
       const { currentShow, middleLStyle, middleRStyle, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd } = useMiddleInteractive()
      // vuex
      const store = useStore()
      const fullScreen = computed(() => store.state.fullScreen)
      const currentSong = computed(() => store.getters.currentSong)
      const playing = computed(() => store.state.playing)
      const currentIndex = computed(() => store.state.currentIndex)
      const playlist = computed(() => store.state.playlist)
      const playMode = computed(() => store.state.playMode)
      // computed
      const playIcon = computed(() => {
          return playing.value ? 'icon-pause' : 'icon-play'
      })
      const disableClass = computed(() => {
        return songReady.value ? '' : 'disable'
      })
      const progress = computed(() => {
        return currentTime.value / currentSong.value.duration
      })
      // 点击歌曲名或切歌时触发播放
      watch(currentSong, (newSong) => {
        if (!newSong.id || !newSong.url) {
          return
        }
        // 每次歌曲发生变化时songReady置为false,currentTime置为零
        currentTime.value = 0
        songReady.value = false
        const audioEl = audioRef.value
        audioEl.src = newSong.url
        audioEl.play() // play时自动触发@canplay，songReady置为true
    })
      // 点击播放键直接开始播放
      watch(playing, (newPlaying) => {
        if (!songReady.value) {
          return
        }
        if (newPlaying) {
          cdImageRef.value.style.animationPlayState = 'running'
        } else {
          cdImageRef.value.style.animationPlayState = 'paused'
        }
        const audioEl = audioRef.value
        if (newPlaying) {
          audioEl.play()
          playLyric()
        } else {
          audioEl.pause()
          stopLyric()
        }
      })
      // 回退
      function goBack() {
          store.commit('setFullScreen', false)
      }
      // 播放
      function togglePlay() {
        if (!songReady.value) {
          return
        }
        store.commit('setPlayingState', !playing.value)
      }
      // 停止（非主动）
      function pause() {
        store.commit('setPlayingState', false)
      }
      // 上一首
      function prev() {
        const list = playlist.value
        if (!songReady.value || !list.length) {
          return
        }
        if (list.length === 1) {
          loop()
        } else {
          let index = currentIndex.value - 1
        if (index === -1) {
          index = list.length - 1
        }
        store.commit('setCurrentIndex', index)
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
        }
      }
      // 下一首
      function next() {
        const list = playlist.value
        if (!songReady.value || !list.length) {
          return
        }
        if (list.length === 1) {
          loop()
        } else {
          let index = currentIndex.value + 1
          if (index === list.length) {
            index = 0
          }
          store.commit('setCurrentIndex', index)
          if (!playing.value) {
            store.commit('setPlayingState', true)
          }
        }
      }
      // 单曲循环
      function loop() {
        const audioEl = audioRef.value
        audioEl.currentTime = 0 // 原生属性
        audioEl.play()
        store.commit('setPlayingState', true)
      }
      // canplay时songPlay为true
      function ready() {
        if (songReady.value) {
          return
        }
        songReady.value = true
        playLyric()
      }
      // 处理边界，防止卡住时songReady永远为false，永远不能切歌
      function error() {
        songReady.value = true
      }
      // html原生事件timeupdate 实时更新currentTime
      function updateTime(e) {
        if (!progressChanging) {
          currentTime.value = e.target.currentTime
        }
      }
      // 进度条开始拖动
      function onProgressChanging(progress) {
        progressChanging = true // 标志位，防止updateTime()和本函数同时修改进度条，导致的撞车
        currentTime.value = currentSong.value.duration * progress
        playLyric() // 先定位再停止播放
        stopLyric()
      }
      // 进度条拖动结束
      function onProgressChanged(progress) {
        progressChanging = false
        // 拖动过程中歌曲还是正常播放的，拖动结束才真正改变歌曲播放的进度(audioRef)
        audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
        // 如果是暂停状态拖完进度条让其播放
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
        playLyric() // 同步歌词至当前位置
      }
      // 歌曲结束后根据播放模式切换到下一首歌
      function end() {
        currentTime.value = 0
        if (playMode.value === PLAY_MODE.loop) {
          loop()
        } else {
          next()
        }
      }
      return {
        fullScreen,
        currentSong,
        audioRef,
        goBack,
        playIcon,
        togglePlay,
        pause,
        prev,
        next,
        ready,
        disableClass,
        error,
        modeIcon,
        changeMode,
        getFavoriteIcon,
        toggleFavorite,
        progress,
        currentTime,
        updateTime,
        formatTime,
        onProgressChanging,
        onProgressChanged,
        end,
        cdImageRef,
        currentLyric,
        currentLineNum,
        playLyric,
        lyricScrollRef,
        lyricListRef,
        stopLyric,
        currentShow,
        middleLStyle,
        middleRStyle,
        onMiddleTouchStart,
        onMiddleTouchMove,
        onMiddleTouchEnd
      }
    }
}
</script>

<style lang="scss" scoped>
  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: $color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);

        img {
          width: 100%;
          height: 100%;
        }
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
        }
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            box-sizing: border-box;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, 0.1);
                animation: rotate 20s linear infinite;
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
            .pure-music {
              padding-top: 50%;
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-text-ll;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 40px;
            line-height: 30px;
            width: 40px;
            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
            i {
              font-size: 30px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          .i-right {
            text-align: left
          }
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all .6s;
        .top, .bottom {
          transition: all .6s cubic-bezier(0.45, 0, 0.55, 1);
        }
      }
      &.normal-enter-from, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -100px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0)
        }
      }
    }
  }
</style>
