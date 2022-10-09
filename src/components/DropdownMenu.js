import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useLoggingInUser } from '../Provider/hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown'
import { Link } from 'react-router-dom'
import LoginUserName from './LoginUserName'
import AlertSuccess from '../components/Alert/Success'
import AlertError from '../components/Alert/Error'
import { useNavigate } from 'react-router'

export default function DropdownMenu() {
  const [userInfo, setLoggingInUserInfo] = useLoggingInUser()  // ログイン時のユーザー情報
  const [isOpen, setIsOpen] = useState(false)   // ドロップダウンメニューのOnOff制御
  const dropdownRef = useRef()                  // ドロップダウンメニューの要素
  const navigate = useNavigate()  // ページ遷移用

  // ログイン中のユーザー情報を設定
  useLayoutEffect(() => {
    (async () => {
      await setLoggingInUserInfo()
    })()
  }, [])

  // ドロップダウンメニューの処理
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // 他の要素をクリックした時の処理
  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false)
    }
  }

  // ログアウトを実行する関数
  const logOutUser = async () => {

    // ユーザー情報を送信
    const response = await fetch(`/api/logout`, { method: 'POST' })
    console.log(response);

    // ログインに成功した場合、ユーザーページに遷移
    if (response.status == 200) {
      const successData = {
        title: 'ログアウト成功',
        text: 'ゲストアカウントに移行します',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000
      }
      // 登録成功メッセージを表示
      AlertSuccess(successData)

      // ユーザーページに遷移
      setTimeout(async () => {
        navigate(0)
      }, 1.5 * 1000)
    }
    // ログインに失敗した場合、エラーメッセージを表示
    else {
      AlertError({ title: 'ログアウトに失敗しました', text: '既にログアウトされています', })
    }
  }

  return (
    <div className="right-side" ref={dropdownRef}>
      <LoginUserName userName={userInfo.user_name} />
      <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => setIsOpen(isOpen ? false : true)} />
      {isOpen && (
        <ul
          className="dropdown-menu"
          onBlur={() => setTimeout(() => setIsOpen(false), 100)}
          ref={dropdownRef}
          tabIndex={1}
        >
          <li className="dropdown-list">
            <Link to={'/user'}>
              <p>ユーザーページ</p>
            </Link>
          </li>
          <li className="dropdown-list">
            <Link to={'/login'}>
              <p>他のユーザーでログイン</p>
            </Link>
          </li>
          <li className="dropdown-list">
              <p onClick={logOutUser}>ログアウト</p>
          </li>
        </ul>
      )}
    </div>
  )
}