import React from 'react'
import { useMode } from '../Provider/ModeProvider'
import { useAnnotation } from '../Provider/AnnotationProvider'
import AlertError from '../components/Alert/Error'

export default function LabelInpuForm() {
  let { isEditMode } = useMode()  // 現在のモード
  const { addLabelsData, setIsDrawingActive, inputWord, setInputWord, checkWhetherAdd } = useAnnotation()

  // 検索欄に文字入力した時の処理
  const changeHandler = (event) => {
    // 入力単語を設定
    setInputWord(event.target.value)
  }

  // 追加ボタンを押した時の処理
  const clickHandler = async () => {
    // 追加するかチェック（入力単語がラベル一覧に存在するか判定）
    const addingLabel = await checkWhetherAdd(inputWord)

    // 追加できる場合
    if (addingLabel) {
      // 入力ラベルを追加
      addLabelsData(addingLabel)

      // 新規描画を開始
      setIsDrawingActive(true)
    }
    // 追加できない場合
    else {
      const errorData = {
        title: '入力したラベルは追加できません',
        icon: 'error',
        text: '他のラベル名で追加するか、追加しなくても大丈夫なラベルです。'
      }
      // エラーメッセージを表示
      AlertError(errorData)
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