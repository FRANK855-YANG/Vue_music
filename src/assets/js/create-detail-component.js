import MusicList from '@/components/music-list/music-list.vue'
import storage from 'good-storage'
import { processSongs } from '@/service/song'

export default function createDetailComponent(name, key, fetch) {
    return {
        name,
        components: { MusicList },
        props: {
            // 由router-view传入
            data: Object
        },
        data() {
            return {
                songs: []
            }
        },
        computed: {
            computedData() {
                let ret = null
                const data = this.data
                if (data) {
                    ret = data
                } else {
                    const cachedData = storage.session.get(key)
                    if (cachedData && (cachedData.mid || cachedData.id + '') === this.$route.params.id) {
                        ret = cachedData
                    }
                }
                return ret
            },
            pic() {
                const data = this.computedData
                return data && data.pic
            },
            title() {
                const data = this.computedData
                return data && (data.name || data.title)
            }
        },
        async created() {
            const result = await fetch(this.computedData)
            this.songs = await processSongs(result.songs)
        }
    }
}
