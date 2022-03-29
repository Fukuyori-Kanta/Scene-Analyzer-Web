import React from 'react'
import Video from '../components/Video'
import Canvas from './Canvas'
import { useMode } from '../Provider/ModeProvider'

export default function SwitchScreen({ videoId }) {
  let { isEditMode } = useMode()  // 現在のモード（「編集」か「表示」）

  // モードにあったデータの表示する関数
  // 「表示」モードの場合、動画データを表示
  // 「編集」モードの場合、画像データと物体ラベルのバウンディングボックスを表示
  const showSwitchScreen = (isEditMode) => {
    if (!isEditMode) {
      return <Video videoId={videoId}  />
    } else {
      return <Canvas videoId={videoId} />
    }
  }

  return (
    <div id="switch-screen" className="border-line layer-wrap" >
      {showSwitchScreen(isEditMode)}
    </div>
  )
}
