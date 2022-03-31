import React, { useState, useEffect } from 'react'
import { useCurrent } from '../Provider/CurrentProvider'
import { useAnnotation } from '../Provider/AnnotationProvider'
import { useWindowDimensions } from '../Provider/WindowDimensions'
import { useCanvas } from '../Provider/CanvasProvider'

export default function Canvas({ videoId }) {
  const [screenStyle, setScreenStyle] = useState()  // 表示領域のスタイル
  let [drawWidth, setDrawWidth] = useState()        // 新規描画キャンバスの幅
  let [drawHeight, setDrawHeight] = useState()      // 新規描画キャンバスの高さ

  const { currentScene } = useCurrent()
  const { rectCanvas, drawImageCanvas, drawRectCanvas, ImageSize2CanvasSize, drawRect, rectSelectionEventHandler, canvasRef } = useCanvas()
  const { labelsData, isDrawingActive } = useAnnotation()
  const { width, height } = useWindowDimensions()

  // 初期描画が終わった後 または サイズが変わった時、サイズを変えてキャンバスを描画
  useEffect(() => {
    // 表示領域の幅・高さを取得
    const { screenWidth, screenHeight } = getScreenSize('switch-screen')

    // 表示領域の幅・高さを変更
    const ScreenStyle = {
      width: screenWidth,
      height: screenHeight,
      marginLeft: '1px'
    }
    setScreenStyle(ScreenStyle)

    // 新規描画領域の幅・高さを変更
    setDrawWidth(screenWidth)
    setDrawHeight(screenHeight)

    // サイズ変更後のキャンバスを描画
    showCanvas()
  }, [width, height])

  // 矩形描画キャンバスが宣言された時、各ラベルのバウンディングボックスを描画
  useEffect(() => {
    if (rectCanvas !== null) {
      // ラベルデータを描画
      drawLabelsData()

      // 矩形選択時のイベントハンドラ
      rectSelectionEventHandler()
    }
  }, [rectCanvas])

  // 右クリック許可
  // useEffect(() => {
  //   if (rectCanvas !== null) {
  //     // console.log(document.getElementById('canvas-screen'))
  //     // document.getElementById('canvas-screen').oncontextmenu = function () { return true }

  //     // 右クリックを禁止する
  //     document.oncontextmenu = function () {
  //       return true
  //     }
  //   }
  // }, [rectCanvas])

  // 画面サイズを取得する関数
  const getScreenSize = id => {
    const parentElements = document.getElementById(id).getBoundingClientRect()  // 親要素

    return {
      screenWidth: parentElements['width'] - 3,
      screenHeight: parentElements['height'] - 2
    }
  }

  // 各種キャンバスとラベルデータを表示する関数
  function showCanvas() {
    // 背景キャンバスを描画
    const thumbnailPath = './result/thumbnail/' + videoId + '/thumbnail' + currentScene + '.jpg' // サムネ画像のパス
    drawImageCanvas('image-area', thumbnailPath)

    // 矩形キャンバスを描画
    const { screenWidth, screenHeight } = getScreenSize('switch-screen')
    drawRectCanvas('rect-area', screenWidth, screenHeight)    // バウンディングボックスを描画するためのキャンバス

    if (rectCanvas !== null) {
      // ラベルデータを描画
      drawLabelsData()
    }
  }

  // ラベルデータを描画する関数
  const drawLabelsData = () => {
    // 各ラベルのバウンディングボックスを表示
    Object.keys(labelsData).map(key => {
      const data = labelsData[key]  // 該当データ
      const labelId = data.label_id // ラベルID

      // 物体ラベルの場合のみ描画
      if (labelId.slice(0, 1) == 'N') {
        const labelName = data.label_name_ja // ラベル名（日本語）

        // 画面比率に合わせるため座標データをリサイズ
        const coordinate = ImageSize2CanvasSize(data.x_axis, data.y_axis, data.width, data.height)

        // バウンディングボックスを描画
        drawRect(key, coordinate, labelName)
      }
    })
  }

  return (
    <div id="canvas-screen">
      <canvas id="image-area" style={screenStyle}></canvas>
      <canvas id="rect-area" className="lower-canvas" style={screenStyle}></canvas>
      {isDrawingActive ? <canvas id="draw-area" width={drawWidth} height={drawHeight} ref={canvasRef}></canvas> : <></>}
    </div>
  )
}
