import React, { useState, useEffect, useRef } from 'react'
import { useCurrent } from '../Provider/CurrentProvider'
import { useMode } from '../Provider/ModeProvider'
import FavoChart from './FavoChart'
import AnnotationButtonArea from './AnnotationButtonArea'
import LabelInpuForm from './LabelInpuForm'
import { useAnnotation } from '../Provider/AnnotationProvider'
import { useCanvas } from '../Provider/CanvasProvider'
import { v4 as uuidv4 } from 'uuid'
import useOnClickOutside from '../Provider/useOnClickOutside'
import AlertError from '../components/Alert/Error'

export default function LabelScreen({ data }) {
  const [isLabelEdit, setIsLabelEdit] = useState(false)
  const [editLabel, setEditLabel] = useState('')

  const { currentScene, currentLabel, changeCurrentLabel } = useCurrent()
  const { labelsData, setLabelsData, oldLabels, setOldLabels, updateLabelsData, deleteLabelData, checkWhetherAdd } = useAnnotation()
  const { checkedLabel, updateLabel, deleteRect, makeUnselectedAll } = useCanvas()
  const { isEditMode } = useMode()

  let LabelsDataForSetting = {} // 設定用のラベルデータ

  // 要素の外側をクリックしたらラベル編集状態を解除
  let ref = useRef()
  useOnClickOutside(ref, () => setIsLabelEdit(false))

  // シーンが変わった時の処理
  useEffect(() => {
    // ラベルデータの抽出
    let preprocessingData = data.filter(item => item.scene_no == 'scene_' + currentScene)  // ラベルデータ

    // 並び替え（物体ラベルが先、動作ラベルが後）
    preprocessingData = preprocessingData.filter(item => item.label_id[0] == 'N').concat(preprocessingData.filter(item => item.label_id[0] == 'V'))

    // ラベルデータを更新
    preprocessingData.forEach(item => {
      LabelsDataForSetting[uuidv4()] = item
    })

    // ラベルデータの設定
    setLabelsData(LabelsDataForSetting)
    setOldLabels(LabelsDataForSetting)

    // 設定用を初期化
    LabelsDataForSetting = {}
  }, [currentScene])

  // ラベルクリック時の処理（シングルクリック）
  const onClickHandler = (labelId, currentId) => {
    if (isEditMode) {
      // 現在の選択ラベルを変更
      changeCurrentLabel(currentId)

      // 物体ラベルの時、矩形も選択状態にする
      if (labelId[0] == 'N') {
        checkedLabel(currentId)
      }
      else {
        // 全矩形非選択状態にする
        makeUnselectedAll()
      }
    }
  }

  // ラベルクリック時の処理（ダブルクリック）
  const onDoubleClickHandler = (labelId, currentId, event) => {
    // 該当ラベルを選択状態にする（シングルクリック時の処理も行う）
    onClickHandler(labelId, currentId)

    // ラベル編集状態にする
    setIsLabelEdit(true)
    setEditLabel(labelsData[currentId].label_name_ja)
  }

  // ラベルクリックハンドラ（クリック回数によって処理を分ける）
  const labelClickHandler = (onClick, onDblClick, delay) => {
    var timeoutID = null
    delay = delay || 200
    return function (event) {
      if (!timeoutID) {
        timeoutID = setTimeout(function () {
          onClick(event)
          timeoutID = null
        }, delay)
      } else {
        timeoutID = clearTimeout(timeoutID)
        onDblClick(event)
      }
    }
  }

  // ラベル削除時の処理
  const deleteHandler = (labelId, currentId) => {
    // 表示しているラベルを削除
    deleteLabelData(currentId)

    // 物体ラベルの時、矩形も削除する
    if (labelId[0] == 'N') {
      deleteRect(currentId)
    }
  }

  // Enterキー押下時の処理
  const enterHandler = async (event, currentId) => {
    if (event.key == 'Enter') {

      // event.preventDefault()
      // event.stopPropagation()

      // 編集状態を解除
      setIsLabelEdit(false)

      const editingLabel = await checkWhetherAdd(editLabel)
      console.log(editingLabel)

      // 編集できる場合
      if (editingLabel) {
        // 編集ラベルを更新
        updateLabelsData(currentId, editingLabel)

        // バウンディングボックスのテキスト内容を更新
        updateLabel(currentId, editingLabel.label_name_ja)
      }
      // 追加できない場合
      else {
        const errorData = {
          title: '編集したラベルは更新できません',
          icon: 'error',
          text: '他のラベル名で編集して下さい。'
        }
        // エラーメッセージを表示
        AlertError(errorData)
      }
    }
  }

  // ラベルデータの表示
  const labels = Object.keys(labelsData).map(key => {
    const labelId = labelsData[key].label_id[0] // ラベルID
    const score = (labelsData[key].recognition_score * 100).toFixed(2) // 認識スコア（％表示）

    // 選択中ラベルの場合、赤枠で強調，削除ボタンを表示
    if (currentLabel === key) {
      return (
        <div className="label-item"
          key={key}
          onClick={
            labelClickHandler(() => { onClickHandler(labelId, key) }, () => { onDoubleClickHandler(labelId, key) })
          }
        >
          {/* ラベルデータ（赤枠強調） */}
          {
            isLabelEdit
              ?
              // ラベル編集用の入力欄
              <input
                ref={ref}
                type="text"
                className="textbox"
                value={editLabel}
                onChange={(event) => { setEditLabel(event.target.value) }}
                onKeyDown={(event) => { enterHandler(event, key) }}
                onFocus={(event) => { event.target.select() }}
              />
              :
              <>
                <h3 className={(labelId[0] == 'V') ? "action-label" : "label"}
                  style={{ border: '2px solid #F33', color: Object.keys(oldLabels).includes(key) ? '#000' : '#4699ca' }}>
                  {labelsData[key].label_name_ja}
                </h3>
                {/* 削除ボタン */}
                <div className="delete-btn" onClick={() => deleteHandler(labelId, key)}>
                  <span>×</span>
                </div>
                {/* 認識スコア */}
                {isEditMode && <p className='score'>{score}%</p>}
              </>
          }
        </div>
      )
    } else {
      return (
        <div className="label-item"
          key={key}
          onClick={
            labelClickHandler(() => { onClickHandler(labelId, key) }, () => { onDoubleClickHandler(labelId, key) })
          }
        >
          {/* ラベルデータ */}
          <h3 className={(labelId[0] == 'V') ? "action-label" : "label"}
            style={{ color: Object.keys(oldLabels).includes(key) ? '#000' : '#4699ca' }}>
            {labelsData[key].label_name_ja}
          </h3>

          {/* 認識スコア */}
          {isEditMode && <p className='score'>{score}%</p>}
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
