import React, { useLayoutEffect } from 'react'
import { useLoggingInUser } from '../Provider/hooks'
import Breadcrumbs from '../components/Breadcrumbs'
import SubTitle from '../components/SubTitle'

export default function UserPage() {
  return (
    <UserPageContents />
  )
}

function UserPageContents() {
  const [userInfo, setLoggingInUserInfo] = useLoggingInUser() // ログイン中のユーザー情報

  // ログイン中のユーザー情報を設定
  useLayoutEffect(() => {
    setLoggingInUserInfo()
  }, [])

  return (
    <div className="user-page">
      <Breadcrumbs />
      <SubTitle heading="ユーザーページ" />
      <div className="greeting">ようこそ {userInfo.user_name} さん</div>
    </div>
  )
}
