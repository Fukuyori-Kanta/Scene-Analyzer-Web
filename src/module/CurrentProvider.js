import React, { createContext, useState, useContext } from "react";

const CurrentContext = createContext();
export const useCurrent = () => useContext(CurrentContext);

export default function CurrentProvider({ children }) {
  const [currentNo, setCurrentNo] = useState(1);

  const changeCurrent = (cnt) =>
    setCurrentNo(cnt);

  return (
    <CurrentContext.Provider value={{ currentNo, changeCurrent }}>
      {children}
    </CurrentContext.Provider>
  )
}
