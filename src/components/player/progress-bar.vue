<template>
  <div
    class="progress-bar"
    @click="onClick"
  >
    <div class="bar-inner">
      <div
        class="progress"
        ref="progress"
        :style="progressStyle"
      ></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  const progressBtnWidth = 16

  export default {
    name: 'progress-bar',
    emits: ['progress-changing', 'progress-changed'],
    props: {
      progress: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        offset: 0
      }
    },
    computed: {
      progressStyle() {
        return `width:${this.offset}px`
      },
      btnStyle() {
        return `transform:translate3d(${this.offset}px,0,0)`
      }
    },
    watch: {
      progress(newProgress) {
        this.setOffset(newProgress)
      }
    },
  created() {
      // touch定义在created()中的原因见笔记
      this.touch = {}
    },
    methods: {
      onTouchStart(e) {
        // 手触摸位置的x坐标
        this.touch.x1 = e.touches[0].pageX
        // 黄色进度条初始宽度
        this.touch.beginWidth = this.$refs.progress.clientWidth
      },
      onTouchMove(e) {
        // 手指移动的距离
        const delta = e.touches[0].pageX - this.touch.x1
        // 手指移动后进度条的宽度
        const tempWidth = this.touch.beginWidth + delta
        // 整个进度条的宽度
        const barWidth = this.$el.clientWidth - progressBtnWidth
        const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
        this.offset = barWidth * progress
        this.$emit('progress-changing', progress)
      },
      onTouchEnd() {
        const barWidth = this.$el.clientWidth - progressBtnWidth
        const progress = this.$refs.progress.clientWidth / barWidth
        this.$emit('progress-changed', progress)
      },
      onClick(e) {
        // 进度条左侧位置
        const rect = this.$el.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        const barWidth = this.$el.clientWidth - progressBtnWidth
        const progress = offsetWidth / barWidth
        this.$emit('progress-changed', progress)
      },
      setOffset(progress) {
        const barWidth = this.$el.clientWidth - progressBtnWidth
        this.offset = barWidth * progress
      }
    }
  }
</script>

<style lang="scss" scoped>
  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
