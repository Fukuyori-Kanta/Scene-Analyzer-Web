import React, { createContext, useState, useContext } from "react";
import { useEffect } from "react/cjs/react.development";

const AnnotationContext = createContext();
export const useAnnotation = () => useContext(AnnotationContext);

export default function AnnotationProvider({ children }) {
  
  const [labelsData, setLabelsData] = useState(null);
  const [oldLabels, setOldLabels] = useState();
  const [newLables, setNewLabels] = useState();
  const [isDrawingActive, setIsDrawingActive] = useState(false);  
  const [inputWord, setInputWord] = useState('')  // 入力単語（ラベル名）



  /*
  const changeAnnotationScene = (cnt) =>
    setannotationScene(cnt);

  const changeAnnotationLabel = (cnt) =>
    setAnnotationLabel(cnt);

  */

    useEffect(() => {
      console.log(inputWord)
    }, [inputWord])

    const changeLabelsData = (data) => {
      setLabelsData(data)
    }

    // 新規ラベルの追加処理
    // const addLabel = () => {
    //   setLabelsData()
    // }
      
  return (
    <AnnotationContext.Provider value={{ labelsData, changeLabelsData, oldLabels, setOldLabels, newLables, setNewLabels, isDrawingActive, setIsDrawingActive, inputWord, setInputWord }}>
      {children}
    </AnnotationContext.Provider>
  )
}
