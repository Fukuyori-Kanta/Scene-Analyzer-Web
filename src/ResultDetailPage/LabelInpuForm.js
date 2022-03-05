import React, { useEffect } from "react"
import { useMode } from '../Provider/ModeProvider'
import { useAnnotation } from "../Provider/AnnotationProvider"
import { fabric } from "fabric"

export default function LabelInpuForm() {
  let { isEditMode } = useMode();
  const { labelsData, changeLabelsData, oldLabels, setOldLabels, newLables, setNewLabels, isDrawingActive, setIsDrawingActive } = useAnnotation()

  /*
  function fetchPost() {
    fetch('http://192.168.204.128/annotation/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: 'user',
        data: 'data'
      })
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          console.warn('Something went wrong on api server!');
        }
      })
      .then(json => {
        //return callback(json)
        console.log(json)
      })
      .catch(error => {
        console.error(error);
      })
  }
  */

  useEffect(() => {
    if (isDrawingActive) {
      console.log("追加")
    }
  }, [isDrawingActive])

  return (
    <div id="input-area">
      {isEditMode
        ? <>
          <input id="input-word" type="text" size="25" placeholder="ラベル名を入力して下さい" />
          <div className="add-btn" onClick={() => setIsDrawingActive(true)}><p>追加</p></div>
        </>
        : <>
        </>
      }
    </div>
  )
}