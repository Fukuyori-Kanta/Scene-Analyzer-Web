import React from 'react'
import { useMode } from '../Provider/ModeProvider'
import { useAnnotation } from '../Provider/AnnotationProvider'
import AlertError from '../components/Alert/Error'
import AlertWarning from '../components/Alert/Warning'
import { useCurrent } from '../Provider/CurrentProvider'

export default function LabelInpuForm({ videoId }) {
  let { isEditMode } = useMode()  // 現在のモード
  const { addLabelsData, setIsDrawingActive, inputWord, setInputWord, deleteLastLabel, checkWhetherAdd, isDrawingActive } = useAnnotation()
  const { currentScene } = useCurrent()

  // 検索欄に文字入力した時の処理
  const changeHandler = (event) => {
    // 入力単語を設定
    setInputWord(event.target.value)
  }

  // 追加ボタンを押した時の処理
  const clickHandler = async () => {
    // 入力単語が設定されている かつ 新規矩形描画を行っていない場合のみ
    if (inputWord && !isDrawingActive) {
      // 追加するかチェック（入力単語がラベル一覧に存在するか判定）
      let addingLabel = await checkWhetherAdd(inputWord)

      // 追加できる場合
      if (addingLabel) {
        // 動画IDとシーン数を追加
        addingLabel["video_id"] = videoId
        addingLabel["scene_no"] = 'scene_' + String(currentScene)
        
        // 入力ラベルを追加
        addLabelsData(addingLabel)

        // 新規描画を開始
        setIsDrawingActive(true)
      }
      // 追加できない場合
      else {
        const errorData = {
          title: '入力したラベルは追加できません',
          text: '他のラベル名で追加するか、追加しなくても大丈夫なラベルです。',
          footer: '<a href="/test">ラベル一覧</a>'
        }
        // エラーメッセージを表示
        AlertError(errorData)
      }
    }
    // 新規矩形の描画中の時は警告
    if (isDrawingActive) {
      const warningData = {
        title: '描画中のラベルがあります',
        text: '矩形の描画を破棄しますか',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: '破棄',
        cancelButtonText: '矩形の描画に戻る'
      }

      const confirmFunc = () => {
        // 新規描画を終了
        setIsDrawingActive(false)

        // 直近で通過されたラベルデータを削除
        deleteLastLabel()
      }
      // 警告メッセージを表示
      AlertWarning(warningData, confirmFunc)
    }
  }

  // 入力欄でEnterキーを押した時の処理
  // 追加ボタン押下と同じ処理
  const EnterHandler = (event) => {
    if (event.key == 'Enter') {
      clickHandler()
    }
  }

  return (
    <div id="input-area">
      {isEditMode
        ? <>
          <input
            id="input-word"
            type="text"
            size="25"
            placeholder="ラベル名を入力して下さい"
            onChange={changeHandler}
            onKeyPress={EnterHandler}
            value={inputWord}
          />
          <div className="add-btn" onClick={clickHandler}><p>追加</p></div>
        </>
        : <>
        </>
      }
    </div>
  )
}