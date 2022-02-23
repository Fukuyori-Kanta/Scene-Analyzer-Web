﻿import React from "react"
import { Fetch } from "./Fetch"
import { useParams } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'
import SceneList from './SceneList'
import CurrentProvider from './CurrentProvider'
import ModeProvider from './ModeProvider'
import AnnotationProvider, { useAnnotation } from './AnnotationProvider'
import SwitchScreen from './SwitchScreen'
import LabelScreen from "./LabelScreen"

export default function TestPage() {
  const videoId = 'A211079487'

  return (
    <CurrentProvider>
      <ModeProvider>
        <AnnotationProvider>
          <Fetch
            uri={`http://192.168.204.128/result/` + videoId}
            renderSuccess={TestPageContents}
          />
        </AnnotationProvider>
      </ModeProvider>
    </CurrentProvider>
  )
}

function TestPageContents({ data }) {
  const videoId = data[0].video_id
  const productName = data[0].product_name
  const sceneCount = [...new Set(data.map(item => item.scene_no))].length

  /* 各種データの表示 */
  return (
    <div id="result-show">
      <Breadcrumbs productName={productName} />

      <div className="video-info">
        <div id="file-name">{productName}</div>
        {/* <div id="scene-no">{currentScene}シーン目</div> */}
      </div>


      <div id="result-screen">
        <SwitchScreen videoId={videoId} data={data} />

        <LabelScreen data={data} />
      </div>

      <SceneList videoId={videoId} sceneCount={sceneCount} />

    </div>
  )
}
