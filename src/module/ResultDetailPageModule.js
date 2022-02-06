import React from "react"
import { Fetch } from "./Fetch"
import { useParams } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'
import SceneList from './SceneList'
import CurrentProvider from './CurrentProvider'
import ModeProvider from './ModeProvider'
import SwitchScreen from './SwitchScreen'
import LabelScreen from "./LabelScreen"

export default function ResultDetailPage() {
  const videoId = useParams().id

  return (
    <CurrentProvider>
      <ModeProvider>
        <Fetch
          uri={`http://192.168.204.128/result/` + videoId}
          renderSuccess={ResultDetailPageContents}
        />
      </ModeProvider>
    </CurrentProvider>
  )
}

function ResultDetailPageContents({ data }) {
  const videoId = data[0].video_id
  const productName = data[0].product_name
  const sceneCount = [...new Set(data.map(item => item.scene_no))].length

  /* ラベルデータ */
  /*
  const labelsData = []
  data.filter(item => {
    if (item.scene_no == 'scene_' + this.state.currentNo) {
      labelsData.push(item)
    }
  })
  const labels = labelsData.map((label, index) => {
    return (
      <div data-label_id={index + 1} className="label-item" key={index + 1}>
        <h3 className="label">{label.label_name_ja}</h3>
      </div>
    )
  })
  */


  /* 好感度データ */
  /*
  const favoData = []
  const ListCnt = [...Array(sceneCount).keys()].map(i => ++i).map(cnt => {
    let l = []
    this.state.items.filter(data => {
      if (data.scene_no.indexOf('scene_' + cnt) !== -1) {
        l.push(data.favo)
      }
    })
    favoData.push(l[0])
  })
  */


  /* データの表示 */
  return (
    <div id="result-show">
      <Breadcrumbs productName={productName} />

      <div className="video-info">
        <div id="file-name">{productName}</div>
        {/* <div id="scene-no">{currentNo}シーン目</div> */}
      </div>

      <div id="result-screen">
        <SwitchScreen videoId={videoId} data={data} />

        <LabelScreen data={data} />
      </div>

      <SceneList videoId={videoId} sceneCount={sceneCount} />

    </div>
  )
}
