import React, { createContext, useState, useContext } from 'react'

const ContextMenu = createContext()
export const useContextMenu = () => useContext(ContextMenu)

export default function CanvasProvider({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false) // コンテキストメニューを表示するかどうか

  return (
    <ContextMenu.Provider value={{
      isMenuOpen, 
      setIsMenuOpen
    }}>
      {children}
    </ContextMenu.Provider>
  )
}
