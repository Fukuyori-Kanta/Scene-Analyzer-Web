﻿import React from 'react'
import {
  Link,
  useLocation
} from 'react-router-dom'

/* パンくずリスト */
const Breadcrumbs = (props) => {
  const productName = props.productName // 製品名
  let location = useLocation()  // 現在のURL
  let currentPath = '/' + (location.pathname.split('/')[1]) // 現在のパス

  // 結果詳細ページ(/result/:id)の前ページを結果一覧ページ(/results)に設定
  if (currentPath == '/result') {
    currentPath = '/results'
  }
  // ページ毎のURLと表示名
  const pageList = (path) => {
    switch (path) {
      case '/results':
        return '結果一覧'
      case '/statistics':
        return '統計'
      case '/newAnalysis':
        return '新規分析'
      default:
        return 'テスト'
    }
  }
  return (
    <div className="bread">
      <ul>
        <>
          <li><Link to={'/top'}>トップ</Link></li>
          <li><Link to={currentPath}>{pageList(currentPath)}</Link></li>
          {productName && <li>{productName}</li>}
        </>
      </ul>
    </div>
  )
}
export default Breadcrumbs