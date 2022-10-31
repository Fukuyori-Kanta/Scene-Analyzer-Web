import React, { useEffect, useState } from 'react'
import Circle from "react-circle"

export default function AnnotationProgressCircle(userId) {
  const [progress, setProgress] = useState(0) // 進捗率
  const [workRange, setWorkRange] = useState({ startIdx: 100, workNum: 100 })  // 作業範囲　[作業開始Index, 作業数]

  // レンダリング時に進捗率を設定する関数
  useEffect(() => {
    const fetchAnnotationProgress = async () => {
      // 作業済みレコード数を取得
      const doneRecordNum = await getAnnotationProgress(userId.userId)

      // 進捗率の設定
      setProgress(Math.trunc(doneRecordNum / workRange.workNum * 100))
    }
    fetchAnnotationProgress()
  }, [])

  // 作業済みレコード数を取得する関数
  const getAnnotationProgress = async (userId) => {
    let res = await fetch(`/api/annotationProgress/` + userId)
    let results = await res.json()

    return results.length
  }

  return (
    <div className="progress-circle">
      <h3 className="circle-title">作業進捗率</h3>
      <Circle
        progress={progress}     // 進捗率
        size={120}              // 円のサイズ
        bgColor="#D3DEF1"       // 残部分の背景色
        animationDuration="1s"  // アニメーション時間
        roundedStroke={true}    // 円の進捗部分に丸みをもたせる
      />
    </div>
  )
}