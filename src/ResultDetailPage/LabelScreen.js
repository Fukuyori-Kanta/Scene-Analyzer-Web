import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useCurrent } from '../Provider/CurrentProvider'
import { useMode } from "../Provider/ModeProvider"
import FavoChart from './FavoChart'
import AnnotationButtonArea from './AnnotationButtonArea'
import LabelInpuForm from './LabelInpuForm'
import { useAnnotation } from '../Provider/AnnotationProvider'
import { useCanvas } from '../Provider/CanvasProvider'
import { v4 as uuidv4 } from 'uuid'

export default function LabelScreen({ data }) {
  const [fireVal, setFireVal] = useState({})  // 発火用変数
  let { currentScene, currentLabel, changeCurrentLabel } = useCurrent();
  const { labelsData, setLabelsData, changeLabelsData, oldLabels, setOldLabels, preprocessingLabels } = useAnnotation();
  const { changeDrawnRect, checkedLabel } = useCanvas()

  const { isEditMode, makeEditMode, makeViewMode } = useMode();

  useEffect(() => {
    setOldLabels(fireVal)
    setLabelsData(fireVal)
  }, [fireVal])

  useEffect(() => {  
    setFireVal(l)
  }, [preprocessingData])

  const dummyFunc = (currentId) => {
    if (isEditMode) {
      changeCurrentLabel(currentId)
      checkedLabel(currentId)
    }
  }

  // ラベルデータの抽出
  let preprocessingData = data.filter(item => item.scene_no == 'scene_' + currentScene)  // ラベルデータ

  // 並び替え（名詞が先、動詞が後）
  preprocessingData = preprocessingData.filter(item => item.label_id[0] == 'N').concat(preprocessingData.filter(item => item.label_id[0] == 'V'))

  // ラベルデータを更新
  let l = {}
  preprocessingData.forEach(d => {
    l[uuidv4()] = d.label_name_ja
  });

  // ラベルデータの表示
  // const labels = labelsData.map((label, index) => {
  //   if (currentLabel == index + 1) {
  //     return (
  //       <div data-label_id={index + 1}
  //         className="label-item"
  //         key={index + 1}
  //         onClick={() => dummyFunc(index + 1)}>
  //         <h3 className="label" style={{ border: '2px solid #F33' }}>{label.label_name_ja}</h3>
  //         <div className="delete-btn">
  //           <span>×</span>
  //         </div>
  //       </div>
  //     )
  //   } else {
  //     return (
  //       <div data-label_id={index + 1}
  //         className="label-item"
  //         key={index + 1}
  //         onClick={() => dummyFunc(index + 1)}>
  //         <h3 className="label">{label.label_name_ja}</h3>
  //       </div>
  //     )
  //   }
  // })
  let labels = Object.keys(labelsData).map((key, index) => {
    console.log(key, labelsData[key])

    if (currentLabel == index + 1) {
      return (
        <div data-label_id={index + 1}
          className="label-item"
          key={index + 1}
          onClick={() => dummyFunc(index + 1)}>
          <h3 className="label" style={{ border: '2px solid #F33', color: Object.keys(oldLabels).includes(key) ? '#000' : '#4699ca' }}>{labelsData[key]}</h3>
          <div className="delete-btn">
            <span>×</span>
          </div>
        </div>
      )
    } else {
      return (
        <div data-label_id={index + 1}
          className="label-item"
          key={index + 1}
          onClick={() => dummyFunc(index + 1)}>
          <h3 className="label" style={{ color: Object.keys(oldLabels).includes(key) ? '#000' : '#4699ca' }}>{labelsData[key]}</h3>
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
