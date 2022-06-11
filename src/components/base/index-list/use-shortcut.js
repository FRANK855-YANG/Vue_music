import { ref, computed } from 'vue'
export default function useShortcut(props, groupRef) {
    const scrollRef = ref(null)

    const shortcutList = computed(() => {
        return props.data.map((group) => {
            return group.title
        })
    })

    function onShortcutTouchStart(e) {
        // touchStart原生HTML事件，传一个touch对象给onShortcutTouchStart函数
        // touch对象身上有一个属性target，代表当前触摸的dom节点
        const anchorIndex = parseInt(e.target.dataset.index)
        const targetElement = groupRef.value.children[anchorIndex]
        const scroll = scrollRef.value.scroll
        scroll.scrollToElement(targetElement)
    }

    return {
        shortcutList,
        scrollRef,
        onShortcutTouchStart
    }
}
