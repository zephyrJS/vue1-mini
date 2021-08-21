/**
 * construcotr
 *  + $el
 *  + $data
 *  + $options
 * methods
 *  + proxyData
 */

class Vue {
    constructor(options) {
        this.$options = options
        this.$data = options.data || {}
        this.$el =
            typeof options.el === 'string'
                ? document.querySelector(options.el)
                : options.el
        // 代理到 vm 实例
        this.proxyData(this.$data)
        // 将 $data 数据设置成响应式
        new Observer(this)
        // compiler 处理插值表达式和指令
        new Compiler(this)
    }

    // 将 data 的属性设置成 getter setter，挂载到 vm 上
    proxyData(data) {
        Object.keys(data).forEach((key) => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key]
                },
                set(newValue) {
                    if (data[key] === newValue) {
                        return
                    }
                    data[key] = newValue
                },
            })
        })
    }
}
