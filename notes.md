## 6.8(拿到源码) ##
- @代表src根目录
- import，export，export default的区别；变量名是否需要一致的问题
- **单文件组件中(.vue文件)组件注册和使用时的命名问题**：
- 注册时：大驼峰 使用时：大驼峰或连字符
- 注册时：连字符 使用时：只能连字符
- router配置里的component不加s
- height：容器高度；line-height：文字行高；font-size：文字大小
- APP大哥不用写name
- routes 里的path是自己设置的逻辑路径，并不是文件相对路径
- 怎么解决跨域的：构建服务器端，服务器和服务器间没有跨域限制

---

## 6.9 ##
- 不要无脑使用option API或者composition API，要根据场景的具体需求来定;option API更直观，结构更清晰；composition API 适合逻辑较复杂时使用
- 如下：
```javascript
function gett() {
let a = 1, b = 2
return {
  a,
  b
}
}
const { a } = gett()
console.log(a)// 1
```
- BetterScroll 提供了一个类，实例化的第一个参数是一个原生的 DOM 对象。当然，如果传递的是一个字符串，BetterScroll 内部会尝试调用 querySelector 去获取这个 DOM 对象。
- 使用BS代替浏览器默认滚动，实现滚动回弹

---

## 6.10 ##
- **亮点**：BS的slider插件实现轮播图，插件的原理？自己实现怎么做？
- **优化**：图片懒加载的原理，vue3_lazy插件的原理？自己实现怎么做？
- 自定义指令v-loding**跳过**：assets/js/create-loading-like-directive.js,dom.js,components/base/loding文件夹
- **推荐页面接收的数据**：
  - sliders：id,pic(轮播图),link(轮播图跳转)  
  - albums: id,pic(推荐歌单图),username(歌单名),title(歌单描述)
- **难点**：固定歌手列表标题,总体思路为看滚动的y值落在哪个区间
- 什么时候使用nextTick:当改变数据后，要基于更新后的新DOM进行某些操作时

---

## 6.11 ##
- 什么时候用async await?
- vue 3 中emit自定义事件的用法
- watch监听函数返回：尚硅谷笔记；网课评论
- use-fixed.js 里fixedStyle功能**跳过**:实现固定标题切换“顶走”的效果
- use-shortcut 里右侧导航栏滑动功能**跳过**
- @scroll emit自定义事件，传的参数丢给onScroll函数
- touchStart原生HTML事件，传一个touch对象给onShortcutTouchStart函数，touch对象身上有一个属性target，代表当前触摸的dom节点
- data-index:HTML5 新特性

---

## 6.13 ##
- RouterView 本身就是一个 Vue 组件，Vue 组件当然可以传 Props。另外从 RouterView 的源码实现来看，它也会把接收到的 props **传递给真实渲染的路由视图组件**
- 路由跳转的两种方式：使用<router-link></router-link>,或使用this.$router.push
- **歌手页面接收的数据**(index-list.vue)：
  - singers里的每个group：group.list(一个一个的组),group.title(热,A,B,C...)
  - group.list里的每个item：item.id,item.mid,item.name(歌手名),item.pic(歌手头像)
  - 歌手页面中点击歌手跳转至新的歌手详情页面全过程：
    1. 点击任意歌手，也就是点击index-list里的某个item，触发onItemClick函数
    2. onItemClick函数把item作为参数传给自定义方法select
    3. select方法被配置在singer.vue的IndexList标签上，触发selectSinger方法，同时激发路由跳转
    4. selectSinger方法把item传给二级路由视图，也就是singer-detail.vue
    5. 在singer-detail.vue把item传给后端传来的方法getSingerDetail，从而得到歌手的歌曲信息songs
- 从获取歌曲url开始，就要挂VPN跑程序了
- 源代码没有在.bg-image {}这样式里头添加上padding-top:70%;height:0