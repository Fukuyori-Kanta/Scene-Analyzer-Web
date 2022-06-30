import React from "react"
import { Fetch } from "../Provider/Fetch"
import Breadcrumbs from '../components/Breadcrumbs'
import SubTitle from '../components/SubTitle'

export default function LoginPage() {
  return (
    // <Fetch
    //   uri={`/api/login`}
    //   renderSuccess={LoginPageContents}
    // />
    <LoginPageContents />

  )
}

function LoginPageContents() {

  const style = {
    maxWidth: "300px"
  }
  /* 各種データの表示 */
  return (
    <div className="login-container">
      <h1>Login Page</h1>
      <form role="form" action="/login" method="post">
        <div className="form-group">
          <input type="text" name="username" placeholder="Enter Username" className="form-control" />
        </div>
        <div className="form-group">
          <input type="password" name="password" placeholder="Password" className="form-control" />
        </div>
        <button type="submit" className="submit-btn">Submit
        </button>
        <a href="/">
          <button type="button" className="cancel-btn">Cancel
          </button></a>
      </form>
    </div>

  )
}
