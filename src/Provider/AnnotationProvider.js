import React, { createContext, useState, useContext, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import AlertSuccess from '../components/Alert/Success'
import AlertError from '../components/Alert/Error'
import { useNowDate } from './hooks'

const AnnotationContext = createContext()
export const useAnnotation = () => useContext(AnnotationContext)

export default function AnnotationProvider({ children }) {
  const [labelsData, setLabelsData] = useState({})   // ラベルデータ
  const [oldLabels, setOldLabels] = useState({})     // ラベルデータの初期値
  const [annotationResult, setAnnotationResult] = useState([])  // アノテーション結果
  const [isDrawingActive, setIsDrawingActive] = useState(false) // 新規描画を行うかどうか
  const [inputWord, setInputWord] = useState('')  // 入力単語（ラベル名）


  useEffect(() => {
    console.log(annotationResult)
  }, [annotationResult])


  // アノテーション結果を格納する関数
  const storeAnnotationResult = (annoData, operation) => {
    const date = useNowDate()

    switch (operation) {
      case 'delete':
        console.log('delete');
        setAnnotationResult([...annotationResult, {...annoData, 'operation': 'delete', 'user': 'guest', 'timestamp': date}])
        break
      case 'add':
        console.log('add');
        setAnnotationResult([...annotationResult, {...annoData, 'operation': 'add', 'user': 'guest', 'timestamp': date}])
        break
      case 'edit':
        console.log('edit');
        setAnnotationResult([...annotationResult, {...annoData, 'operation': 'edit', 'user': 'guest', 'timestamp': date}])
        break
      default:
        break
    }
  }

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

    storeAnnotationResult(tempData[id], 'edit')

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
    // アノテーション結果を格納
    storeAnnotationResult(labelsData[id], 'delete')

    // 該当IDのラベルを削除
    let tempData = { ...labelsData }  // ラベルデータのコピー
    delete tempData[id]
    setLabelsData(tempData)
  }

  // 一番最後のラベルデータを削除する関数
  const deleteLastLabel = () => {
    const keysArray = Object.keys(labelsData)
    const len = keysArray.length
    const deleteId = keysArray[len - 1]
    deleteLabelData(deleteId)
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
    // console.log(oldLabels);

    // console.log(labelsData);

    // const array1 = Object.keys(labelsData).map(key => {
    //   return labelsData[key]
    // })

    // const array2 = Object.keys(oldLabels).map(key => {
    //   return oldLabels[key]
    // })

    // const diffLabels = array1.filter(item => JSON.stringify(array2).indexOf(JSON.stringify(item)) < 0); //itemの文字列表現を検索。
    // console.log(diffLabels)

    // タイムアウト時間の設定（15秒）
    // const controller = new AbortController()
    // const timeout = setTimeout(() => { controller.abort() }, option.timeout || 15000)
    // if (diffLabels.length == 0) {
    //   return
    // }

    const response = await fetch(`/api/storeDB`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ "data": annotationResult })
    })

    // 保存に成功した場合は、成功した旨をメッセージで表示
    if (response.status == 200) {
      const successData = {
        title: '保存しました',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      }
      // 保存成功メッセージを表示
      AlertSuccess(successData)
    }
    // 保存に失敗した場合は、エラーメッセージを表示
    else {
      const errorData = {
        title: '保存に失敗しました',
        text: '理由: ',
      }
      // 保存成功メッセージを表示
      AlertError(errorData)
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
      storeAnnotationResult, 
      addLabelsData,
      updateLabelsData,
      updateRectData,
      resetLabelData,
      deleteLabelData,
      deleteLastLabel,
      checkWhetherAdd,
      sendAnnotationData
    }}>
      {children}
    </AnnotationContext.Provider>
  )
}
