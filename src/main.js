import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store1'
import { createPinia } from 'pinia'

createApp(App)
  // .use(store)
  .use(router)
  .use(createPinia())
  .mount('#app')
