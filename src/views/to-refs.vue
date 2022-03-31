<template>
  <div class="demo">
    <h3>state 方式 不推荐的方式绑定</h3>
    <div>姓名--state.name：{{state.name}}</div>
    <div>年龄--state.age：{{state.age}}</div>
  </div>
  <div class="demo">
    <h3>toRefs之后的 方式 推荐这种方式，return需要{...toRefs(state)}</h3>
    <div>姓名--name：{{name}}</div>
    <div>年龄--age：{{age}}</div>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
export default {
  name: 'reactivedemo',
  setup () {
    // 响应式对象
    const state = reactive({
      name: '太凉',
      age: 18
    })

    // 通过toRefs创建一个响应式对象属性的Ref
    const toRefsValue = toRefs(state)

    // 过3秒后改变  两者保持引用关系
    setTimeout(() => {
      state.name = '冰箱太凉'
      state.age = '30'
    }, 3000)

    // 过6秒后改变 两者保持引用关系
    setTimeout(() => {
      toRefsValue.name.value = '我就是宇宙小超人'
      toRefsValue.age.value = '101'
    }, 6000)

    return {
      // 不建议使用这种方式，可以用下面的方式直接替换
      state,
      // 最佳方式：这里是结构 将 name的ref，age的ref结构到对象根下面
      ...toRefsValue
    }
  }
}
</script>

<style scoped>
.demo {
  text-align: left;
  width: 600px;
  margin: 20px auto;
}
</style>
