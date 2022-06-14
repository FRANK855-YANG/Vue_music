import { PLAY_MODE } from '@/assets/js/constant'

const state = {
    sequenceList: [], // 顺序列表
    playList: [], // 播放列表
    playing: false, // 当前状态
    playMode: PLAY_MODE.sequence, // 播放模式：默认顺序播放
    currentIndex: 0, // 当前歌曲
    fullScreen: false // 全屏播放器视图
}

export default state
