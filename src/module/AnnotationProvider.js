import React, { createContext, useState, useContext } from "react";

const AnnotationContext = createContext();
export const useAnnotation = () => useContext(AnnotationContext);

export default function AnnotationProvider({ children }) {
  
  const [labelsData, setLabelsData] = useState(null);
  const [oldLabels, setOldLabels] = useState();
  const [newLables, setNewLabels] = useState();
  /*
  const changeAnnotationScene = (cnt) =>
    setannotationScene(cnt);

  const changeAnnotationLabel = (cnt) =>
    setAnnotationLabel(cnt);

  */

    const changeLabelsData = (data) =>
      setLabelsData(data);

  return (
    <AnnotationContext.Provider value={{ labelsData, changeLabelsData, oldLabels, setOldLabels, newLables, setNewLabels  }}>
      {children}
    </AnnotationContext.Provider>
  )
}
