import React, { useState, useCallback, useEffect } from 'react'

/* ヘルプアイコン */
export default function HelpIcon() {
  const [isModalOpen, setIsModalOpen] = useState(false)  // ツールチップの表示判定

  // 他の要素をクリックしたら閉じる
  useEffect(() => {
    return () => {
      document.removeEventListener('click', closeModal)
    }
  }, [closeModal])

  // 閉じる時の処理
  const closeModal = useCallback(() => {
    // モーダルウィンドウを非表示
    setIsModalOpen(false)
    document.removeEventListener('click', closeModal)
  }, [])

  // 表示する時の処理
  const openModal = (event) => {
    // モーダルウィンドウを表示
    setIsModalOpen(true)
    document.addEventListener('click', closeModal)
    event.stopPropagation()
  }

  return (
    <div className="help-area">
      <div className="help-icon" onClick={(event) => { openModal(event) }}>?</div>
      {isModalOpen ? 
        <div className="tooltip" onClick={(event) => { closeModal(event) }}>
          これまで分析してきた１０００ＣＭの分析結果を閲覧できます。<br />
          気になるＣＭがあればクリックして確認してみてください。
          {/* <a href="/help">詳細</a> */}
        </div>
        : ""
      }
    </div>
  )
}