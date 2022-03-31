<template>
  <div class="home">
    <div><input type="text" v-model="msg"></div>
    <div>msg:{{msg}}</div>
    <div>
     数字：{{age}} {{double}}
     <button @click="hanldeClick">点击</button>
    </div>
    <div>
      <HelloWorld  :msg="msg" @change="handleChange" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import { ref, computed } from 'vue'
import { reactive, toRefs, computed } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  setup () {
    const state = reactive({
      age: 18,
      msg: '你好啊',
      double: computed(() => {
        return state.age * 2
      })
    })

    const hanldeClick = () => {
      state.age += 1
    }

    const handleChange = () => {
      state.age += 1
    }
    return { ...toRefs(state), hanldeClick, handleChange }
  }
}
</script>
