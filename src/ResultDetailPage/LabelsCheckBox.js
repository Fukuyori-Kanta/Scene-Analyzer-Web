import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useNowTime, useLoggingInUser } from '../Provider/hooks'

export default function LabelsCheckBox({ videoId }) {
  const [userInfo, setLoggingInUserInfo] = useLoggingInUser()  // ログイン時のユーザー情報
  const [labelsChecked, setLabelsChecked] = useState(false)    // ラベルがチェック済みであるかどうか
  const [userCheck, setUserCheck] = useState(false)            // ユーザーがチェックしたかどうか

  // チェック済みかどうかを取得
  useLayoutEffect(() => {
    (async () => {
      const isChecked = await isLabelsChecked()
      setLabelsChecked(isChecked)
    })()
  }, [])

  // ログイン中のユーザー情報を設定
  useLayoutEffect(() => {
    setLoggingInUserInfo()
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
    const userId = userInfo.user_id     // ユーザーID

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

  // チェックした動画とユーザー、時刻を送信する関数
  const postLabelsChecked = async () => {
    const userId = userInfo.user_id     // ユーザーID
    const userName = userInfo.user_name // ユーザー名

    // ゲストアカウントの場合は何もしない
    if (userName == 'guest') {
      return
    }

    const timestamp = useNowTime()      // 現在時刻
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