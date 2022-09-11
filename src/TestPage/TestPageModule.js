import React, { useLayoutEffect } from 'react'
import { useLoggingInUser } from '../Provider/hooks'

export default function TestPage() {
  return (
    <TestPageContents />
  )
}

function TestPageContents() {
  const [userInfo, setLoggingInUserInfo] = useLoggingInUser() // ログイン中のユーザー情報

  // ログイン中のユーザー情報を設定
  useLayoutEffect(() => {
    setLoggingInUserInfo()
  }, [])

  const clickEvent = () => {
    setLoggingInUserInfo()
  }

  return (
    <>
      <h1>
        {userInfo.user_name}
      </h1>
      <button onClick={clickEvent}>asd</button>
    </>

  )

}
