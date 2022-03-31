<template>
  <div class="demo">
    <div>姓名：{{state.name}}</div>
    <div v-if="state.age>0">年龄：{{state.age}}</div>
    <div>地址：{{state.address.provoince}} - {{state.address.city}} - {{state.address.street}}</div>
  </div>

  <div class="demo">
    <div>爱好：{{state.hobby.join('----')}}</div>
    <div>学校：{{state.school||'自学成才'}}</div>

  </div>
</template>

<script>
import { reactive } from 'vue'
export default {
  name: 'reactivedemo',
  setup () {
    // 响应式对象
    const state = reactive({
      name: '太凉',
      age: 18,
      hobby: ['游泳', '爬山'],
      address: {
        provoince: '北京',
        city: '北京',
        street: '东城区长安街'
      }
    })

    // 过3秒后改变
    setTimeout(() => {
      // update1:改变name属性
      state.name = '冰箱太凉'

      // update2:深度改变 address属性
      state.address.provoince = '山东省' // 年龄改为30
      state.address.city = '临沂市'

      // update3：新增 school属性
      state.school = '清华北大'

      // update4：删除 年龄属性
      delete state.age

      // update5：数组 添加一项
      state.hobby.push('打豆豆')
    }, 3000)

    return {
      state
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
