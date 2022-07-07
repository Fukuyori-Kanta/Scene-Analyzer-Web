import React, { useEffect, useState }  from "react"
import { Fetch } from "../Provider/Fetch"
import Breadcrumbs from '../components/Breadcrumbs'
import SubTitle from '../components/SubTitle'
import AlertSuccess from '../components/Alert/Success'
import AlertError from '../components/Alert/Error'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  return (
    <LoginPageContents />
  )
}

function LoginPageContents() {
  const [formData, setFormData] = useState({ username: '', password: '' })  // フォームデータ
  
  // フォームデータを更新する関数
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // ログインを実行する関数
  const requestLogin = async () => {
    console.log(formData);
    // ユーザー情報を送信
    const response = await fetch(`/api/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData)
    })

    // ログインに失敗した場合、エラーメッセージを表示
    if (response.status != 200) {
      AlertError({title: 'ログインに失敗しました', text: 'ユーザー名 もしくは パスワードが違います。', })
    }
  }

  /* 各種データの表示 */
  return (
    <div className="login-container">
      <Breadcrumbs />
      <SubTitle heading="ログインページ" />
      {/* <div className="form-container">
        <div className="form-group">
          <span>ユーザー名</span>
          <input type="text" name="username" placeholder="Enter Username" onChange={handleChange} value={formData.email} />
        </div>
        <div className="form-group">
          <span>パスワード</span>
          <input type="password" name='password' placeholder="Password" onChange={handleChange} value={formData.password} />
        </div>
        <div>
          <button onClick={requestLogin}>ログイン</button>
        </div>
      </div> */}
      <form className="form-container" action="/api/login" method="post">
        <div className="form-group">
          <span>ユーザー名</span>
          <input type="text" name="username" placeholder="Enter Username" onChange={handleChange} value={formData.email} />
        </div>
        <div className="form-group">
          <span>パスワード</span>
          <input type="password" name='password' placeholder="Password" onChange={handleChange} value={formData.password} />
        </div>
        <div>
          <button type="submit">ログイン</button>
        </div>
      </form>
      
      <p className="regist-guidance">
        未登録の方は
        <Link to={'/regist'}>
          <span className="link">こちら</span>
        </Link>
        から登録してください
      </p>
    </div>
  )
}
