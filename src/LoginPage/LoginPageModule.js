import React, { useState } from "react"
import Breadcrumbs from '../components/Breadcrumbs'
import SubTitle from '../components/SubTitle'
import AlertSuccess from '../components/Alert/Success'
import AlertError from '../components/Alert/Error'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router'

export default function LoginPage() {
  return (
    <LoginPageContents />
  )
}

function LoginPageContents() {
  const [formData, setFormData] = useState({ username: '', password: '' })  // フォームデータ
  const navigate = useNavigate()  // ページ遷移用

  // フォームデータを更新する関数
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // ログインを実行する関数
  const requestLogin = async (e) => {
    e.preventDefault()

    // ユーザー情報を送信
    const response = await fetch(`/api/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData)
    })

    // ログインに成功した場合、ユーザーページに遷移
    if (response.status == 200) {
      const successData = {
        title: 'ログイン成功',
        text: 'ユーザーページに遷移します',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000
      }
      // 登録成功メッセージを表示
      AlertSuccess(successData)

      // ユーザーページに遷移
      setTimeout(async () => {
        navigate('/user/')
      }, 2 * 1000)
    }
    // ログインに失敗した場合、エラーメッセージを表示
    else {
      AlertError({ title: 'ログインに失敗しました', text: 'ユーザー名 もしくは パスワードが違います。', })
    }
  }

  /* 各種データの表示 */
  return (
    <div className="login-container">
      <Breadcrumbs />
      <SubTitle heading="ログインページ" />

      <form className="form-container" onSubmit={requestLogin}>
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
