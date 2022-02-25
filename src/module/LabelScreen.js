import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useCurrent } from './CurrentProvider'
import { useMode } from "./ModeProvider"
import FavoChart from './FavoChart'
import AnnotationButtonArea from './AnnotationButtonArea'
import LabelInpuForm from './LabelInpuForm'
import { useAnnotation } from './AnnotationProvider'
import { useCanvas } from './CanvasProvider'

export default function LabelScreen({ data }) {
  let { currentScene, currentLabel, changeCurrentLabel } = useCurrent();
  const { changeLabelsData } = useAnnotation();
  const { changeDrawnRect } = useCanvas()

  useEffect(() => {
    changeLabelsData(labelsData)
  }, [])

  // ラベルデータの抽出
  let labelsData = data.filter(item => item.scene_no == 'scene_' + currentScene)  // ラベルデータ

  // 並び替え（名詞が先、動詞が後）
  labelsData = labelsData.filter(item => item.label_id[0] == 'N').concat(labelsData.filter(item => item.label_id[0] == 'V'))

  // ラベルデータの表示
  const labels = labelsData.map((label, index) => {
    if (currentLabel == index + 1) {
      return (
        <div data-label_id={index + 1} className="label-item" key={index + 1} onClick={() => {changeCurrentLabel(index + 1); changeDrawnRect(index+1, 'selected')}}>
          <h3 className="label" style={{ border: '2px solid #F33' }}>{label.label_name_ja}</h3>
          <div className="delete-btn">
            <span>×</span>
          </div>
        </div>
      )
    } else {
      return (
        <div data-label_id={index + 1} className="label-item" key={index + 1} onClick={() => {changeCurrentLabel(index + 1); changeDrawnRect(index+1, 'selected')}}>
          <h3 className="label">{label.label_name_ja}</h3>
        </div>
      )
    }
  })
  
  // 好感度データの抽出
  const sceneCount = [...new Set(data.map(item => item.scene_no))].length
  const favoData = [...Array(sceneCount).keys()].map(i => ++i).map(cnt => {
    const reg = new RegExp('^' + 'scene_' + cnt + '$')
    return data.filter(d => d.scene_no.match(reg) !== null)[0].favo
  })

  // 好感度グラフの表示
  return (
    <div id="label-screen" className="border-line">
      <AnnotationButtonArea />
      <div id="labels">{labels}</div>
      <LabelInpuForm />
      <FavoChart favoData={favoData} />
    </div>
  )

}
