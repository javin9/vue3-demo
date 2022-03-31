<template>
  <div class="home">
    <div>
      <input
        type="text"
        v-model="msg"
      >
    </div>
    <div>msg:{{msg}}</div>
    <div>
      数字：{{age}} {{double}}
      <button @click="hanldeClick">点击</button>
      <div>
        <HelloWorld :msg="msg" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { ref, computed } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  setup (props, ctx) {
    const msg = ref('你好啊')
    const age = ref(18)
    const hanldeClick = () => {
      age.value += 1
    }

    const double = computed(() => {
      return age.value * 2
    })
    return { msg, age, hanldeClick, double }
  }
}
</script>
