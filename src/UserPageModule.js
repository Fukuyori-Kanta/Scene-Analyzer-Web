import React from "react"
import { Fetch } from "./Provider/Fetch"

export default function UserPage() {
  return (
    <Fetch
      uri={`/api/getUserName`}
      renderSuccess={UserPageContents}
    />
  )
}

function UserPageContents({ data }) {

  const style = {
    maxWidth: "300px"
  }
  console.log(data);
  /* 各種データの表示 */
  return (
    <div className="login-container">
      <h1>User Page</h1>
      <div>{data.user}</div>
    </div>

  )
}
