import React, { createContext, useState, useContext } from 'react'

const ModeContext = createContext()
export const useMode = () => useContext(ModeContext)

export default function ModeProvider({ children }) {
  const [isEditMode, setEditMode] = useState(false)

  // 「編集」モードに変更
  const makeEditMode = () =>
    setEditMode(true)
    
  // 「表示」モードに変更
  const makeViewMode = () =>
    setEditMode(false)

  return (
    <ModeContext.Provider value={{ isEditMode, makeEditMode, makeViewMode }}>
      {children}
    </ModeContext.Provider>
  )
}
