## 6.8 ##
- @代表src根目录
- import，export，export default的区别；变量名是否需要一致的问题
- 组件注册和使用时的命名问题
- router配置里的component不加s
- height：容器高度；line-height：文字行高；font-size：文字大小
- APP大哥不用写name
- routes 里的path是自己设置的逻辑路径，并不是文件相对路径
---
## 6.9 ##
- 不要无脑使用option API或者composition API，要根据场景的具体需求来定;option API更直观，结构更清晰；composition API 适合逻辑较复杂时使用
- 如下：
- ```javascript
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