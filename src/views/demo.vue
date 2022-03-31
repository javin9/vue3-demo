<template>
  <div>
    <div>姓名：{{name}}</div>
    <div>年龄：{{age}}</div>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
export default {
  setup () {
    const state = reactive({
      age: 20,
      name: '太凉'

    })

    const stateAsRefs = toRefs(state)
    return {
      ...stateAsRefs
    }
  }
}
</script>
