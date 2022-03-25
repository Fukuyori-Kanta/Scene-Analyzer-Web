import React from 'react'
import { useCurrent } from '../Provider/CurrentProvider'

export default function CurrentScene() {
  const { currentScene } = useCurrent()
  
  return (
    <div id="scene-no">
      {currentScene}シーン目
    </div>
  )
}
