## Vue3为什么比Vue2快—Proxy实现响应式(1)

Vue3为什么比Vue2快的原因，主要有一下几点：

- Proxy实现响应式
- PatchFlag
- hoistStatic
- CacheHandler
- Tree-shaking

由于篇幅有限，接下来分开讲，本篇先说一下Proxy实现响应式。



### Object.defineProperty

先回顾一下Vue2.x的Object.defineProperty的缺点

- 深度监听需要一次性递归。初始化阶段和Set阶段都需要深度监听
- 无法监听新增属性和删除属性。如果想实现监听，新增属性需要使用Vue.set，删除属性需要 使用Vue.delete
- 无法原生监听数组，需要特殊处理

### Proxy基本使用

```javascript
/**
 * 创建响应式数据
 * @param {Object|Array} data
 * @returns
 */
function createProxyData (data) {
  return new Proxy(data, {
    get (target, key, receiver) {
      console.log(`触发get key=${key}`)
      const result = Reflect.get(target, key, receiver)
      console.log(`get 结果： ${result}`)
      return result
    },
    set (target, key, value, receiver) {
      // 返回Boolean值
      console.log(`触发set key=${key},value=${value}`)
      const result = Reflect.set(target, key, value, receiver)
      console.log(`set 结果： ${result}`)
      // 返回结果 成功true，失败false
      return result
    },
    deleteProperty (target, key) {
      console.log(`触发 deleteProperty key=${key}`)
      const result = Reflect.deleteProperty(target, key)
      console.log(`deleteProperty 结果： ${result}`)
      return result
    }
  })
}
```

下面我们通过示例开一下输出结果

#### 对象响应式

创建对象的响应式

```javascript
const proxyData = createProxyData({ name: '太凉', phone: '186****8080' })
```

##### 获取对象属性

```javascript
const proxyData = createProxyData({ name: '太凉', phone: '186****8080' })
console.log(proxyData.name) //获取name值
```

输出结果

```
触发get key=name
get 结果： 太凉
太凉
```



##### 设置对象属性

```javascript
const proxyData = createProxyData({ name: '太凉', phone: '186****8080' })
proxyData.age = 20 // 触发set
```

输出结果：

```
触发set key=age,value=20
set 结果： true
```

##### 删除对象属性

```javascript
const proxyData = createProxyData({ name: '太凉', phone: '186****8080' })
delete proxyData.phone
```

输出结果：

```
触发 deleteProperty key=phone
deleteProperty 结果： true
```

对象的响应式很简单，通过简单的代码就可以实现，下面看一下 数组的响应式

#### 数组的响应式

创建数组的响应式

```javascript
const proxyArray = createProxyData(['a', 'b'])
```

##### 新增值

```javascript
const proxyArray = createProxyData(['a', 'b'])
proxyArray.push('c')
```

输出结果：

```
触发get key=push
get 结果： function push() { [native code] }
触发get key=length
get 结果： 2
触发set key=2,value=c
set 结果： true
触发set key=length,value=3
set 结果： true
```

看到输出其结果，是不是很奇怪，只是调用了一下push('c') 触发了两次get，两次set。我们分析一下：

- 触发get key=push :  调用 `push`方法会触发.  **需要忽略掉**
- 触发get key=length：对数组设置值的时候，或获取当前 `length`长度
- 触发set key=2,value=c  ： 设置 2 位置上的值为 'c'
- 触发set key=length,value=3 : 更新数组的长度  

###### 优化1：忽略数组原型方法

```javascript
function createProxyData (data) {
  return new Proxy(data, {
    get (target, key, receiver) {
      /**新增1：start **/
      //忽略 push,pop,....等原型上的属性，只对本身的属性进行监听
      if (Reflect.ownKeys(target).includes(key)) {
        // 监听
        console.log(`触发get key=${key}`)
      }
      /**新增1：end **/
      const result = Reflect.get(target, key, receiver)
      return result
    },
    set (target, key, value, receiver) {
      /**新增2： start**/
      // 不重复处理数据
      const oldValue = target[key]
      if (oldValue === value) {
        return true
      }
      /**新增2：end **/
      console.log(`触发set key=${key},value=${value}`)
      const result = Reflect.set(target, key, value, receiver)
      console.log(`set 结果： ${result}`)
      // 返回结果 成功true，失败false
      return result
    },
    deleteProperty (target, key) {
      console.log(`触发 deleteProperty key=${key}`)
      const result = Reflect.deleteProperty(target, key)
      console.log(`deleteProperty 结果： ${result}`)
      return result
    }
  })
}

const proxyArray = createProxyData(['a', 'b'])
proxyArray.push('c')
```

输出结果：

```
触发get key=length
触发set key=2,value=c
set 结果： true
```

### Proxy实现响应式

根据上线的分析结果可以看到，通过Proxy很容易实现 **对象的响应式**。实现**数组的响应式**，需要注意两点：

- 忽略 push,pop,....等原型上的属性，只对本身的属性进行监听
-  不重复处理数据

基于以上内容，下面用Proxy实现响应式

```javascript
// 创建响应式
function reactive (target = {}) {
  if (typeof target !== 'object' || target == null) {
    // 不是对象或数组，则返回
    return target
  }

  // 代理配置
  const proxyHanlder = {
    get (target, key, receiver) {
      // 忽略 push,pop,....等原型上的属性，只对本身的属性进行监听
      if (Reflect.ownKeys(target).includes(key)) {
        console.log('get', key) // 监听
      }
      const result = Reflect.get(target, key, receiver)

      // 深度监听
      return reactive(result)
    },
    set (target, key, val, receiver) {
      // 重复的数据，不处理
      if (val === target[key]) {
        return true
      }

      const ownKeys = Reflect.ownKeys(target)
      if (ownKeys.includes(key)) {
        console.log('已有的 属性', key)
      } else {
        console.log('新增的 属性', key)
      }

      const result = Reflect.set(target, key, val, receiver)
      console.log('set', key, val)
      return result
    },
    deleteProperty (target, key) {
      const result = Reflect.deleteProperty(target, key)
      console.log('delete property', key)
      return result
    }
  }

  // 生成新对象
  const proxyData = new Proxy(target, proxyHanlder)
  return proxyData
}
```

测试一下：

```javascript
const data = {
  name: 'TaiLiang',
  age: 18,
  address: {
    province: '北京'
  }
}

const proxyData = reactive(data)
console.log(proxyData)

```

### Vue3比Vue2块的原因之一

Proxy实现的响应式优点

- 深度监听层级只到下一级，不会一直到底，性能好
- 可以监听 新增属性和删除属性
- 可以监听 原生数组变化

通过以上三点，可以看到Proxy能避开Object.defineProperty的缺点，但是Proxy也有缺点，无法兼容所有浏览器，无法做polyfill

### 参考资料

[Vue3](https://www.imooc.com/t/4427201#Article)
[Vue3.2 响应式原理源码剖析，及与 Vue2 .x响应式的区别](https://juejin.cn/post/7021046293627666463)