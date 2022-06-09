<template>
  <div class="slider" ref="rootRef">
    <div class="slider-group">
      <div
        class="slider-page"
        v-for="item in sliders"
        :key="item.id"
      >
        <a :href="item.link">
          <img :src="item.pic"/>
        </a>
      </div>
    </div>
    <div class="dots-wrapper">
      <span
        class="dot"
        v-for="(item, index) in sliders"
        :key="item.id"
        :class="{'active': currentPageIndex === index}">
      </span>
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue'
  import useSlider from './use-slider'

  export default {
    name: 'slider',
    props: {
      sliders: {
        type: Array,
        default() {
          return []
        }
      }
    },
    setup() {
      const rootRef = ref(null)
      // rootRef是一个响应式的字符串，传入BS后，BS内部会自动找到对应的DOM对象，也就是.slider这个div元素
      // BetterScroll 提供了一个类，实例化的第一个参数是一个原生的 DOM 对象。
      // 当然，如果传递的是一个字符串，BetterScroll 内部会尝试调用 querySelector 去获取这个 DOM 对象。
      const { currentPageIndex } = useSlider(rootRef)
      // 不能直接穿入rootRef.value，在onMounted之后才能取到值，值是一个dom节点

      return {
        rootRef,
        currentPageIndex
      }
    }
  }
</script>

<style lang="scss" scoped>
  .slider {
    position: relative;
    min-height: 1px;
    font-size: 0;
    touch-action: pan-y;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        a {
          display: block;
          width: 100%;
        }
        img {
          display: block;
          width: 100%;
        }
      }
    }
    .dots-wrapper {
      position: absolute;
      left: 50%;
      bottom: 12px;
      line-height: 12px;
      transform: translateX(-50%);
      .dot {
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        transform: translateZ(1px);
        border-radius: 50%;
        background: $color-text-l;
        &.active {
          width: 20px;
          border-radius: 5px;
          background: $color-text-ll;
        }
      }
    }
  }
</style>
