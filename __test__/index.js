
/**
 * 创建响应式数据
 * @param {Object|Array} data
 * @returns
 */
// function createProxyData (data) {
//   return new Proxy(data, {
//     get (target, key, receiver) {
//       console.log(`触发get key=${key}`)
//       const result = Reflect.get(target, key, receiver)
//       console.log(`get 结果： ${result}`)
//       return result
//     },
//     set (target, key, value, receiver) {
//       // 返回Boolean值
//       console.log(`触发set key=${key},value=${value}`)
//       const result = Reflect.set(target, key, value, receiver)
//       console.log(`set 结果： ${result}`)
//       // 返回结果 成功true，失败false
//       return result
//     },
//     deleteProperty (target, key) {
//       console.log(`触发 deleteProperty key=${key}`)
//       const result = Reflect.deleteProperty(target, key)
//       console.log(`deleteProperty 结果： ${result}`)
//       return result
//     }
//   })
// }
// const proxyData = createProxyData({ name: '太凉', phone: '186****8080' })
// console.log(proxyData.name)
// proxyData.age = 20 // 触发set
// delete proxyData.phone

function createProxyData (data) {
  return new Proxy(data, {
    get (target, key, receiver) {
      // 忽略 push,pop,....等原型上的属性，只对本身的属性进行监听
      if (Reflect.ownKeys(target).includes(key)) {
        // 监听
        console.log(`触发get key=${key}`)
      }
      const result = Reflect.get(target, key, receiver)
      return result
    },
    set (target, key, value, receiver) {
      // 不重复处理数据
      const oldValue = target[key]
      if (oldValue === value) {
        return true
      }
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
proxyArray.pop()
