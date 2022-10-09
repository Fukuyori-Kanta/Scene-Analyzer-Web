import { useState, useEffect, useCallback } from 'react'
import { formatToTimeZone } from 'date-fns-timezone'

// 該当のURIの結果を返すカスタムフック
export function useFetch(uri) {
  const [data, setData] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uri) return
    fetch(uri)
      .then(data => data.json())
      .then(setData)
      .then(() => setLoading(false))
      .catch(setError)
  }, [uri])

  return {
    loading,
    data,
    error
  }
}

// 現在の日付を返すカスタムフック
export function useNowDate() {
  return formatToTimeZone(new Date(), 'YYYY-MM-DD', { timeZone: 'Asia/Tokyo' })
}

// 現在の日付・時刻を返すカスタムフック
export function useNowTime() {
  return formatToTimeZone(new Date(), 'YYYY-MM-DD HH:mm:ss', { timeZone: 'Asia/Tokyo' })
}

// 初期ユーザー 
const initialUser = {
  user_id: 5,
  user_name: 'guest'
}

// ログイン中のユーザー情報に関するカスタムフック
export function useLoggingInUser() {
  const [userInfo, setUserInfo] = useState(initialUser)  // ログイン中のユーザー情報（ID, 名前）

  // ログイン中のユーザー情報を設定する関数
  const setLoggingInUserInfo = async () => {
    let res = await fetch(`/api/getUserInfo/`)
    let userInfo = await res.json()

    setUserInfo(userInfo)
  }

  return [userInfo, setLoggingInUserInfo]
}