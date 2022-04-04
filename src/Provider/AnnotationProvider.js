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
    console.log(addingLabel)
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
    if (!(id in tempData)) {
      console.log("新規データ")
      return 
    }
    else {
      console.log("既存データ");
    }
    tempData[id].x_axis = coordinate[0]
    tempData[id].y_axis = coordinate[1]
    tempData[id].width = coordinate[2]
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
  const sendAnnotationData = async () => {
    // 更新されている時のみ
    if (oldLabels == labelsData) {
      console.log("更新されていない")
      return
    }
    console.log(oldLabels);

    console.log(labelsData);

    const array1 = Object.keys(labelsData).map(key => {
      return labelsData[key]
    })

    const array2 = Object.keys(oldLabels).map(key => {
      return oldLabels[key]
    })

    const diffLabels = array1.filter(item => JSON.stringify(array2).indexOf(JSON.stringify(item)) < 0); //itemの文字列表現を検索。
    console.log(diffLabels)

    // タイムアウト時間の設定（15秒）
    // const controller = new AbortController()
    // const timeout = setTimeout(() => { controller.abort() }, option.timeout || 15000)
    if (diffLabels) {
      const response = fetch(`/api/storeDB`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ "data": diffLabels })
      })
  
      console.log(response)
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
