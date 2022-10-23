import React, { useEffect } from 'react'

export default function UpdateAccessHistory(videoId) {

  // 閲覧履歴を更新する関数
  useEffect(() => {
    (async () => {
      await fetch(`/api/updateAccessHistory/` + videoId.videoId)
    })()
  }, [])

  return (
    <></>
  )
}
