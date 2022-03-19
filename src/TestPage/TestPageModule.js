﻿import React from "react"
import { Fetch } from "../Provider/Fetch"
import Breadcrumbs from '../components/Breadcrumbs'
import SceneList from '../ResultDetailPage/SceneList'
import CurrentProvider, { useCurrent } from '../Provider/CurrentProvider'
import ModeProvider from '../Provider/ModeProvider'
import AnnotationProvider, { useAnnotation } from '../Provider/AnnotationProvider'
import CanvasProvider from "../Provider/CanvasProvider";
import SwitchScreen from '../ResultDetailPage/SwitchScreen'
import LabelScreen from "../ResultDetailPage/LabelScreen"

export default function TestPage() {
  const videoId = 'A211079487'

  return (
    <ModeProvider>
      <CurrentProvider>
        <AnnotationProvider>
          <CanvasProvider>
            <Fetch
              uri={`/api/result/` + videoId}
              renderSuccess={TestPageContents}
            />
          </CanvasProvider>
        </AnnotationProvider>
      </CurrentProvider>
    </ModeProvider>
  )
}

function TestPageContents({ data }) {
  const videoId = data[0].video_id
  const productName = data[0].product_name
  const sceneCount = [...new Set(data.map(item => item.scene_no))].length
  //const { currentScene } = useCurrent()

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
