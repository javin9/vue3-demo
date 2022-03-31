## 如何理解 reactive, ref,toRef,toRefs

Vue3的CompositionAPI 创建响应式对象的方式：

- 对象(object，Array) 通过 **reactive** 创建响应式对象
- 值类型(string，number，boolean，symbol)通过 **ref** 创建响应式对象，同样 **对象(object，Array) 也可以创建响应式对象**

### reactive

reactive 方法 根据传入的**对象** ，创建返回一个**深度响应式对象**。**响应式对象**看起来和**传入的对象**一样，但是，响应式对象属性值改动，不管层级有多深，都会触发响应式。新增和删除属性也会触发响应式。

看一个例子，通过**reactive**创建了一个响应式，然后3秒之后，做以下三种方式操作，都会触发响应式

- 改变 name属性
- 深度改变 address属性
- 新增 school属性
- 删除 age属性

```vue
<template>
  <div class="demo">
    <div>姓名：{{state.name}}</div>
    <div v-if="state.age>0">年龄：{{state.age}}</div>
    <div>地址：{{state.address.provoince}} - {{state.address.city}} - {{state.address.street}}</div>
  </div>

  <div class="demo">
    <div>学校：{{state.school||'自学成才'}}</div>

  </div>
</template>

<script>
import { reactive } from 'vue'
export default {
  name: 'reactivedemo',
  setup () {
    // 响应式对象
    const state = reactive({
      name: '太凉',
      age: 18,
      hobby: ['游泳', '爬山'],
      address: {
        provoince: '北京',
        city: '北京',
        street: '东城区长安街'
      }
    })

    // 过3秒后改变
    setTimeout(() => {
      // update1:改变name属性
      state.name = '冰箱太凉'

      // update2:深度改变 address属性
      state.address.provoince = '山东省' // 年龄改为30
      state.address.city = '临沂市'

      // update3：新增 school属性
      state.school = '清华北大'

      // update4：删除 年龄属性
      delete state.age

      // update5：数组 添加一项
      state.hobby.push('打豆豆')
    }, 3000)

    return {
     //注意这里不同通过 ...state 方式结构，这样会丢失响应式
      state  
    }
  }
}
</script>

<style scoped>
.demo {
  text-align: left;
  width: 600px;
  margin: 20px auto;
}
</style>

```

效果

![](/Users/liujianwei/Documents/personal_code/vue3-demo/doc/reactive.gif)



重点：

- **reactive 只能 给对象添加响应式**，对于值类型，比如string，number，boolean,symbol，undefined无能为力。

- 不同通过 ...state 方式结构，这样会丢失响应式。下面这种方式是错误的

  ```js
  //注意这里不同通过 ...state 方式结构，这样会丢失响应式。
   return {
       ...state  
   }
  ```

  

### ref

上面我们提到 **reactive** 只能给对象，数组 添加响应式，如果想给值类型(string，number，boolean，symbol)添加响应式，就要用到**ref**，所以ref作用如下：

- 生成值类型响应式数据
- 通过.vue值修改
- 生成对象和数组类型的响应式对象**(对象和数组一般会选用reactive方式，比较便捷)**

```vue
<template>
  <div>
    <div>countRef:{{countRef}}</div>
    <div>objCountRef:{{objCountRef.count}}</div>
    <div>爱好：{{hobbyRef.join('---')}}</div>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'refdemo',
  setup () {
    // 值类型
    const countRef = ref(1)
    console.log(countRef)

    // 对象
    const objCountRef = ref({ count: 1 })

    // 数组
    const hobbyRef = ref(['爬山', '游泳'])

    setTimeout(() => {
      // 通过value改变值
      countRef.value = 2
      objCountRef.value.count = 3
      hobbyRef.value.push('吃饭')
    }, 4000)

    return {
      countRef,
      objCountRef,
      hobbyRef
    }
  }
}
</script>

```



效果：

![](/Users/liujianwei/Documents/personal_code/vue3-demo/doc/1ref.png)



如何选择 `ref` 和 `reactive`？建议：

1. 基础类型值(`String`、`Number`、`Boolean`等) 或单值对象(类似`{ count: 3 }`这样只有一个属性值的对象) 使用 `ref`
2. 引用类型值(`Object`、`Array`)使用 `reactive`
3. 对于 ref 对象可以使用 [unref](https://links.jianshu.com/go?to=https%3A%2F%2Fv3.cn.vuejs.org%2Fapi%2Frefs-api.html%23unref) 语法糖来免去`.value`访问的困扰


### toRef

- 针对一个响应式对象（reactive 封装）的 prop（属性）创建一个ref，且保持响应式
- 两者 保持引用关系 

我们直接看一个例子，然后理解一下上面两句话

```vue
<template>
  <div class="demo">
    <div>姓名--state.name：{{state.name}}</div>
    <div>姓名2--nameRef：{{nameRef}}</div>
    <div>年龄：{{state.age}}</div>
  </div>
</template>

<script>
import { reactive, toRef } from 'vue'
export default {
  name: 'reactivedemo',
  setup () {
    // 响应式对象
    const state = reactive({
      name: '太凉',
      age: 18
    })

    // 通过toRef创建一个Ref响应式
    const nameRef = toRef(state, 'name')

    // 过3秒后改变 两者 保持引用关系 
    setTimeout(() => {
      // update1:改变name属性
      state.name = '冰箱太凉'
    }, 3000)

    // 过6秒后改变 两者 保持引用关系 
    setTimeout(() => {
      // update1:改变name属性
      nameRef.value = '我就是冰箱太凉'
    }, 6000)

    return {
      nameRef,
      state
    }
  }
}
</script>

```

效果图：

![](/Users/liujianwei/Documents/personal_code/vue3-demo/doc/1toRef.gif)



### toRefs

`toRefs` 是一种用于破坏响应式对象并将其所有属性转换为 ref 的实用方法

- 将响应式对象（reactive封装）转成普通对象
- 对象的每个属性(Prop)都是对应的ref
- 两者保持引用关系

直接看demo：

```vue
<template>
  <div class="demo">
    <h3>state 方式 不推荐的方式绑定</h3>
    <div>姓名--state.name：{{state.name}}</div>
    <div>年龄--state.age：{{state.age}}</div>
  </div>
  <div class="demo">
    <h3>toRefs之后的 方式 推荐这种方式，return需要{...toRefs(state)}</h3>
    <div>姓名--name：{{name}}</div>
    <div>年龄--age：{{age}}</div>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
export default {
  name: 'reactivedemo',
  setup () {
    // 响应式对象
    const state = reactive({
      name: '太凉',
      age: 18
    })

    // 通过toRefs创建一个响应式对象属性的Ref
    const toRefsValue = toRefs(state)

    // 过3秒后改变  两者保持引用关系
    setTimeout(() => {
      state.name = '冰箱太凉'
      state.age = '30'
    }, 3000)

    // 过6秒后改变 两者保持引用关系
    setTimeout(() => {
      toRefsValue.name.value = '我就是宇宙小超人'
      toRefsValue.age.value = '101'
    }, 6000)

    return {
      // 不建议使用这种方式，可以用下面的方式直接替换
      state,
      // 最佳方式：这里是结构 将 name的ref，age的ref结构到对象根下面
      ...toRefsValue
    }
  }
}
</script>
```

效果：

![](/Users/liujianwei/Documents/personal_code/vue3-demo/doc/1torefs.gif)



### 最佳实践

```javascript
<template>
  <div>
    <div>姓名：{{name}}</div>
    <div>年龄：{{age}}</div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
  setup () {
    const state = reactive({
      age: 20,
      name: '太凉'

    })

    const stateAsRefs = toRefs(state)
    return {
      ...stateAsRefs
    }
  }
}
</script>

```

**注意reactive封装的响应式对象，不要通过解构的方式return，这是不具有响应式的。可以通过 toRefs 处理，然后再解构返回，这样才具有响应式**

```js
const state = reactive({...});
return {...state}; // 这种方式将丢失响应式，是一种错误的方式
return toRefs(state); // works
```

