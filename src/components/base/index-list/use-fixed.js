import { ref, watch, nextTick, computed } from 'vue'
export default function useFixed(props) {
    const groupRef = ref(null)
    const listHeights = ref([])// 记录每个字母块高度的数组
    const scrollY = ref(0)
    const currentIndex = ref(0)

    const fixedTitle = computed(() => {
        if (scrollY.value < 0) {
            return ''
        }
        const currentGroup = props.data[currentIndex.value]
        return currentGroup ? currentGroup.title : ''
    })

    watch(() => props.data, async () => {
        await nextTick()
        calculate()
    })

    watch(scrollY, (newY) => {
        const listHeightsVal = listHeights.value
        for (let i = 0; i < listHeightsVal.length - 1; i++) {
            const heightTop = listHeightsVal[i]
            const heightBottom = listHeightsVal[i + 1]
            if (newY >= heightTop && newY < heightBottom) {
                currentIndex.value = i
            }
        }
    })

    function calculate() {
        const list = groupRef.value.children// 每一个字母块(A,B....下的一坨歌手)
        const listHeightsVal = listHeights.value
        let height = 0// 当前总高度

        listHeightsVal.length = 0
        listHeightsVal.push(height)

        for (let i = 0; i < list.length; i++) {
            height += list[i].clientHeight// 每一个字母块的高度(xxx.clientHeight)，累加就是当前总高度(height)
            listHeightsVal.push(height)// 把每个字母块对应的当前总高度放入数组
        }
    }

    function onScroll(pos) {
        scrollY.value = -pos.y
    }
    return {
        groupRef,
        onScroll,
        fixedTitle,
        currentIndex
    }
}
