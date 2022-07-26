import React from 'react'
import { useCanvas } from '../Provider/CanvasProvider'
import { ContextMenu, MenuItem } from "react-contextmenu"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faUserEdit } from '@fortawesome/free-solid-svg-icons/faUserEdit'
import { faPenSquare } from '@fortawesome/free-solid-svg-icons/faPenSquare'
import { faSquare } from '@fortawesome/free-solid-svg-icons/faSquare'

export default function ContextMenuBody() {
  const { copyAndPaste, editLabelData, makeBack, setFamousPerson, deleteObject } = useCanvas()

  return (
    <ContextMenu id="contextmenu" >
      <MenuItem data={{ copy: 'MI50' }} onClick={copyAndPaste}>
        <FontAwesomeIcon icon={faCopy} />
        <span>コピー &amp; ペースト</span>
      </MenuItem>
      <MenuItem onClick={editLabelData}>
        <FontAwesomeIcon icon={faPenSquare} className="label-edit" />
        <span>ラベル名を編集</span>
      </MenuItem>
      <MenuItem onClick={setFamousPerson}>
        <FontAwesomeIcon icon={faUserEdit} className="famous-person" />
        <span>有名人の名前を入力</span>
      </MenuItem>
      <MenuItem onClick={makeBack}>
        <FontAwesomeIcon icon={faSquare} id="forward" className="move-back" />
        <FontAwesomeIcon icon={faSquare} id="back" className="move-back" />
        <span>最背面へ移動</span>
      </MenuItem>
      <MenuItem onClick={deleteObject}>
        <FontAwesomeIcon icon={faTrash} className="delete" />
        <span>削除</span>
      </MenuItem>
    </ContextMenu>
  )
}