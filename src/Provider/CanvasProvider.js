import React, { createContext, useState, useEffect, useContext, useRef } from 'react'
import { useCurrent } from './CurrentProvider'
import { useAnnotation } from './AnnotationProvider'
import { fabric } from 'fabric'

const CanvasContext = createContext()
export const useCanvas = () => useContext(CanvasContext)

export default function CanvasProvider({ children }) {
  const [imageCanvas, setImageCanvas] = useState(null)  // 背景キャンバス
  const [rectCanvas, setRectCanvas] = useState(null)    // 矩形描画キャンバス
  const [drawCanvas, setDrawCanvas] = useState(null)    // 新規矩形描画キャンバス

  const { changeCurrentLabel, initCurrentLabel } = useCurrent()
  const { labelsData, setLabelsData, isDrawingActive, setIsDrawingActive, inputWord, setInputWord, updateRectData } = useAnnotation()

  const canvasRef = useRef(null)  // 新規矩形描画キャンバスの要素を参照
  const [context, setContext] = useState(null)  // キャンバス管理用（2D レンダリングコンテキスト）

  useEffect(() => {
    console.log(labelsData)
  }, [labelsData])

  // 2D レンダリングコンテキストが設定された時の処理
  useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext('2d')

      if (renderCtx) {
        setContext(renderCtx)
      }
    }
  }, [context])

  // 新規矩形が描画開始になった時の処理
  useEffect(() => {
    if (isDrawingActive) {
      // 新規矩形描画を開始
      drawNewRectCanvas(inputWord)

      // 入力単語（ラベル）初期化
      setInputWord('')
    }
  }, [isDrawingActive])

  // 背景キャンバスを描画する関数
  const drawImageCanvas = (id, path) => {
    const imageCanvas = document.getElementById(id)
    const Context = imageCanvas.getContext('2d')

    let canvasWidth = imageCanvas.width     // キャンバスサイズ（幅）
    let canvasHeight = imageCanvas.height   // キャンバスサイズ（高さ）

    // サムネ画像（背景）を描画
    let img = new Image()
    img.src = path
    img.onload = function () {
      Context.drawImage(img, 0, 0, canvasWidth, canvasHeight)
    }
    setImageCanvas(imageCanvas)
  }

  // 矩形描画キャンバスを描画する関数
  function drawRectCanvas(id, width, height) {
    const rectCanvas = new fabric.Canvas(id, { width: width, height: height })
    setRectCanvas(rectCanvas)
  }

  // 新規矩形を描画する関数
  const drawNewRectCanvas = (labelName) => {
    const NewRectCanvas = canvasRef.current
    const Context = NewRectCanvas.getContext('2d')

    var RectEdgeColor = '#0BF'
    var RectInnerColor = 'rgba(174,230,255,0.3)'
    var IndicatorColor = 'rgba(0, 0, 0, 0.6)'
    var index = 0
    var DrawingMemory = { 0: { x: null, y: null, w: null, h: null } }

    Context.strokeStyle = IndicatorColor
    Context.fillStyle = RectInnerColor
    Context.lineWidth = 2
    var startPosition = { x: null, y: null }
    var isDrag

    // ドラッグ開始時
    const dragStart = (x, y) => {
      isDrag = true
      startPosition.x = x
      startPosition.y = y
    }

    // ドラッグ終了時
    const dragEnd = (x, y) => {
      if (isDrag) {
        DrawingMemory[index] = { x: startPosition.x, y: startPosition.y, w: x - startPosition.x, h: y - startPosition.y }
        index += 1
        drawFromMemory()
      } 
      else {
        clear()
        drawFromMemory()
      }
      isDrag = false

      let coordinate = [DrawingMemory[index - 1].x, DrawingMemory[index - 1].y, DrawingMemory[index - 1].w, DrawingMemory[index - 1].h]   // 座標データ

      // labelsDataに座標データを設定する
      const copiedLabelsData = { ...labelsData }  // ラベルデータ
      const keysArray = Object.keys(copiedLabelsData) // key配列
      const len = keysArray.length
      const objId = keysArray[len - 1]  // オブジェクトID

      // 表示用の座標から画像データ用の座標にリサイズする
      const resizedCoordinate = CanvasSize2ImageSize(coordinate[0], coordinate[1], coordinate[2], coordinate[3])

      // リサイズ後座標を格納
      let updateLabelData = copiedLabelsData[objId] // 更新用ラベルデータ
      updateLabelData["x_axis"] = resizedCoordinate[0]
      updateLabelData["y_axis"] = resizedCoordinate[1]
      updateLabelData["width"]  = resizedCoordinate[2]
      updateLabelData["height"] = resizedCoordinate[3]

      // 座標データを設定
      setLabelsData({ ...labelsData, [objId]: updateLabelData })

      // バウンディングボックスを描画
      drawRect(objId, coordinate, labelName)

      // 新規描画を非アクティブ化
      setIsDrawingActive(false)
    }

    // ドラッグ時
    const drawFromMemory = () => {
      Context.strokeStyle = RectEdgeColor

      for (let i = 0; i < index; i++) {
        Context.fillRect(DrawingMemory[i].x, DrawingMemory[i].y, DrawingMemory[i].w, DrawingMemory[i].h)
      }
      for (let i = 0; i < index; i++) {
        Context.strokeRect(DrawingMemory[i].x, DrawingMemory[i].y, DrawingMemory[i].w, DrawingMemory[i].h)
      }
      Context.strokeStyle = IndicatorColor
    }

    // マウス座標の可視化
    const draw = (x, y) => {
      clear()
      drawFromMemory()

      Context.beginPath()
      Context.moveTo(0, y)
      Context.lineTo(NewRectCanvas.width, y)
      Context.moveTo(x, 0)
      Context.lineTo(x, NewRectCanvas.height)
      Context.closePath()
      Context.stroke()

      if (isDrag) {
        Context.strokeStyle = RectEdgeColor
        Context.fillRect(startPosition.x, startPosition.y, x - startPosition.x, y - startPosition.y)
        Context.strokeRect(startPosition.x, startPosition.y, x - startPosition.x, y - startPosition.y)
        Context.strokeStyle = IndicatorColor
      }
    }

    // 初期化
    const clear = () => {
      Context.clearRect(0, 0, NewRectCanvas.width, NewRectCanvas.height)
    }

    // マウスのイベントハンドラ
    const mouseHandler = () => {
      NewRectCanvas.addEventListener('mousedown', function (e) {
        dragStart(e.layerX - canvasRef.current.offsetLeft, e.layerY - canvasRef.current.offsetTop)
      })
      NewRectCanvas.addEventListener('mouseup', function (e) {
        dragEnd(e.layerX - canvasRef.current.offsetLeft, e.layerY - canvasRef.current.offsetTop)
      })
      NewRectCanvas.addEventListener('mouseout', function (e) {
        dragEnd(e.layerX - canvasRef.current.offsetLeft, e.layerY - canvasRef.current.offsetTop)
      })
      NewRectCanvas.addEventListener('mousemove', function (e) {
        draw(e.layerX - canvasRef.current.offsetLeft, e.layerY - canvasRef.current.offsetTop)
      })
    }
    mouseHandler()
  }

  // バウンディングボックスの座標をリサイズして返す関数（画像サイズ → キャンバスサイズ）
  const ImageSize2CanvasSize = (x, y, w, h) => {
    let rectCanvasWidth = rectCanvas.width     // キャンバスサイズ（幅）
    let rectCanvasHeight = rectCanvas.height   // キャンバスサイズ（高さ）
    let imageWidth = 426   // 画像サイズ（幅）
    let imgaeHeight = 240  // 画像サイズ（高さ）
    let xMagnification = rectCanvasWidth / imageWidth   // サイズ倍率(x)
    let yMagnification = rectCanvasHeight / imgaeHeight // サイズ倍率(y)   

    let re_x = x * xMagnification   // x軸の座標
    let re_y = y * yMagnification   // y軸の座標
    let re_w = w * xMagnification   // 幅
    let re_h = h * yMagnification   // 高さ

    return [re_x, re_y, re_w, re_h]   // リサイズした座標データ
  }

  // バウンディングボックスの座標をリサイズして返す関数（キャンバスサイズ → 画像サイズ）
  const CanvasSize2ImageSize = (x, y, w, h) => {
    let rectCanvasWidth = rectCanvas.width     // キャンバスサイズ（幅）
    let rectCanvasHeight = rectCanvas.height   // キャンバスサイズ（高さ）
    let imageWidth = 426   // 画像サイズ（幅）
    let imgaeHeight = 240  // 画像サイズ（高さ）
    let xMagnification = imageWidth / rectCanvasWidth   // サイズ倍率(x)
    let yMagnification = imgaeHeight / rectCanvasHeight // サイズ倍率(y)   

    let re_x = Math.round(x * xMagnification)   // x軸の座標
    let re_y = Math.round(y * yMagnification)   // y軸の座標
    let re_w = Math.round(w * xMagnification)   // 幅
    let re_h = Math.round(h * yMagnification)   // 高さ

    return [re_x, re_y, re_w, re_h]   // リサイズした座標データ
  }

  // バウンディングボックスを描画する関数
  const drawRect = (objId, coordinate, labelName) => {
    let x = coordinate[0],
      y = coordinate[1],
      w = coordinate[2],
      h = coordinate[3]

    // 矩形
    let rect = new fabric.Rect({
      left: x,         // 左
      top: y,          // 上
      axisX: x,        // 原点からの座標（x）
      axisY: y,        // 原点からの座標（y）            
      width: w,        // 幅
      height: h,       // 高さ
      strokeWidth: 2,  // 線の幅
      stroke: '#0BF',  // 線の色
      fill: 'rgba(174,230,255,0.1)', // 塗潰し色

      hasRotatingPoint: false, // 回転の無効化
      strokeUniform: true      // 拡大縮小時に線の幅を固定   
    })

    // ラベル名のテキストボックス
    let textbox = new fabric.Textbox('\u00a0' + labelName + '\u00a0', {
      left: x + 2,     // 左
      top: y + 2,      // 上
      fontSize: 14,
      fontFamily: 'Arial',
      stroke: '#000',  // アウトラインの色
      strokeWidth: 1,  // アウトラインの太さ
      backgroundColor: 'rgba(174,230,255)',
    })

    // 矩形とテキストボックスをグループ化
    var group = new fabric.Group([rect, textbox], {
      id: objId,
      left: x,
      top: y,
      width: w,
      height: h,
      hasRotatingPoint: false, // 回転の無効化            
      lockScalingFlip: true,    // 裏返しをロック

      // コーナー設定
      cornerColor: '#333',
      cornerSize: 9,
      cornerStyle: 'circle'
    })
    rectCanvas.add(group)

    // オブジェクトの描画
    rectCanvas.renderAll()
  }

  // 描画されたバウンディングボックスの設定を変更（追加）する関数
  // デフォルトは非選択状態とし、選択状態の時に各種変数を更新
  const changeDrawnRect = (rect) => {

    // 全矩形を非選択状態にする
    makeUnselectedAll()

    const rectstroke = '#BF0'
    const rectFill = 'rgba(230,255,174,0.5)'

    // 変更
    rect.set({
      stroke: rectstroke, // 線の色
      fill: rectFill,     // 塗潰し色
    }).setCoords()

    // 変更したオブジェクトの描画
    rectCanvas.renderAll()
  }

  // 全矩形を非選択状態にする関数
  const makeUnselectedAll = () => {
    let rectstroke = '#0BF'
    let rectFill = 'rgba(174,230,255,0.1)'

    rectCanvas._objects.map(rect => {
      rect._objects[0].set({
        stroke: rectstroke, // 線の色
        fill: rectFill,     // 塗潰し色
      }).setCoords()
    })

    // 変更したオブジェクトの描画
    rectCanvas.renderAll()
  }

  // ラベルクリック時に該当矩形を選択状態にする関数
  const checkedLabel = (currentId) => {
    // 全矩形を非選択状態にする
    makeUnselectedAll()

    // 選択された矩形を選択状態にする
    const selectedObj = rectCanvas.getObjects().find(obj => obj.id === currentId) // 選択されたオブジェクト
    const selectedRect = selectedObj._objects[0]

    const rectstroke = '#BF0'    // 線の色
    const rectFill = 'rgba(230,255,174,0.5)' // 塗りつぶし色

    // 変更
    selectedRect.set({
      stroke: rectstroke, // 線の色
      fill: rectFill,     // 塗潰し色
    }).setCoords()

    // 変更したオブジェクトの描画
    rectCanvas.renderAll()
  }

  // ラベル変更時に該当テキストボックスを更新する関数
  const updateLabel = (currentId, labelName) => {
    const updateObj = rectCanvas.getObjects().find(obj => obj.id === currentId) // 更新するオブジェクト
    const updateTextBox = updateObj._objects[1]  // 更新するテキストボックス
    const height = updateTextBox.height // 高さ

    updateTextBox.set({
      text: ' ' + labelName + ' ',
    }).setCoords()

    // 変更したオブジェクトの描画
    rectCanvas.renderAll()

    // ※ 何故か更新するとテキストボックスの高さが変更されてしまうため、
    // 　 一度更新してから高さを設定して再度更新する
    updateTextBox.set({
      height: height,
    }).setCoords()

    // 変更したオブジェクトの描画
    rectCanvas.renderAll()
  }

  // 削除ボタン押下時に該当矩形を削除する関数
  const deleteRect = (currentId) => {
    const deleteObj = rectCanvas.getObjects().find(obj => obj.id === currentId) // 削除するオブジェクト
    rectCanvas.remove(deleteObj)
  }

  // 矩形選択時のイベントハンドラ
  const rectSelectionEventHandler = () => {
    // 何も選択していない状態で矩形をクリックした時の処理
    rectCanvas.on('selection:created', (e) => {
      let selectedObj = e.selected[0]            // 選択したオブジェクト
      let selectedRect = selectedObj._objects[0] // 選択した矩形

      // 現在の選択ラベルを変更
      changeCurrentLabel(selectedObj.id)

      // 矩形の設定を変更
      changeDrawnRect(selectedRect)
    })

    // 選択状態で他の矩形をクリックした時の処理
    rectCanvas.on('selection:updated', (e) => {
      let selectedObj = e.selected[0]            // 選択したオブジェクト
      let selectedRect = selectedObj._objects[0] // 選択した矩形

      // 現在の選択ラベルを変更
      changeCurrentLabel(selectedObj.id)

      // 矩形の設定を変更
      changeDrawnRect(selectedRect)
    })

    // 選択状態で背景をクリックしたときの処理
    rectCanvas.on('before:selection:cleared', () => {
      // 現在の選択ラベルを初期値に設定
      initCurrentLabel()

      // 全矩形を非選択状態にする
      makeUnselectedAll()
    })

    // 移動時に表示領域の範囲外に出ないように設定
    rectCanvas.on('object:moving', function (e) {
      let obj = e.target  // 該当オブジェクト

      // 矩形が範囲より大きい場合は移動不可
      if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
        return
      }
      obj.setCoords()
      // 上側、左側
      if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
        obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top)
        obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left)
      }
      // 下側、右側
      if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
        obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top)
        obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left)
      }
    })

    // 拡大時に表示領域の範囲外に出ないように設定
    let left = 0
    let top = 0
    let width = 0
    let height = 0
    let scaleX = 0
    let scaleY = 0
    rectCanvas.on('object:scaling', function (e) {
      let obj = e.target  // 該当オブジェクト
      obj.setCoords()
      let brNew = obj.getBoundingRect() // 変更後の矩形

      if (((brNew.width + brNew.left) >= obj.canvas.width) || ((brNew.height + brNew.top) >= obj.canvas.height) || ((brNew.left < 0) || (brNew.top < 0))) {
        obj.left = left
        obj.top = top
        obj.scaleX = scaleX
        obj.scaleY = scaleY
        obj.width = width
        obj.height = height
      }
      else {
        left = obj.left
        top = obj.top
        scaleX = obj.scaleX
        scaleY = obj.scaleY
        width = obj.width
        height = obj.height
      }

      // 拡大縮小時にテキストボックスのサイズは固定にする
      let textbox = obj.item(1)
      let textBoxScaleX = obj.width / (obj.width * obj.scaleX)
      let textBoxScaleY = obj.height / (obj.height * obj.scaleY)
      textbox.set({
        scaleX: textBoxScaleX,
        scaleY: textBoxScaleY
      })
    })

    // 矩形更新時（移動・拡大縮小）の更新処理
    rectCanvas.on('object:modified', (e) => {
      let updateObj = e.target  // 更新するオブジェクト
      let objId = updateObj.id  // オブジェクトID
      
      // 座標を表示用からデータ用に変換
      let coordinate = CanvasSize2ImageSize(updateObj.left, updateObj.top, updateObj.width * updateObj.scaleX, updateObj.height * updateObj.scaleY)
      
      // 更新情報を設定
      updateRectData(objId, coordinate)
    })

  }

  return (
    <CanvasContext.Provider value={{
      imageCanvas,
      setImageCanvas,
      rectCanvas,
      setRectCanvas,
      drawCanvas,
      setDrawCanvas,
      canvasRef,
      drawImageCanvas,
      drawRectCanvas,
      drawNewRectCanvas,
      ImageSize2CanvasSize,
      makeUnselectedAll, 
      drawRect,
      changeDrawnRect,
      checkedLabel,
      updateLabel, 
      deleteRect,
      rectSelectionEventHandler,
    }}>
      {children}
    </CanvasContext.Provider>
  )
}
