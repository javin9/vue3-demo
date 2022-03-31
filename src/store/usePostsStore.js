import { defineStore } from 'pinia'

export const usePostsStore = defineStore({
  id: 'PostsStore',
  state: () => ({
    posts: ['post 1', 'post 2', 'post 3', 'post 4'],
    user: { postsCount: 2 },
    errors: []
  }),
  getters: {

    // traditional function
    postsCount: function () {
      return this.posts.length
    },
    // method shorthand
    postsCount2 () {
      return this.posts.length
    },
    // 箭头函数
    postsCount3: (state) => state.posts.length
  },
  actions: {
    insertPost () {
      this.posts.push(`post_${Date.now()}`)
      this.user.postsCount++
    },
    removePost () {
      this.$patch((state) => {
        state.posts.shift()
        state.user.postsCount++
      })
    }
  }
})
