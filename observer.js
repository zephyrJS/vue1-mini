/**
 * 对 $data 进行响应式代理
 * constructor
 * methods
 *  + walk
 *  + defineReactive
 */
class Observer {
    constructor(vm) {
        this.walk(vm.$data)
    }
    // 深度遍历 $data
    walk(data) {
        if (!data || typeof data === 'string') return

        Object.keys(data).forEach((key) => {
            this.defineReactive(data, key, data[key])
        })
    }
    // 定义代理
    defineReactive(obj, key, value) {
        const that = this
        const dep = new Dep()
        this.walk(value)

        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set(newValue) {
                if (newValue === value) return
                value = newValue
                that.walk(newValue)
                dep.notify()
            },
        })
    }
}
