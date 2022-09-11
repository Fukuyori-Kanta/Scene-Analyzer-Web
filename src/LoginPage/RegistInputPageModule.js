import React, { useState } from 'react'
import Breadcrumbs from '../components/Breadcrumbs'
import SubTitle from '../components/SubTitle'
import AlertSuccess from '../components/Alert/Success'
import AlertError from '../components/Alert/Error'
import { useNowDate } from '../Provider/hooks'
import { useNavigate } from 'react-router'

export default function RegistInputPage() {
  return (
    <RegistInputPageContents />
  )
}

function RegistInputPageContents() {
  const [formData, setFormData] = useState({ username: '', password: '' })  // フォームデータ
  const passwordSize = 6  // 6文字以上
  const navigate = useNavigate()  // ページ遷移用

  // フォームデータを更新する関数
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // ユーザー名が登録できるかを返す関数（出来る: ture, 出来ない: false）
  const checkRegisteredUser = async (userName) => {
    let res = await fetch(`/api/checkRegistered` + userName)
    let results = await res.json()
    // 登録可能な場合
    if (results.length == 0) {
      return true
    }
    else {
      return false
    }
  }

  // ユーザー登録情報を送信する関数
  const sendFormData = async () => {
    // 文字数チェック
    if (formData.username == '') {
      AlertError({ title: '登録できませんでした', text: 'ユーザー名は1文字以上にしてください。', })
      return
    }
    if (formData.password.length <= passwordSize) {
      AlertError({ title: '登録できませんでした', text: 'パスワードは' + passwordSize + '文字以上にしてください。', })
      return
    }

    // ユーザー名の登録チェック
    let isRegistered = await checkRegisteredUser(formData.username)

    // 登録できない場合
    if (!isRegistered) {
      AlertError({ title: '既に登録されているユーザー名です', text: '別のユーザー名で登録してください。', })
      return
    }

    // ユーザー情報を送信
    const response = await fetch(`/api/registUser`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ ...formData, ['creation_date']: useNowDate() })
    })

    // 登録に成功した場合は、成功した旨をメッセージで表示
    if (response.status == 200) {
      const successData = {
        title: '登録が完了しました',
        text: '3秒後、ログインページに遷移します', 
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      }
      // 登録成功メッセージを表示
      AlertSuccess(successData)

      // ログインページに遷移
      setTimeout(() => {
        navigate(`/login/`)
      }, 3 * 1000)
    }
    // 登録に失敗した場合は、エラーメッセージを表示
    else {
      const errorData = {
        title: '登録に失敗しました',
        text: '理由: DB登録エラー',
      }
      // 保存失敗メッセージを表示
      AlertError(errorData)
    }
  }

  /* 各種データの表示 */
  return (
    <div>
      <Breadcrumbs />
      <SubTitle heading="ユーザー登録ページ" />
      <div className="form-container">
        <div className="form-group">
          <span>ユーザー名</span>
          <input type="text" name="username" placeholder="Enter Username" onChange={handleChange} value={formData.email} />
        </div>
        <div className="form-group">
          <span>パスワード</span>
          <input type="password" name='password' placeholder="Password" onChange={handleChange} value={formData.password} />
        </div>
        <div>
          <button onClick={sendFormData}>送信</button>
        </div>
      </div>
    </div>
  )
}
