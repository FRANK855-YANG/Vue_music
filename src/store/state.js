import { FAVORITE_KEY, PLAY_MODE } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

const state = {
    sequenceList: [], // 顺序列表
    playlist: [], // 播放列表
    playing: false, // 当前状态
    playMode: PLAY_MODE.sequence, // 播放模式：默认顺序播放
    currentIndex: 0, // 当前歌曲
    fullScreen: false, // 全屏播放器视图
    favoriteList: load(FAVORITE_KEY) // 收藏夹，且初始从localstorage里拿数据
}

export default state
