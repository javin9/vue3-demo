<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>newMsg:{{newMsg}}</p>
    <p>copMsg:{{copMsg}}</p>
    <p>{{name}}</p>
    <button @click="handleClick">点击</button>
  </div>
</template>

<script>
import { reactive, toRefs, ref, computed } from 'vue'
export default {
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      default: ''
    }
  },
  setup (props, context) {
    const newMsg = ref(props.msg)
    const state = reactive({
      name: 'tailaign',
      copMsg: computed(() => {
        return props.msg
      })
    })

    const handleClick = () => {
      context.emit('change', 1)
    }
    return { ...toRefs(state), newMsg, handleClick }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
