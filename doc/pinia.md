# Vue状态管理-Pinia


Pinia是Vue应用程序的状态管理方案，是Vuex核心团队成员开发。Pinia拥有更易于理解和追溯的API，实现了很多Vuex5的提案。

Pinia同时支持Vue2和Vue3，不过下面展示的例子都是使用Vue3，Pinia的版本是`Pinia@2.0.9`。
Vue2和Vue3使用的Pinia版本有一点不同，因此请查看[官方 Pinia]('https://pinia.vuejs.org/introduction.html') 文档以获取更多信息。

### 安装和配置

可以使用npm或者yarn安装Pinia

```bash
yarn add pinia@next
# 或者 使用npm
npm install pinia@next
```

安装完毕后，找到Vue应用程序的文件 `main.js` (vue-cli初始化的项目，一般都命名为main.js)。从`Pinia`的npm包中导入`createPinia`，然后使用`Vue`的`use`方法作为插件使用

```javascript
//main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

createApp(App)
  .use(router)
  .use(createPinia())
  .mount('#app')
```

接下来，我们去创建一个 `store`

### Store核心

Pinia的`Store`不同于Vuex的`Store`。使用Vuex的时候，整个应用程序只有一个主要`Store`（虽然你可以拆成不同的模块，但是还是一个主存储出口）。然而，今天的主角Pinia则是**开箱即用的模块化设计**，不在需要一个主要的`Store`，可以创建不同的`Store`。例如，我们可以创建一个登录用户`Store`。

```javascript
// store/loggedInUser.js
import { defineStore } from 'pinia'

export const useLoggedInUserStore = defineStore({
// id 是必填的，并且所有 Store 中唯一。因为Pinia会将它在devtools显示
  id: 'loggedInUser',
  state () {
    return {
      name: '太凉',
      age: 18,
      email: 'fake@email.com'
    }
  },
  getters: {},
  actions: {}
})
```

上面我们创建了一个**登录用户`Store`**，接下来我们可以直接在组件中引用,然后在`setup`函数中调用`useLoggedInUserStore`

```vue
<template>
  <div>PiniaApage</div>
  <div>姓名：{{user.name}}</div>
  <div>年龄：{{user.age}}</div>
</template>

<script>
import { useLoggedInUserStore } from '@/store/loggedInUser.js'
export default {
  name: 'PiniaDemoPage1',
  setup () {
    const user = useLoggedInUserStore()
    return {
      user
    }
  }
}
</script>
```

这与 Vuex 有很大不同，Vuex 的`Store`  会自动挂载到 当前Vue的实例，可以通过`this.$store`的方式调用。然而，Pania 方式也让开发人员 更清楚`Store`来自哪里，因为它是标准的 Javascript 模块导入，可以看到是从哪个文件导入的。

假如，你不用  Composition API的方式，你仍然可以借助一些辅助函数使用Pinia，下面将会详细说，这里先提一嘴。

### State

我们将 `Store` 中的 state 属性设置为一个函数，该函数返回一个包含不同状态值的对象。这与我们在组件中定义`data`的方式非常相似。事实上，唯一的区别是属性名称：状态与数据

```javascript
import { defineStore } from 'pinia'
export const useLoggedInUserStore = defineStore({
// id 是必填的，并且所有 Store 中唯一。因为Pinia会将它在devtools显示
  id: 'loggedInUser',
  state () {
    return {
      name: '太凉',
      age: 18,
      email: 'fake@email.com'
    }
  },
  getters: {},
  actions: {}
})
```

现在，为了从组件中访问 loginUserStore 的状态，我们只需要引用我们需要的`Store`，这种方式非常优雅。完全不需要像Vuex那样从嵌套对象中找到我们需要的Store。

```vue
<template>
  <div>PiniaApage</div>
  <div>姓名：{{user.name}}</div>
  <div>年龄：{{user.age}}</div>
</template>

<script>
import { useLoggedInUserStore } from '@/store/loggedInUser.js'
export default {
  name: 'PiniaDemoPage1',
  setup () {
    //不用在想以前那个 user.state.name的方式获取了
    const user = useLoggedInUserStore()
    return {
      user
    }
  }
}
</script>
```

**警告**,不能结构`user`，因为那样会失去响应式。**下面的方式是错误的。**

```javascript
❌ const {name, email} = useLoggedInUserStore()
```

如果你使用的不是Composition API的方式，而是Option API的方式。可以通过`Pinia`的`mapState`函数获取 `State`数据。`Pinia`的`mapState`函数 和Vuex的`mapState`虽然名字相同，但是使用方式完全不同。

`Pinia`的`mapState`函数的第一个参数是必须是之前创建的`Store`，第二个参数是Store中的state的属性值。看代码

```Vue
//PageComponent.vue
<template>
  <h1>你好, 我是 {{name}}，我来自地球</h1>
  <h2>联系邮箱：{{email}}</h2>
</template>
<script>
import {mapState} from 'pinia'
export default{
  computed:{
    ...mapState(useLoggedInUserStore, ['name','email'])
  }
}
</script>
```

总结：

- 定义Pinia的`state`，和组件的`data`的方式是一样
- 需要在组件间中手动导入我们需要的Store模块，这样做的好处是明确知道数据的来源，更符合标准的 Javascript 

### Getters

Pinia中的`getters`和Vuex中的`getters` 的作用是相同的，都是作为组件的计算属性(computed)。

创建getters的方式有两种，一种是通过`this`关键字，一种是通过`state`具体看代码

```javascript
//store/usePostsStore.js
import { defineStore } from 'pinia'

export const usePostsStore = defineStore({
  id: 'PostsStore',
  state: ()=>({ posts: ['post 1', 'post 2', 'post 3', 'post 4'] }),
  getters:{

    // 传统函数方式
    postsCount: function(){
      return this.posts.length
    },
    // 传统函数简写方式
    postsCount2(){
      return this.posts.length
    },
    // 箭头函数
    postsCount3:(state)=>state.posts.length,

    // ❌ 不能用箭头函数+this的方式，这种方式this指向不对
    // postsCount: ()=> this.posts.length
  }
})
```

接下来看Composition API方式的组件中如何使用创建的`getters`，其实用法和state相同。看代码

```vue
<template>
  <div>PiniaBpage</div>
  <div> 总数：{{postsStore.postsCount}}</div>
</template>

<script>
import { usePostsStore } from '@/store/usePostsStore.js'
export default {
  name: 'PiniaBpage',
  setup () {
    const postsStore = usePostsStore()
    return {
      postsStore
    }
  }
}
</script>
```

如果是Option API 的组件，不能像Vuex那样通过`mapGetters`辅助函数获取。因为Pinia**没有**`mapGetters`辅助函数，Pinia中消费`getters`还是借助 `mapState`辅助函数

```vue
<template>
  <div> 总数：{{postsCount}}</div>
</template>

<script>
import { mapState } from 'pinia'
import { usePostsStore } from "@/store/PostsStore";

export default {
  computed:{
    ...mapState(usePostsStore, ['postsCount'])
  }
};
</script>
```

### Actions

Pinia不同于Vuex，Pinia提供了单一的方式更改state的值，在Pinia中没有`mutations`,只有action方式。先来看一下Pinia的action怎么用吧。上代码

- 直接通过this找到对应的state修改
- 通过.$patch 函数方法
- 通过.$patch 对象方法

```javascript
import { defineStore } from 'pinia'

export const usePostsStore = defineStore({
  id: 'PostsStore',
  state: () => ({
    posts: ['post 1', 'post 2', 'post 3', 'post 4'],
    user: { postsCount: 2 },
    age:18,
    errors: []
  }),
  getters: {
    postsCount: function () {
      return this.posts.length
    },
    postsCount2 () {
      return this.posts.length
    },
    // 箭头函数
    postsCount3: (state) => state.posts.length
  },
  actions: {
    insertPost () {
      //方式1：直接通过this找到对应的state修改
      this.posts.push(`post_${Date.now()}`)
      this.user.postsCount++
    },
    removePost () {
      //方式2：通过.$patch 函数方法
      this.$patch((state) => {
        state.posts.shift()
        state.user.postsCount++
      })
      
      //通过.$patch 对象方法
      this.$patch({
        age:30
      });
    }
  }
})
```

以上展示了三种更改Pinia的State方式。

如果是 Composition API使用方式

```vue
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
  <button @click="handleBeforeAdd">新增到前面</button>
</template>

<script>
import { usePostsStore } from '@/store/usePostsStore.js'
  
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
    // 新增到前面，也可以在这里通过$patch修改，同样这里也可以直接修改
   const  handleBeforeAdd=()=>{
     postsStore.$patch((state) => {
        state.posts.shift()
        state.user.postsCount++
     })
   }
    return {
      postsStore,
      handleAdd,
      handleRemove,
      handleBeforeAdd
    }
  }
}
</script>
```

如果是 Options API使用方式，需要借助 辅助函数 `mapActions`

```vue
// PostEditorComponent.vue
<template>
  <input type="text" v-model="post" />
  <button @click="insertPost(post)">保存</button>
</template>
<script>
import {mapActions} from 'pinia'
import { usePostsStore } from '@/store/PostsStore';
export default{
  data(){
    return { post: '' }
  }, 
  methods:{
    ...mapActions(usePostsStore, ['insertPost'])
  }
}
</script>
```

其实Pinia的action使用非常灵活

- 可以在组件或者其他actions里面调用

- 可以在其他的Store的actions里面调用

  ```javascript
  import { useAuthStore } from './auth-store'
  
  export const useSettingsStore = defineStore('settings', {
    state: () => ({
      // ...
    }),
    actions: {
      async fetchUserPreferences(preferences) {
        const auth = useAuthStore()
        if (auth.isAuthenticated) {
          this.preferences = await fetchPreferences()
        } else {
          throw new Error('User must be authenticated')
        }
      },
    },
  })
  ```

- 支持同步和异步

- 可以支持灵活的参数

- ...............

### Vue Devtools

在 Vue 2 中，Pania 支持在 Vuex 选项卡中查看状态，甚至可以看到时间轨迹。时间轨迹的标签几乎没有在 Vuex 中使用时那么好。

至于 Vue 3，Pania 仅支持在 devtools 中查看状态，不支持时间轨迹功能。然而，这实际上比 Vuex 为 Vue 3 提供的要多，因为它在最新的开发工具中根本不支持。

### 最后

快速回顾一下 Pinia 最显着的功能，以帮助你去快速了解Pinia，并应用于项目中

- 由 Vue.js 核心团队成员维护
- 感觉更像是常规的旧 javascript 导入模块，将操作为方法调用，直接在store上访问状态等。
- 不再mutations
- 与 Vue Devtools 集成

### 结论

Pinia虽然是Vue生态的新成员，但是事实证明Pinia是最优前途的状态管理解决方案，具有直观的API，模块化，清晰导入来源。

### 参考文献

- [Pinia, an Alternative Vue.js Store](https://vueschool.io/articles/vuejs-tutorials/pinia-an-alternative-vue-js-store/)
- [官网](https://pinia.vuejs.org/introduction.html)
