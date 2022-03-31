import React, { createContext, useState, useContext, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const AnnotationContext = createContext()
export const useAnnotation = () => useContext(AnnotationContext)

export default function AnnotationProvider({ children }) {
  const [labelsData, setLabelsData] = useState({})   // ラベルデータ
  const [oldLabels, setOldLabels] = useState({})     // ラベルデータの初期値

  const [isDrawingActive, setIsDrawingActive] = useState(false) // 新規描画を行うかどうか
  const [inputWord, setInputWord] = useState('')  // 入力単語（ラベル名）

  // ラベルの追加する関数
  const addLabelsData = (addingLabel) => {
    setLabelsData({ ...labelsData, [uuidv4()]: addingLabel })
  }

  // ラベルの更新する関数
  const updateLabelsData = (id, editingLabel) => {
    let tempData = { ...labelsData }  // ラベルデータのコピー
    
    // 同じラベルなら何もしない
    if (tempData[id].label_id == editingLabel.label_id) {
      return 
    }

    // ラベル情報を更新
    tempData[id].label_id = editingLabel.label_id
    tempData[id].label_name_ja = editingLabel.label_name_ja
    tempData[id].label_name_en = editingLabel.label_name_en
    setLabelsData(tempData)
  }

  // 矩形データの更新する関数
  const updateRectData = (id, coordinate) => {
    let tempData = { ...labelsData }  // ラベルデータのコピー
    
    // ラベル情報を更新
    tempData[id].x_axis = coordinate[0]
    tempData[id].y_axis = coordinate[1]
    tempData[id].width  = coordinate[2]
    tempData[id].height = coordinate[3]
    setLabelsData(tempData)
  }

  // ラベルデータを初期化する関数
  const resetLabelData = () => {
    setLabelsData(oldLabels)
  }

  // 特定のラベルデータを削除する関数
  const deleteLabelData = (id) => {
    let tempData = { ...labelsData }  // ラベルデータのコピー
    delete tempData[id] // 該当IDのラベルを削除
    setLabelsData(tempData)
  }

  // ラベル一覧に存在するか判定する関数
  const checkWhetherAdd = async (labelName) => {
    let res = await fetch(`/api/isAddable/` + labelName)
    let results = await res.json()

    // 追加できる場合はラベル一覧のデータを返し、
    // 追加できない場合は空の配列を返す
    return results[0]
  }

  // ラベルデータをサーバーに送信する関数
  const sendAnnotationData = () => {
    // 更新されている時のみ
    if (oldLabels == labelsData ) {
      console.log("更新されていない")
      return
    }
    // 更新情報を設定
    setOldLabels(labelsData)
  }

  return (
    <AnnotationContext.Provider value={{
      labelsData,
      setLabelsData,
      oldLabels,
      setOldLabels,
      isDrawingActive,
      setIsDrawingActive,
      inputWord,
      setInputWord,
      addLabelsData,
      updateLabelsData, 
      updateRectData, 
      resetLabelData,
      deleteLabelData,
      checkWhetherAdd,
      sendAnnotationData
    }}>
      {children}
    </AnnotationContext.Provider>
  )
}
