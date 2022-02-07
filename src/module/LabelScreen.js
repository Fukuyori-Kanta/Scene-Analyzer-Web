import React from "react"
import { useMode } from "./ModeProvider"
import { useCurrent } from "./CurrentProvider"

import FavoChart from './FavoChart'


export default function LabelScreen({ data }) {
  let { isEditMode, makeEditMode, makeViewMode } = useMode();
  let { currentNo } = useCurrent();

  // ラベルデータの抽出
  const labelsData = data.filter(item => item.scene_no == 'scene_' + currentNo)
  const labels = labelsData.map((label, index) => {
    return (
      <div data-label_id={index + 1} className="label-item" key={index + 1}>
        <h3 className="label">{label.label_name_ja}</h3>
      </div>
    )
  })

  // 好感度データの抽出
  const sceneCount = [...new Set(data.map(item => item.scene_no))].length
  const favoData = [...Array(sceneCount).keys()].map(i => ++i).map(cnt => {
    const reg = new RegExp('^' + 'scene_' + cnt + '$')
    return data.filter(d => d.scene_no.match(reg) !== null)[0].favo
  })  

  return (
    <div id="label-screen" className="border-line">
      <div className="annotation-area">
        <h2 className="heading tag">このシーンのラベル一覧</h2>
        <div className="button-area" >
          <div className="edit-btn" style={{ display: isEditMode ? 'none' : '' }} onClick={() => makeEditMode()}>
            <p>編集</p>
          </div>
          <div className="save-btn" style={{ display: isEditMode ? '' : 'none' }} onClick={() => makeViewMode()}>
            <p>保存</p>
          </div>
          <div className="cancel-btn" style={{ display: isEditMode ? '' : 'none' }} onClick={() => makeViewMode()}>
            <p>キャンセル</p>
          </div>
        </div>
      </div>

      <div id="labels">{labels}</div>

      <div id="input-area"></div>

      <h2 className="heading tag">このシーンの好感度</h2>

      <FavoChart favoData={favoData}/>
    </div>
  )
}
