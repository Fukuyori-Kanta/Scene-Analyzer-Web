import React, { useEffect } from "react"
import { useMode } from '../Provider/ModeProvider'
import { useAnnotation } from "../Provider/AnnotationProvider"
import { fabric } from "fabric"

export default function LabelInpuForm() {
  let { isEditMode } = useMode();
  const { labelsData, addLabelsData, oldLabels, setOldLabels, newLables, setNewLabels, isDrawingActive, setIsDrawingActive, inputWord, setInputWord } = useAnnotation()

  /*
  function fetchPost() {
    fetch('http://192.168.204.128/annotation/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: 'user',
        data: 'data'
      })
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          console.warn('Something went wrong on api server!');
        }
      })
      .then(json => {
        //return callback(json)
        console.log(json)
      })
      .catch(error => {
        console.error(error);
      })
  }
  */

  // 検索欄に文字入力した時の処理
  const changeHandler = (event) => {
    setInputWord(event.target.value)
  }

  // 追加ボタンを押した時の処理
  const clickHandler = () => {
    // ラベルを追加
    addLabelsData(inputWord)

    // 新規描画を開始
    setIsDrawingActive(true)
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