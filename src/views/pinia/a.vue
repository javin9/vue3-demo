<template>
  <div>PiniaApage</div>
  <div>姓名：{{user.name}}</div>
  <div>年龄：{{user.age}}</div>
</template>

<script>
import { useLoggedInUserStore } from '@/store/loggedInUser.js'
export default {
  name: 'PiniaApage',
  setup () {
    const user = useLoggedInUserStore()
    return {
      user
    }
  }
}
</script>
