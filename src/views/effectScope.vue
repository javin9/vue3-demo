<template>
  <div></div>
</template>

<script>
import { effectScope, watchEffect, computed, ref, watch } from 'vue'
export default {
  setup () {
    const scope = effectScope()
    const counter = ref(0)

    setInterval(() => {
      counter.value++
    }, 1000)

    scope.run(() => {
      const doubled = computed(() => counter.value * 2)

      watch(doubled, () => console.log('doubled:', doubled.value))

      watchEffect(() => console.log('Count: ', counter.value))
    })

    scope.run(() => {
      watchEffect(() => console.log(`counter: ${counter.value}`))
    })

    // 处理该作用域内的所有 effect
    scope.stop()
  }
}
</script>
