import React, { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown'
import { Link } from 'react-router-dom'
import LoginUserName from "./LoginUserName"

export default function DropdownMenu() {
  const [userName, setUserName] = useState('')  // ログイン時のユーザー名
  const [isOpen, setIsOpen] = useState(false)   // ドロップダウンメニューのOnOff制御
  const dropdownRef = useRef()                  // ドロップダウンメニューの要素

  // ユーザー名を取得する処理
  useEffect(() => {
    (async () => {
      const userName= await getUserName()
      setUserName(userName)
    })()
  }, [])

  // ドロップダウンメニューの処理
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  
  // ログイン時のユーザー名を取得する関数
  const getUserName = async () => {
    let res = await fetch(`/api/getUserName/`)
    let results = await res.json()

    return results.user
  }

  // 他の要素をクリックした時の処理
  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false)
    }
  }
  
  return (
    <div className="right-side" ref={dropdownRef}>
      <LoginUserName userName={userName} />
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
            <Link to={'/logout'}>
              <p>ログアウト</p>
            </Link>
          </li>
        </ul>
      )}
    </div>
  )
}