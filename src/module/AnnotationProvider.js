﻿import React, { createContext, useState, useContext } from "react";

import { fabric } from "fabric"

const AnnotationContext = createContext();
export const useAnnotation = () => useContext(AnnotationContext);

export default function AnnotationProvider({ children }) {
  
  const [labelsData, setLabelsData] = useState(null);
  const [oldLabels, setOldLabels] = useState();
  const [newLables, setNewLabels] = useState();
  const [Canvas, setCanvas] = useState();  
  /*
  const changeAnnotationScene = (cnt) =>
    setannotationScene(cnt);

  const changeAnnotationLabel = (cnt) =>
    setAnnotationLabel(cnt);

  */

    const changeLabelsData = (data) =>
      setLabelsData(data);

  return (
    <AnnotationContext.Provider value={{ labelsData, changeLabelsData, oldLabels, setOldLabels, newLables, setNewLabels, Canvas, setCanvas }}>
      {children}
    </AnnotationContext.Provider>
  )
}
