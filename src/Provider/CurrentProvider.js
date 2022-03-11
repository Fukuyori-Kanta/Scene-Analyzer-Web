import React, { createContext, useState, useContext } from "react";
import { useMode } from "./ModeProvider"
import AlertError from "../components/Alert/Error"

const CurrentContext = createContext();
export const useCurrent = () => useContext(CurrentContext);

export default function CurrentProvider({ children }) {
  const [currentScene, setCurrentScene] = useState(1);
  const [currentLabel, setCurrentLabel] = useState(0);
  let { isEditMode } = useMode();

  const changeCurrentScene = (cnt) => {
    // 編集モードで別シーンをクリックした場合、
    // 遷移せずに、メッセージを表示
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
      setCurrentScene(cnt);
    }
  }

  const changeCurrentLabel = (cnt) =>
    setCurrentLabel(cnt);

  return (
    <CurrentContext.Provider value={{ currentScene, changeCurrentScene, currentLabel, changeCurrentLabel }}>
      {children}
    </CurrentContext.Provider>
  )
}
