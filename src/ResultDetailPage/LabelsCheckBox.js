import React, { useState, useEffect, useRef } from 'react'
import { useNowDate } from '../Provider/hooks'

export default function LabelsCheckBox({ videoId }) {
  const [labelsChecked, setLabelsChecked] = useState(false)

  useEffect(() => {
    //console.log('変更したよ');
    
    postLabelsChecked()
  }, [labelsChecked])

  // チェックボックスを変更した時の処理
  const changeHandler = () => {
    // 入力単語を設定
    setLabelsChecked(!labelsChecked)
  }

  // チェック済みであるかどうか確認する関数
  // const isChecked = async (labelName) => {
  //   let res = await fetch(`/api/isAddable/` + labelName)
  //   let results = await res.json()

  //   // 追加できる場合はラベル一覧のデータを返し、
  //   // 追加できない場合は空の配列を返す
  //   return results[0]
  // }

  // チェックした動画とユーザー、時刻を送信する関数
  const postLabelsChecked = async () => {
    if (labelsChecked) {

      const userId = 'U00000'
      const timestamp = useNowDate()
      console.log({'user_id': userId, 'video_id': videoId, 'checked_time': timestamp });

      const response = await fetch(`/api/postLabelsChecked`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ "data": [{'user_id': userId, 'video_id': videoId, 'checked_time': timestamp}] })
      })
      if (response.status == 200) {
        console.log('DBへの保存が成功しました')
      }
      else {
        console.log('DBへの保存が失敗しました');
      }
    }
  }

  return (
    <label className="ECM_CheckboxInput">
      <input className="ECM_CheckboxInput-Input" type="checkbox" checked={labelsChecked} onChange={changeHandler}/>
      <span className="ECM_CheckboxInput-DummyInput"></span>
      <span className="ECM_CheckboxInput-LabelText">Labels ALL Correct</span>
    </label>
  )
}