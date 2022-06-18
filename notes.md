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
- 4-5 iphone兼容小问题**跳过**
- 4-6 下拉放大上滑模糊**跳过**
- **优化**：当点击任意歌手进入其歌手详情页后，在详情页进行刷新，会导致数据丢失，原因是详情页的数据是通过props由外部传入的，为了解决这个问题，在路由跳转的同时把数据传入sessionstorage，跳转后如果遇到刷新，就把数据从sessionstorage里取出来进行使用

---

## 6.14 ##
- 路由过渡动画：看v-router官方文档
  - ```css
       .v-enter-active,.v-leave-active {
          transition: opacity 0.5s ease;
        }
       .v-enter-from,.v-leave-to {
          opacity: 0;
        }
    ```
- 4-9 no-result**跳过**：components/base/no-result文件夹，assets/js/create-loading-like-directive.js文件
- vuex的使用?什么时候使用vuex?mapAction(vue 2), useStore(vue 3)
- knuth shuffle洗牌算法实现随机播放，比Math.random更随机
- player 组件使用computed的原因：自己配置响应式。与ref定义响应式数据区分
- fullScreen 是定义在 state 中的，本身就已经是响应式的了，在 Composition API 中就应该用计算属性获取它，这也是官方的文档推荐的方式
- l L 大小写查错一小时
- 当歌曲暂停时，切换到下一首要自动播放
- 当歌曲非主动停止播放时，记得更新状态
- **优化**：两个边界，歌曲列表为空直接return；歌曲列表只有一首歌点击上一首或下一首直接单曲循环
- 问题：audio在歌曲src被传入之前就开始执行play(),导致报错
  - 解决方案：使用原生canplay事件，判断是否ready

---

## 6.15 ##
- 基本播放逻辑直接写组件里，复杂业务逻辑利用组合式API钩子函数封装出去，使逻辑更加清晰
- 组件中修改vuex中数据：`$store.dispatch('action中的方法名',数据)` 或 `$store.commit('mutations中的方法名',数据)`,也是mapActions 和 mapMutations 的实质
- action的第一个配置项，可以用context也可以用{commit}；第二个配置项自己传
- **所有的PlayList的L都大写了**
- vuex中管理的数据，如果刷新浏览器会清空，所以有些数据要提前缓存至浏览器中
- **优化**：封装存到localstorage的save和remove函数，array-store.js

---

## 6.16 ##
- **优化**progress-bar.vue 文件中将touch对象定义在created中而不是data中的原因，我们仅仅想共享数据而不是要与模板互动发生响应式，如果盲目放入data会导致性能浪费
- @keyframes 语法: from to 
- JS 原生方法：通过getComputedStyle方法可以用来获取DOM元素实际显示时的样式
- **难点**：唱片旋转逻辑：通过动态绑定样式，播放的时候让cd这个盒子旋转。出现的问题是暂停之后再播放没有办法继续旋转，解决方案为让外层的盒子随着cd一起旋转，这样暂停的时候大家的旋转角度都一样，所有就不会回到原点了
- 利用css3 animation--play-state属性直接摆脱use-cd钩子函数
- use-lyrics line30 小小的节流
- 第三方插件将获取到的歌词字符串转化为数组，数组lines里放着每一行歌词，每一个lines都有txt属性，num属性
- display none 记得改回来
- canplay的ready() and getLyric 都是异步过程，不知道谁先触发为了保证playLyric一定会执行,在ready()里加palyLyric()
- 5-13 纯音乐**跳过**
- 5-15 方向锁**跳过**

---

## 6.17 ##
- 5-17 progress-circle组件**跳过**
- 5-19 miniplayer 中滑动切歌功能**跳过**
- 5-20，5-21 播放界面切换动画**跳过**
- playlist点击上方空白区域收回中的防冒泡处理很关键

---

## 6.18 ##
- click.stop灵活运用阻止冒泡
- 对state种书局修改只能通过mutations，不能直接修改，先用slice()获得数组副本，操作完用commit提交
- 5-25 removing 状态判断**跳过**
- 全屏类组件一般通过`<teleport to="body">`挂载在body，防止受到父组件影响
- 5-27 5-28**跳过**，wrap-scroll文件夹
- 两个组件一套皮，直接抽出去，函数引用模式调用组件
