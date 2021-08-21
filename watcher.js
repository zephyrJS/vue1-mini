class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key
        this.cb = cb
        Dep.target = this
        this.oldValue = vm[key]
        Dep.target = null
    }
    update() {
        const newValue = this.vm[this.key]
        this.cb && this.cb(newValue)
    }
}
