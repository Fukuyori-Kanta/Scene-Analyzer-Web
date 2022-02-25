import React, { createContext, useState, useContext } from "react";
import { useEffect } from "react/cjs/react.development";

const AnnotationContext = createContext();
export const useAnnotation = () => useContext(AnnotationContext);

export default function AnnotationProvider({ children }) {
  
  const [labelsData, setLabelsData] = useState(null);
  const [oldLabels, setOldLabels] = useState();
  const [newLables, setNewLabels] = useState();
  const [isDrawingActive, setIsDrawingActive] = useState(false);  

  /*
  const changeAnnotationScene = (cnt) =>
    setannotationScene(cnt);

  const changeAnnotationLabel = (cnt) =>
    setAnnotationLabel(cnt);

  */

    const changeLabelsData = (data) =>
      setLabelsData(data);

  return (
    <AnnotationContext.Provider value={{ labelsData, changeLabelsData, oldLabels, setOldLabels, newLables, setNewLabels, isDrawingActive, setIsDrawingActive }}>
      {children}
    </AnnotationContext.Provider>
  )
}
