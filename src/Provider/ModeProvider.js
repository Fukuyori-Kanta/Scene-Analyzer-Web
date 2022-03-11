import React, { createContext, useState, useContext } from "react";

const ModeContext = createContext();
export const useMode = () => useContext(ModeContext);

export default function ModeProvider({ children }) {
  const [isEditMode, setEditMode] = useState(false);

  const makeEditMode = () =>
    setEditMode(true);
    
  
  const makeViewMode = () =>
    setEditMode(false);

  return (
    <ModeContext.Provider value={{ isEditMode, makeEditMode, makeViewMode }}>
      {children}
    </ModeContext.Provider>
  )
}
