import React, { useEffect, useLayoutEffect, useState} from 'react'
import { useLoggingInUser } from '../Provider/hooks'
import Thumbnail from './Thumbnail'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'

export default function VideoList({ dataList, id }) {
  const [userInfo, setLoggingInUserInfo] = useLoggingInUser()  // ログイン時のユーザー情報
  const [labelsCheckedCM, setLabelsCheckedCM] = useState([])  // チェック済みCMの一覧

  useLayoutEffect(() => {
    setLoggingInUserInfo()
  }, [])

  useEffect(() => {
    (async () => {
      // ゲストアカウントの場合は何もしない
      if (userInfo.user_name == 'guest') {
        return
      }
      const labelsCheckedCM = await getLabelsCheckedCM(userInfo.user_id)
      setLabelsCheckedCM(labelsCheckedCM)
    })()
  }, [userInfo])

  // チェック済みCMの一覧を取得する関数
  const getLabelsCheckedCM = async (userId) => {
    let res = await fetch(`/api/getLabelsCheckedCM/` + userId)
    let results = await res.json()
    let resultsData = results.map(item => { return item.video_id })

    return resultsData
  }

  // 動画一覧
  const thumbnails = dataList.map(data => {
    const videoId = data.video_id // 動画ID
    const productName = data.product_name // 作品名
    const imgPath = './result/thumbnail/' + videoId + '/thumbnail1.jpg' // サムネ画像のパス

    // チェック済みCMの場合
    if (labelsCheckedCM.includes(videoId)) {
      return (
        <div className="contents" key={videoId}>
          <Thumbnail videoId={videoId} productName={productName} imgPath={imgPath} />
          <div className="icon">
            <FontAwesomeIcon id="check-icon" icon={faCheck} />
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="contents" key={videoId}>
          <Thumbnail videoId={videoId} productName={productName} imgPath={imgPath} />
        </div>
      )
    }
  })

  return (
    <div id={id}>
      {thumbnails}
    </div>
  )
}
