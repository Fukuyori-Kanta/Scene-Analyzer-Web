import React from 'react'
import { ContextMenu, MenuItem } from "react-contextmenu"
import { RiFileCopyLine, RiDeleteBin6Line } from 'react-icons/ri'
import { BsBack } from 'react-icons/bs'
import { BiEdit } from 'react-icons/bi'
import { GiCharacter } from 'react-icons/gi'
import { useCanvas } from '../Provider/CanvasProvider'

export default function ContextMenuBody() {
  const { copyAndPaste, editLabelData, makeBack, setFamousPerson, deleteObject } = useCanvas()

  return (
    <ContextMenu id="contextmenu" >
      <MenuItem data={{ copy: 'MI50' }} onClick={copyAndPaste}>
        <RiFileCopyLine className="copy-paste" />
        <span>コピー &amp; ペースト</span>
      </MenuItem>
      <MenuItem onClick={editLabelData}>
        <BiEdit className="label-edit" />
        <span>ラベル名を編集</span>
      </MenuItem>
      <MenuItem onClick={setFamousPerson}>
        <GiCharacter className="famous-person" />
        <span>有名人の名前を入力</span>
      </MenuItem>
      <MenuItem onClick={makeBack}>
        <BsBack className="move-back" />
        <span>最背面へ移動</span>
      </MenuItem>
      <MenuItem onClick={deleteObject}>
        <RiDeleteBin6Line className="delete" />
        <span>削除</span>
      </MenuItem>
    </ContextMenu>

  )
}