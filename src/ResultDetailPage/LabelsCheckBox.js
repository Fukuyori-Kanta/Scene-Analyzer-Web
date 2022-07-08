import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNowTime } from '../Provider/hooks'

export default function LabelsCheckBox({ videoId }) {
  const [labelsChecked, setLabelsChecked] = useState(false) // ラベルがチェック済みであるかどうか
  const [userCheck, setUserCheck] = useState(false) // ユーザーがチェックしたかどうか

  useLayoutEffect(() => {
    (async () => {
      const isChecked = await isLabelsChecked()
      setLabelsChecked(isChecked)
    })()
  }, [])

  useEffect(() => {
    if (labelsChecked && userCheck) {
      // チェック済みCMとして保存
      postLabelsChecked()
      setUserCheck(false)
    }
  }, [labelsChecked])

  // チェックボックスを変更した時の処理
  const changeHandler = () => {
    // チェック処理
    setUserCheck(true)
    setLabelsChecked(!labelsChecked)
  }

  // 表示中のCMがチェック済みであるかどうか確認する関数
  const isLabelsChecked = async () => {
    const userName = await getUserName() // ユーザー名の取得
    const userId = await getLoggingInUser(userName)

    let res = await fetch(`/api/getLabelsCheckedCM/` + userId)
    let results = await res.json()
    let labelsCheckedCM = results.map(item => { return item.video_id })

    // チェック済みCMの場合チェックを入れる
    if (labelsCheckedCM.includes(videoId)) {
      return true
    }
    else {
      return false
    }
  }

  // ログイン時のユーザー名を取得する関数
  const getUserName = async () => {
    let res = await fetch(`/api/getUserName/`)
    let results = await res.json()

    return results.user
  }

  // ログイン中のユーザーのIDを取得する関数
  const getLoggingInUser = async (userName) => {
    let res = await fetch(`/api/getLoggingInUserId/` + userName)
    let results = await res.json()

    return results[0].user_id
  }

  // チェックした動画とユーザー、時刻を送信する関数
  const postLabelsChecked = async () => {
    const userName = await getUserName() // ユーザー名の取得
    // ゲストアカウントの場合は何もしない
    if (userName == 'guest') {
      return
    }

    const userId = await getLoggingInUser(userName)
    const timestamp = useNowTime()
    console.log({ 'user_id': userId, 'video_id': videoId, 'checked_time': timestamp });

    const response = await fetch(`/api/postLabelsChecked`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ "data": [{ 'user_id': userId, 'video_id': videoId, 'checked_time': timestamp }] })
    })
    if (response.status == 200) {
      console.log('DBへの保存が成功しました')
    }
    else {
      console.log('DBへの保存が失敗しました');
    }
  }

  return (
    <label className="ECM_CheckboxInput">
      <input className="ECM_CheckboxInput-Input" type="checkbox" checked={labelsChecked} onChange={changeHandler} />
      <span className="ECM_CheckboxInput-DummyInput"></span>
      <span className="ECM_CheckboxInput-LabelText">Labels ALL Correct</span>
    </label>
  )
}