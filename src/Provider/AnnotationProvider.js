import React, { createContext, useState, useContext } from "react";
import { v4 as uuidv4 } from 'uuid'

const AnnotationContext = createContext();
export const useAnnotation = () => useContext(AnnotationContext);

export default function AnnotationProvider({ children }) {

  const [labelsData, setLabelsData] = useState({})
  const [oldLabels, setOldLabels] = useState({});
  
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const [inputWord, setInputWord] = useState('')  // 入力単語（ラベル名）

  // ラベルの追加処理
  const addLabelsData = (data) => {
    setLabelsData({ ...labelsData, [uuidv4()]: data })
  }

  // ラベルデータを初期化
  const resetLabelData = () => {
    setLabelsData(oldLabels)
  }

  // 特定のラベルデータを削除する
  const deleteLabelData = (id) => {
    let tempData = {...labelsData}  // ラベルデータのコピー
    delete tempData[id] // 該当IDのラベルを削除
    setLabelsData(tempData)
  }

  return (
    <AnnotationContext.Provider value={{ labelsData, setLabelsData, addLabelsData, oldLabels, setOldLabels, isDrawingActive, setIsDrawingActive, inputWord, setInputWord, resetLabelData, deleteLabelData }}>
      {children}
    </AnnotationContext.Provider>
  )
}
