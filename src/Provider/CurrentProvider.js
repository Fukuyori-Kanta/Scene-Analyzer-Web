import React, { createContext, useState, useContext } from 'react'
import { useMode } from './ModeProvider'
import AlertError from '../components/Alert/Error'

const CurrentContext = createContext()
export const useCurrent = () => useContext(CurrentContext)

export default function CurrentProvider({ children }) {
  const [currentScene, setCurrentScene] = useState(1) // 現在のシーン数
  const [currentLabel, setCurrentLabel] = useState(0) // 現在クリックされているラベルID（0が初期値）
  let { isEditMode } = useMode()  // 現在のモード

  // 現在のシーン数を変更する関数
  const changeCurrentScene = (cnt) => {
    // 「編集」モードで別シーンをクリックした場合、
    // 遷移せずにメッセージを表示
    if (isEditMode) {
      const errorData = {
        title: "変更内容を保存して下さい", 
        icon: "error",
        text: "[保存]ボタンを押してからシーンを切り替えて下さい"
      }
      // エラーメッセージ
      AlertError(errorData)
    }
    else {
      setCurrentScene(cnt)
    }
  }

  // 現在クリックされているラベルを変更する関数
  const changeCurrentLabel = (cnt) => {
    setCurrentLabel(cnt)
  }
    
  // 現在クリックされているラベルを初期化する関数
  const initCurrentLabel = () => {
    setCurrentLabel(0)
  }

  return (
    <CurrentContext.Provider value={{ currentScene, changeCurrentScene, currentLabel, changeCurrentLabel, initCurrentLabel }}>
      {children}
    </CurrentContext.Provider>
  )
}
