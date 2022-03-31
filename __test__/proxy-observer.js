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
      // 性能如何提升的？
      return reactive(result)
    },
    set (target, key, val, receiver) {
      // 重复的数据，不处理
      if (val === target[key]) {
        return true
      }

      const ownKeys = Reflect.ownKeys(target)
      if (ownKeys.includes(key)) {
        console.log('已有的 key', key)
      } else {
        console.log('新增的 key', key)
      }

      const result = Reflect.set(target, key, val, receiver)
      console.log('set', key, val)
      return result // 是否设置成功
    },
    deleteProperty (target, key) {
      const result = Reflect.deleteProperty(target, key)
      console.log('delete property', key)
      return result // 是否删除成功
    }
  }

  // 生成新对象
  const proxyData = new Proxy(target, proxyHanlder)
  return proxyData
}

// 测试
const data = {
  name: 'TaiLiang',
  age: 18,
  address: {
    province: '北京'
  }
}

const proxyData = reactive(data)
console.log(proxyData)
