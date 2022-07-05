﻿import React, { useEffect, useState } from "react"
import LoginUserName from "./LoginUserName"

export default function NaviMenu({ title, values, herf }) {
  const [userName, setUserName] = useState('')  // ログイン時のユーザー名

  useEffect(() => {
    (async () => {
      const UserName= await getUserName()
      setUserName(UserName)
    })()
  }, [])

  // ログイン時のユーザー名を取得する関数
  const getUserName = async () => {
    let res = await fetch(`/api/getUserName/`)
    let results = await res.json()

    return results.user
  }
  
  // 遷移先のページ名とパスの対応リスト作成関数
  const zip = (...arrays) => {
    const length = Math.min(...(arrays.map(arr => arr.length)))
    return new Array(length).fill().map((_, i) => arrays.map(arr => arr[i]))
  }

  const items = zip(values.split(","), herf.split(",")) // 遷移先のページ名とパスの対応リスト
  const itemsObj = items.map(
    (item) => {
      return (
        <li key={item[0]}>
          <a href={item[1]}>{item[0]}</a>
        </li>
      )
    }
  )

  // タイトルが無い時の処理
  if (!title) {
    title = "LIST"
  }

  return (
    <div className="left-side">
      <h1 className="headline"><a href="/top">{title}</a></h1>
      <ul className="main-nav">{itemsObj}</ul>
      <LoginUserName userName={userName} />
    </div>)
}