import React from "react"
import { useMode } from './ModeProvider'
import { useCurrent } from './CurrentProvider'
import { useAnnotation } from './AnnotationProvider'

export default function AnnotationButtonArea() {
  let { isEditMode, makeEditMode, makeViewMode } = useMode();
  let { currentScene, changeCurrentLabel } = useCurrent();
  let { labelsData, setLabelsData, oldLabels, setOldLabels, newLables, setNewLabels } = useAnnotation();
  
  function sendAnnotationData() {
    //console.log('送信')
    //console.log(labelsData)
  }

  return (
    <div className="annotation-area">
      <h2 className="heading tag">このシーンのラベル一覧</h2>
      <div className="button-area" >
        <div className="edit-btn" style={{ display: isEditMode ? 'none' : '' }} onClick={() => {makeEditMode(); setOldLabels(labelsData)}}>
          <p>編集</p>
        </div>
        <div className="save-btn" style={{ display: isEditMode ? '' : 'none' }} onClick={() => {makeViewMode(); changeCurrentLabel(0); sendAnnotationData()}}>
          <p>保存</p>
        </div>
        <div className="cancel-btn" style={{ display: isEditMode ? '' : 'none' }} onClick={() => makeViewMode()}>
          <p>キャンセル</p>
        </div>
      </div>
    </div>
  )
}