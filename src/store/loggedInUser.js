import { defineStore } from 'pinia'

export const useLoggedInUserStore = defineStore({
  // id is required so that Pinia can connect the store to the devtools
  id: 'loggedInUser',
  state () {
    return {
      name: '太凉',
      age: 18,
      email: 'fake@email.com'
    }
  },
  getters: {
    nickname () {
      return `昵称：${this.name}`
    }
  },
  actions: {}
})
