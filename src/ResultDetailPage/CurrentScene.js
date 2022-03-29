import React from 'react'
import { useCurrent } from '../Provider/CurrentProvider'

export default function CurrentScene() {
  const { currentScene } = useCurrent() // 現在のシーン数
  
  return (
    <div id="scene-no">
      {currentScene}シーン目
    </div>
  )
}
