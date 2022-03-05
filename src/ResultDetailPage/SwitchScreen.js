import React from "react"
import Video from '../components/Video'
import Canvas from './Canvas'
import { useMode } from "../Provider/ModeProvider"

export default function SwitchScreen({ videoId, data }) {
  
  let { isEditMode } = useMode();

  const showSwitchScreen = (isEditMode) => {
    if (!isEditMode) {
      return <Video videoId={videoId}  />
    } else {
      return <Canvas videoId={videoId} data={data} />
    }
  }

  return (
    <div id="switch-screen" className="border-line layer-wrap" >
      {showSwitchScreen(isEditMode)}
    </div>
  )
}
