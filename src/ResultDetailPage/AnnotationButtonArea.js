import React from 'react'
import { useMode } from '../Provider/ModeProvider'
import { useCurrent } from '../Provider/CurrentProvider'
import { useAnnotation } from '../Provider/AnnotationProvider'

export default function AnnotationButtonArea() {
  let { isEditMode, makeEditMode, makeViewMode } = useMode()  //  現在のモード
  let { initCurrentLabel } = useCurrent()   // 現在選択されているラベル
  let { resetLabelData } = useAnnotation()  // ラベルデータ

  // [編集]ボタンクリック時の処理
  const clickEditBtn = () => {
    // 編集モードに変更
    makeEditMode()
  }

  // [保存]ボタンクリック時の処理
  const clickSaveBtn = () => {
    // 表示モードに変更
    makeViewMode()

    // ラベル選択IDを初期化
    initCurrentLabel()
    
    // アノテーション結果を送信
    sendAnnotationData()
  }

  // [キャンセル]ボタンクリック時の処理
  const clickCancelBtn = () => {
    // 表示モードに変更
    makeViewMode()
    
    // ラベル選択IDを初期化
    initCurrentLabel()
    
    // ラベルデータを初期化
    resetLabelData()
  }

  return (
    <div className="annotation-area">
      <h2 className="tag">このシーンのラベル一覧</h2>
      <div className="button-area" >
        <div className="edit-btn" style={{ display: isEditMode ? 'none' : '' }} onClick={clickEditBtn}>
          <p>編集</p>
        </div>
        <div className="save-btn" style={{ display: isEditMode ? '' : 'none' }} onClick={clickSaveBtn}>
          <p>保存</p>
        </div>
        <div className="cancel-btn" style={{ display: isEditMode ? '' : 'none' }} onClick={clickCancelBtn}>
          <p>キャンセル</p>
        </div>
      </div>
    </div>
  )
}