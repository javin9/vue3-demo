<template>
  <div>PiniaBpage</div>
  <div> 总数：{{postsStore.postsCount}}</div>
  <ul>
    <li
      v-for="item in postsStore.posts"
      :key="item"
    >
      {{item}}
    </li>
  </ul>
  <button @click="handleAdd">新增</button>
  <button @click="handleRemove">删除</button>
</template>

<script>
import { usePostsStore } from '@/store/usePostsStore.js'
// import { mapState } from 'pinia'
export default {
  name: 'PiniaBpage',
  setup () {
    const postsStore = usePostsStore()

    // 新增
    const handleAdd = () => {
      postsStore.insertPost()
    }

    // 删除
    const handleRemove = () => {
      postsStore.removePost()
    }
    return {
      postsStore,
      handleAdd,
      handleRemove
    }
  }
}
</script>
