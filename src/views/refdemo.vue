<template>
  <div>
    <div>countRef:{{countRef}}</div>
    <div>objCountRef:{{objCountRef.count}}</div>
    <div>爱好：{{hobbyRef.join('---')}}</div>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'refdemo',
  setup () {
    // 值类型
    const countRef = ref(1)
    console.log(countRef)

    // 对象
    const objCountRef = ref({ count: 1 })
    console.log(objCountRef)

    // 数组
    const hobbyRef = ref(['爬山', '游泳'])
    console.log(hobbyRef)

    setTimeout(() => {
      // 通过value改变值
      countRef.value = 2
      objCountRef.value.count = 3
      hobbyRef.value.push('吃饭')
    }, 4000)

    return {
      countRef,
      objCountRef,
      hobbyRef
    }
  }
}
</script>
