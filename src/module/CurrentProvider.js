import React, { createContext, useState, useContext } from "react";

const CurrentContext = createContext();
export const useCurrent = () => useContext(CurrentContext);

export default function CurrentProvider({ children }) {
  const [currentScene, setCurrentScene] = useState(1);
  const [currentLabel, setCurrentLabel] = useState(0);

  const changeCurrentScene = (cnt) =>
    setCurrentScene(cnt);

  const changeCurrentLabel = (cnt) =>
    setCurrentLabel(cnt);

  return (
    <CurrentContext.Provider value={{ currentScene, changeCurrentScene, currentLabel, changeCurrentLabel }}>
      {children}
    </CurrentContext.Provider>
  )
}
