import React from "react"
import { Fetch } from "../Provider/Fetch"
import Breadcrumbs from '../components/Breadcrumbs'
import SubTitle from '../components/SubTitle'

export default function UserPage() {
  return (
    <Fetch
      uri={`/api/getUserName`}
      renderSuccess={UserPageContents}
    />
  )
}

function UserPageContents({ data }) {
  const userName = data.user  // ユーザー名
  
  return (
    <div className="user-page">
      <Breadcrumbs />
      <SubTitle heading="ユーザーページ" />
      <div className="greeting">ようこそ {userName} さん</div>
    </div>
  )
}
