<template>
  <div>
    <button @click="onHandleClick">父组件点击</button>
    <ExposeChild />
  </div>
</template>

<script>
import ExposeChild from './expose-child.vue'
export default {
  components: {
    ExposeChild
  },
  setup () {
    const onHandleClick = () => {
      this.toggleNavbar()
    }
    return {
      onHandleClick
    }
  }
}
</script>
