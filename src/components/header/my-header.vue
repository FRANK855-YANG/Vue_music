<template>
  <div class="header">
    <h1 class="text">VUE MUSIC</h1>
  </div>
</template>

<script>
export default {
  name: 'MyHeader'
}
</script>

<style lang="scss" scoped>
.header {
  height: 44px;
  text-align: center;
  color: $color-theme;
  font-size: 0;

  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: $font-size-large;
  }
}
</style>
