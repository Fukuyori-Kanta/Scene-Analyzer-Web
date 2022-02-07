import React  from "react"
import { useCurrent } from "./CurrentProvider"

export default function SceneList({ videoId, sceneCount }) {  
  const { currentNo, changeCurrent } = useCurrent();

  const list = [...Array(sceneCount).keys()].map(i => ++i).map(cnt => {
    const imgPath = '/result/thumbnail/' + videoId + '/thumbnail' + cnt + '.jpg'

    // 現在のシーンの枠に色付け
    let isColorRed = false
    if (cnt === currentNo) {
      isColorRed = true
    }
    return (
      <li className="item" key={cnt}>
        <img data-scene_no={cnt}
          className="thumbnail"
          src={`${process.env.PUBLIC_URL}` + imgPath}
          onClick={() => changeCurrent(cnt)}
          style={isColorRed ? { borderColor: 'red' } : {}} />
      </li>
    )
  })

  return (
    <div className="scene-list-screen border-line">
      <h4 className="heading margin-left">シーン分割結果（計 : <span id="scene-cnt">{sceneCount}</span>シーン）</h4>
      <div id="scene-list" className="horizontal-scroll">{list}</div>
    </div>
  )
}