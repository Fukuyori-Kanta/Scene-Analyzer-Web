import React from "react"
import { Fetch } from "../Provider/Fetch"
import Breadcrumbs from '../components/Breadcrumbs'
import SceneList from '../ResultDetailPage/SceneList'
import CurrentProvider from '../Provider/CurrentProvider'
import ModeProvider from '../Provider/ModeProvider'
import AnnotationProvider from '../Provider/AnnotationProvider'
import CanvasProvider from "../Provider/CanvasProvider"
import SwitchScreen from '../ResultDetailPage/SwitchScreen'
import LabelScreen from "../ResultDetailPage/LabelScreen"

export default function TestPage() {
  const videoId = 'A211079487'

  return (
    <Fetch
      uri={`/api/CM_Label`}
      renderSuccess={TestPageContents}
    />
  )
}

function TestPageContents({ data }) {
  
  // 重複を削除
  const result = data.filter((element, index, self) =>
    self.findIndex(e =>
      e.label_name_ja === element.label_name_ja
    ) === index
  )

  // CMに付与するラベル一覧
  const CM_Label = result.map(label => {
    const labelId = label.label_id // ラベルID
    return (
      <div key={labelId} className="label-item">
        <h3 className={(labelId[0] == 'V') ? "action-label" : "label"}>
          {label.label_name_ja}
        </h3>
      </div>
    )
  })

  /* 各種データの表示 */
  return (
    
    <div id="labels">
      {CM_Label}

    </div>
  )
}
