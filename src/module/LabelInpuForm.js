import React from "react"
import { useMode } from './ModeProvider'

export default function LabelInpuForm() {
  let { isEditMode } = useMode();

  return (
    <div id="input-area">
      {isEditMode
        ? <>
            <input id="input-word" type="text" size="25" placeholder="ラベル名を入力して下さい" />
            <div className="add-btn" onClick={() => console.log('asd')}><p>追加</p></div>
          </>
        : <>
          </>
      }
    </div>
  )
}