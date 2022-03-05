import React, { useState, useEffect } from "react"
import { useCurrent } from "../Provider/CurrentProvider"
import { useAnnotation } from "../Provider/AnnotationProvider"
import { useWindowDimensions } from '../Provider/WindowDimensions'
import { useCanvas } from "../Provider/CanvasProvider"

export default function Canvas({ videoId, data }) {
  const { currentScene, changeCurrentScene, currentLabel, changeCurrentLabel } = useCurrent()
  const { imageCanvas, setImageCanvas, rectCanvas, setRectCanvas, drawCanvas, setDrawCanvas,
    initImageCanvas, initRectCanvas, resizeCoordinate, drawRect, rectSelectionEventHandler } = useCanvas()
  
  const { isDrawingActive, setIsDrawingActive } = useAnnotation()
  const [screenStyle, setScreenStyle] = useState()
  const { width, height } = useWindowDimensions()

  // ラベルデータ
  const labelsData = []
  data.filter(item => {
    if (item.scene_no == 'scene_' + currentScene) {
      labelsData.push(item)
    }
  })

  //const { Canvas, setCanvas } = useAnnotation();

  // 初期描画が終わった後 または サイズが変わった時、サイズを変えてキャンバスを描画
  useEffect(() => {
    const { screenWidth, screenHeight } = getScreenSize('switch-screen')

    const ScreenStyle = {
      width: screenWidth,
      height: screenHeight,
      marginLeft: '1px'
    }
    setScreenStyle(ScreenStyle)

    showCanvas()
  }, [width, height]);

  // 矩形描画キャンバスが宣言された時、各ラベルのバウンディングボックスを描画
  useEffect(() => {
    if (rectCanvas !== null) {

      // 各ラベルのバウンディングボックスを描画
      labelsData.map((data, index) => {
        const labelId = data.label_id    // ラベルID
        // 物体ラベルの場合のみ描画
        if (labelId.slice(0, 1) == 'N') {

          const labelName = data.label_name_ja // ラベル名（日本語）
          const score = data.recognition_score // 認識スコア

          // 画面比率に合わせるため座標データをリサイズ
          const coordinate = resizeCoordinate(data.x_axis, data.y_axis, data.width, data.height)

          // バウンディングボックスを描画
          drawRect(index, coordinate, labelName)
        }
      })

      // 矩形選択時のイベントハンドラ
      rectSelectionEventHandler()
    }
  }, [rectCanvas])

  // 画面サイズを取得する関数
  const getScreenSize = id => {
    const parentElements = document.getElementById(id).getBoundingClientRect()  // 親要素

    return {
      screenWidth: parentElements['width'] - 3,
      screenHeight: parentElements['height'] - 2
    }
  }

  // サムネ画像の表示
  function showCanvas() {
    const thumbnailPath = '/result/thumbnail/' + videoId + '/thumbnail' + currentScene + '.jpg' // サムネ画像のパス
    initImageCanvas('image-area', thumbnailPath)

    // 矩形キャンバスを描画
    const { screenWidth, screenHeight } = getScreenSize('switch-screen')
    initRectCanvas('rect-area', screenWidth, screenHeight)    // バウンディングボックスを描画するためのキャンバス

   if (rectCanvas !== null) {  
      // 各ラベルのバウンディングボックスを描画
      labelsData.map((data, index) => {
        const labelId = data.label_id    // ラベルID
        // 物体ラベルの場合のみ描画
        if (labelId.slice(0, 1) == 'N') {

          const labelName = data.label_name_ja // ラベル名（日本語）
          const score = data.recognition_score // 認識スコア

          // 画面比率に合わせるため座標データをリサイズ
          const coordinate = resizeCoordinate(data.x_axis, data.y_axis, data.width, data.height)

          // バウンディングボックスを描画
          drawRect(index, coordinate, labelName)
        }
      })
    }
  }

  return (
    <div>
      <canvas id="image-area" style={screenStyle}></canvas>
      <canvas id="rect-area" className="lower-canvas" style={screenStyle}></canvas>
      {isDrawingActive ? <canvas id="draw-area" style={screenStyle}></canvas> : <></>}
    </div>
  )
}