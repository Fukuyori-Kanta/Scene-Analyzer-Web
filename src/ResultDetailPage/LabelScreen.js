import React, { useState, useEffect } from 'react'
import { useCurrent } from '../Provider/CurrentProvider'
import { useMode } from "../Provider/ModeProvider"
import FavoChart from './FavoChart'
import AnnotationButtonArea from './AnnotationButtonArea'
import LabelInpuForm from './LabelInpuForm'
import { useAnnotation } from '../Provider/AnnotationProvider'
import { useCanvas } from '../Provider/CanvasProvider'
import { v4 as uuidv4 } from 'uuid'

export default function LabelScreen({ data }) {

  const { currentScene, currentLabel, changeCurrentLabel } = useCurrent()
  const { labelsData, setLabelsData, oldLabels, setOldLabels, deleteLabelData } = useAnnotation()
  const { checkedLabel, deleteRect } = useCanvas()
  const { isEditMode } = useMode()

  let l = {}

  useEffect(() => {
    // ラベルデータの抽出
    let preprocessingData = data.filter(item => item.scene_no == 'scene_' + currentScene)  // ラベルデータ

    // 並び替え（物体ラベルが先、動作ラベルが後）
    preprocessingData = preprocessingData.filter(item => item.label_id[0] == 'N').concat(preprocessingData.filter(item => item.label_id[0] == 'V'))

    // ラベルデータを更新
    preprocessingData.forEach(d => {
      l[uuidv4()] = d
    });

    setLabelsData(l)
    setOldLabels(l)
    l = {}
  }, [currentScene])

  // ラベルクリック時の処理
  const changeHandler = (labelId, currentId) => {
    if (isEditMode) {
      // 現在の選択ラベルを変更
      changeCurrentLabel(currentId)

      // 物体ラベルの時、矩形も選択状態にする
      if (labelId[0] == 'N') {
        checkedLabel(currentId)
      }
    }
  }

  // ラベル削除時の処理
  const deleteHandler = (labelId, key) => {
    // 表示しているラベルを削除
    deleteLabelData(key)

    // 物体ラベルの時、矩形も削除する
    if (labelId[0] == 'N') {
      deleteRect(key)
    }
  }

  // ラベルデータの表示
  let labels = Object.keys(labelsData).map((key, index) => {
    const labelId = labelsData[key].label_id[0] // ラベルID

    if (currentLabel == index + 1) {
      return (
        <div className="label-item" data-label_id={index + 1}
          key={index + 1}
          onClick={() => changeHandler(labelId, index + 1)}>
          <h3 className={(labelId[0] == 'V') ? "action-label" : "label"}
            style={{ border: '2px solid #F33', color: Object.keys(oldLabels).includes(key) ? '#000' : '#4699ca' }}>
            {labelsData[key].label_name_ja}
          </h3>
          <div className="delete-btn" onClick={() => deleteHandler(labelId, key)}>
            <span>×</span>
          </div>
        </div>
      )
    } else {
      return (
        <div className="label-item" data-label_id={index + 1}
          key={index + 1}
          onClick={() => changeHandler(labelId, index + 1)}>
          <h3 className={(labelId[0] == 'V') ? "action-label" : "label"}
            style={{ color: Object.keys(oldLabels).includes(key) ? '#000' : '#4699ca' }}>
            {labelsData[key].label_name_ja}
          </h3>
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
