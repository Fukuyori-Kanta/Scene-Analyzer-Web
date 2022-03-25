import React from "react"
import { Fetch } from "../Provider/Fetch"
import { useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import SceneList from './SceneList'
import CurrentProvider, { useCurrent } from '../Provider/CurrentProvider'
import ModeProvider from '../Provider/ModeProvider'
import AnnotationProvider, { useAnnotation } from '../Provider/AnnotationProvider'
import CanvasProvider from "../Provider/CanvasProvider";
import SwitchScreen from './SwitchScreen'
import LabelScreen from "./LabelScreen"
import CurrentScene from './CurrentScene'

export default function ResultDetailPage() {
  const videoId = useParams().id

  return (
    <ModeProvider>
      <CurrentProvider>
        <AnnotationProvider>
          <CanvasProvider>
            <Fetch
              uri={`/api/result/` + videoId}
              renderSuccess={ResultDetailPageContents}
            />
          </CanvasProvider>
        </AnnotationProvider>
      </CurrentProvider>
    </ModeProvider>
  )
}

function ResultDetailPageContents({ data }) {
  const videoId = data[0].video_id
  const productName = data[0].product_name
  const sceneCount = [...new Set(data.map(item => item.scene_no))].length

  /* 各種データの表示 */
  return (
    <div id="result-show">
      <Breadcrumbs productName={productName} />

      <div className="video-info">
        <div id="file-name">{productName}</div>
        <CurrentScene />
      </div>

      <div id="result-screen">
        <SwitchScreen videoId={videoId} data={data} />

        <LabelScreen data={data} />
      </div>

      <SceneList videoId={videoId} sceneCount={sceneCount} />

    </div>
  )
}
