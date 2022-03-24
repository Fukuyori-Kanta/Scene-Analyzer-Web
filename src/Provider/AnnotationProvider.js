import React, { createContext, useState, useContext, useLayoutEffect } from "react";
import { useEffect } from "react/cjs/react.development";
import { v4 as uuidv4 } from 'uuid'

const AnnotationContext = createContext();
export const useAnnotation = () => useContext(AnnotationContext);

export default function AnnotationProvider({ children }) {

  const [labelsData, setLabelsData] = useState({})
  const [oldLabels, setOldLabels] = useState({});
  
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const [inputWord, setInputWord] = useState('')  // 入力単語（ラベル名）


  const addLabelsData = (data) => {
    console.log({ ...labelsData, [uuidv4()]: data })
    setLabelsData({ ...labelsData, [uuidv4()]: data })
  }

  //oldLabels, setOldLabels, newLables, setNewLabels,
  return (
    <AnnotationContext.Provider value={{ labelsData, setLabelsData, addLabelsData, oldLabels, setOldLabels, isDrawingActive, setIsDrawingActive, inputWord, setInputWord  }}>
      {children}
    </AnnotationContext.Provider>
  )
}
