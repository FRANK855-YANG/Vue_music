<template>
  <div class="tab">
      <routerLink class="tab-item"
       v-for="tab in tabs"
       :key = "tab.path"
       :to = "tab.path">

       <span class="class-link">
           {{tab.name}}
       </span>

      </routerLink>
  </div>
</template>

<script>
export default {
    name: 'tab',
    data() {
        return {
            tabs: [
                {
                    name: '推荐',
                    path:'/recommend'
                },
                {
                    name: '歌手',
                    path:'/singer'
                },
                {
                    name: '排行',
                    path:'/top-list'
                },
                {
                    name: '搜索',
                    path:'/search'
                }
                
            ]
        }
    }

}
</script>

<style>

</style>