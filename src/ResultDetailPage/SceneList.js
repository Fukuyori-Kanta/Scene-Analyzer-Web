﻿import React from 'react'
import { useCurrent } from '../Provider/CurrentProvider'
import ScrollMenu from 'react-horizontal-scroll-menu'

export default function SceneList({ videoId, sceneCount }) {
  const { currentScene, changeCurrentScene, initCurrentLabel } = useCurrent()

  // シーン一覧
  const list = [...Array(sceneCount).keys()].map(i => ++i).map(cnt => {
    const imgPath = './result/thumbnail/' + videoId + '/thumbnail' + cnt + '.jpg'

    // 現在のシーンの枠に色付け
    let isColorRed = false
    if (cnt === currentScene) {
      isColorRed = true
    }
    return (
      <li className="item" key={cnt}>
        <img data-scene_no={cnt}
          className="thumbnail"
          src={imgPath}
          onClick={() => { changeCurrentScene(cnt); initCurrentLabel() }}
          style={isColorRed ? { borderColor: 'red' } : {}} />
      </li>
    )
  })

  // 矢印（<, >）のスタイル
  const ArrowStyle = { 
    fontSize: "30px", 
    padding: "1.0em 0.2em", 
    backgroundColor: "gray", 
    margin: "5px", 
    borderRadius: "5px"
  }

  return (
    <div className="scene-list-screen border-line">
      <h4 className="heading margin-left">シーン分割結果（計 : <span id="scene-cnt">{sceneCount}</span>シーン）</h4>
      <div className="scene-list">
        <ScrollMenu
          arrowLeft={<div style={ArrowStyle}>{" < "}</div>}
          arrowRight={<div style={ArrowStyle}>{" > "}</div>}
          alignCenter={false}
          transition={1.25}
          translate={1}
          inertiaScrolling={true}
          inertiaScrollingSlowdown={0.01}
          data={list}
        />
      </div>
    </div>
  )
}
