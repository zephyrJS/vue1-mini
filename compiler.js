class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.compile(this.el)
    }
    compile(el) {
        el.childNodes.forEach((node) => {
            if (node.childNodes.length > 0) {
                this.compile(node)
            }
            if (this.isTextNode(node)) {
                this.compileText(node)
                return
            }
            if (this.isElementNode(node)) {
                this.compileElement(node)
            }
        })
    }
    compileElement(node) {
        Array.from(node.attributes).forEach((attr) => {
            const { name, value: key } = attr
            if (this.isDirective(name)) {
                const attrName = name.slice(2)
                this.update(node, attrName, key)
            }
        })
    }
    update(node, attrName, key) {
        const fn = this[`${attrName}Update`]
        fn && fn.call(this, node, this.vm[key], key)
    }
    textUpdate(node, value, key) {
        node.textContent = value
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }
    modelUpdate(node, value, key) {
        node.value = value
        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue
        })
        node.addEventListener('input', (e) => {
            this.vm[key] = e.target.value
        })
    }
    compileText(node) {
        const reg = /\{\{(.+?)\}\}/
        const value = node.textContent
        if (reg.test(value)) {
            const key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })
        }
    }
    isDirective(attributeName) {
        return attributeName.startsWith('v-')
    }
    isTextNode(node) {
        return node.nodeType === Node.TEXT_NODE
    }
    isElementNode(node) {
        return node.nodeType === Node.ELEMENT_NODE
    }
}
