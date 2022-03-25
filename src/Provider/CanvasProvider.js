import React, { createContext, useState, useEffect, useContext, useRef } from "react"
import { useCurrent } from "./CurrentProvider"
import { useAnnotation } from "./AnnotationProvider";
import { fabric } from "fabric"

const CanvasContext = createContext();
export const useCanvas = () => useContext(CanvasContext)

export default function CanvasProvider({ children }) {
  const [imageCanvas, setImageCanvas] = useState(null)  // 背景キャンバス
  const [rectCanvas, setRectCanvas] = useState(null)    // 矩形描画キャンバス
  const [drawCanvas, setDrawCanvas] = useState(null)    // 新規矩形描画キャンバス

  const { changeCurrentLabel } = useCurrent()
  const { isDrawingActive, setIsDrawingActive, inputWord, setInputWord } = useAnnotation()

  const canvasRef = useRef(null)
  const [context, setContext] = useState(null)

  useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext('2d')

      if (renderCtx) {
        setContext(renderCtx)
      }
    }
  }, [context])

  useEffect(() => {
    if (isDrawingActive) {
      // 新規矩形描画を開始
      drawNewRectArea(inputWord)

      // 入力単語（ラベル）初期化
      setInputWord('')
    }
  }, [isDrawingActive])

  const drawNewRectArea = (labelName) => {
    const Canvas = canvasRef.current
    const Context = Canvas.getContext("2d")

    var RectEdgeColor = "#0BF"
    var RectInnerColor = "rgba(174,230,255,0.3)"
    var IndicatorColor = "rgba(0, 0, 0, 0.6)"
    var index = 0
    var DrawingMemory = { 0: { x: null, y: null, w: null, h: null } }

    Context.strokeStyle = IndicatorColor
    Context.fillStyle = RectInnerColor
    Context.lineWidth = 2
    var startPosition = { x: null, y: null }
    var isDrag

    function dragStart(x, y) {
      isDrag = true
      startPosition.x = x
      startPosition.y = y
    }

    function dragEnd(x, y) {
      if (isDrag) {
        DrawingMemory[index] = { x: startPosition.x, y: startPosition.y, w: x - startPosition.x, h: y - startPosition.y }
        index += 1
        drawFromMemory()
      } else {
        clear()
        drawFromMemory()
      }
      isDrag = false

      let coordinate = [DrawingMemory[index - 1].x, DrawingMemory[index - 1].y, DrawingMemory[index - 1].w, DrawingMemory[index - 1].h]   // 引数にする座標データ
      let objId = 10

      // バウンディングボックスを描画
      drawRect(objId, coordinate, labelName)

      // 新規描画を非アクティブ化
      setIsDrawingActive(false)
    }

    function drawFromMemory() {
      Context.strokeStyle = RectEdgeColor

      for (let i = 0; i < index; i++) {
        Context.fillRect(DrawingMemory[i].x, DrawingMemory[i].y, DrawingMemory[i].w, DrawingMemory[i].h)
      }
      for (let i = 0; i < index; i++) {
        Context.strokeRect(DrawingMemory[i].x, DrawingMemory[i].y, DrawingMemory[i].w, DrawingMemory[i].h)
      }
      Context.strokeStyle = IndicatorColor
    }

    function draw(x, y) {
      clear()
      drawFromMemory()

      Context.beginPath()
      Context.moveTo(0, y)
      Context.lineTo(Canvas.width, y)
      Context.moveTo(x, 0)
      Context.lineTo(x, Canvas.height)
      Context.closePath()
      Context.stroke()

      if (isDrag) {
        Context.strokeStyle = RectEdgeColor
        Context.fillRect(startPosition.x, startPosition.y, x - startPosition.x, y - startPosition.y)
        Context.strokeRect(startPosition.x, startPosition.y, x - startPosition.x, y - startPosition.y)
        Context.strokeStyle = IndicatorColor
      }
    }

    function mouseHandler() {
      Canvas.addEventListener('mousedown', function (e) {
        dragStart(e.layerX - canvasRef.current.offsetLeft, e.layerY - canvasRef.current.offsetTop)
      })
      Canvas.addEventListener('mouseup', function (e) {
        dragEnd(e.layerX - canvasRef.current.offsetLeft, e.layerY - canvasRef.current.offsetTop)
      })
      Canvas.addEventListener('mouseout', function (e) {
        dragEnd(e.layerX - canvasRef.current.offsetLeft, e.layerY - canvasRef.current.offsetTop)
      })
      Canvas.addEventListener('mousemove', function (e) {
        draw(e.layerX - canvasRef.current.offsetLeft, e.layerY - canvasRef.current.offsetTop)
      })
    }
    mouseHandler()

    function clear() {
      Context.clearRect(0, 0, Canvas.width, Canvas.height)
    }
  }

  const initImageCanvas = (id, path) => {
    const imageCanvas = document.getElementById(id)
    const Context = imageCanvas.getContext("2d")

    let canvasWidth = imageCanvas.width     // キャンバスサイズ（幅）
    let canvasHeight = imageCanvas.height   // キャンバスサイズ（高さ）

    // サムネ画像を描画
    let img = new Image()
    img.src = path
    img.onload = function () {
      Context.drawImage(img, 0, 0, canvasWidth, canvasHeight)
    }

    setImageCanvas(imageCanvas)
  }

  function initRectCanvas(id, width, height) {
    setRectCanvas(new fabric.Canvas(id, { width: width, height: height }))
  }

  // バウンディングボックスの座標をリサイズして返す関数
  const resizeCoordinate = (x, y, w, h) => {
    let rectCanvasWidth = rectCanvas.width     // キャンバスサイズ（幅）
    let rectCanvasHeight = rectCanvas.height   // キャンバスサイズ（高さ）
    let imageWidth = 426   // 画像サイズ（幅） TODO 描画する画像サイズを取得
    let imgaeHeight = 240   // 画像サイズ（高さ）
    let xMagnification = rectCanvasWidth / imageWidth   // サイズ倍率(x)
    let yMagnification = rectCanvasHeight / imgaeHeight // サイズ倍率(y)   

    let re_x = x * xMagnification   // x軸の座標
    let re_y = y * yMagnification   // y軸の座標
    let re_w = w * xMagnification    // 幅
    let re_h = h * yMagnification   // 高さ

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

    const rectStrokeWidth = 3;
    const rectstroke = '#BF0';
    const rectFill = 'rgba(230,255,174,0.5)';

    // 変更
    rect.set({
      strokeWidth: rectStrokeWidth,  // 線の幅
      stroke: rectstroke, // 線の色
      fill: rectFill,     // 塗潰し色
    }).setCoords();

    // 変更したオブジェクトの描画
    rectCanvas.renderAll();
  }

  const makeUnselectedAll = () => {
    let rectStrokeWidth = 2;
    let rectstroke = '#0BF';
    let rectFill = 'rgba(174,230,255,0.1)';

    rectCanvas._objects.map(rect => {
      rect._objects[0].set({
        strokeWidth: rectStrokeWidth,  // 線の幅
        stroke: rectstroke, // 線の色
        fill: rectFill,     // 塗潰し色
      }).setCoords();
    })

    // 変更したオブジェクトの描画
    rectCanvas.renderAll()
  }

  const checkedLabel = (currentId) => {
    // 全矩形を非選択状態にする
    makeUnselectedAll()

    // 選択された矩形を選択状態にする
    const selectedObj = rectCanvas._objects[currentId - 1]
    const selectedRect = selectedObj._objects[0]

    const rectStrokeWidth = 3;    // 線の幅
    const rectstroke = '#BF0';    // 線の色
    const rectFill = 'rgba(230,255,174,0.5)'; // 塗りつぶし色

    // 変更
    selectedRect.set({
      strokeWidth: rectStrokeWidth,  // 線の幅
      stroke: rectstroke, // 線の色
      fill: rectFill,     // 塗潰し色
    }).setCoords();

    // 変更したオブジェクトの描画
    rectCanvas.renderAll()
  }

  const deleteRect = (id) => {
    // console.log('消します')
    // console.log(id)
    // console.log(rectCanvas._objects)
    // object = _.find(rectCanvas._objects, function(o) { return o.id === id })
    // console.log(object)
    // rectCanvas.remove(object);
    console.log(rectCanvas._objects)
    let obj = rectCanvas.getObjects().find(obj => obj.id === id);
    console.log(obj)
    rectCanvas.remove(obj);
  }

  // 矩形選択時のイベントハンドラ
  const rectSelectionEventHandler = () => {
    // 何も選択していない状態で矩形をクリックした時の処理
    rectCanvas.on('selection:created', (e) => {
      let selectedObj = e.selected[0];            // 選択したオブジェクト
      let selectedRect = selectedObj._objects[0]; // 選択した矩形

      // 現在の選択ラベルを変更
      changeCurrentLabel(selectedObj.id)

      changeDrawnRect(selectedRect);
    })

    // 選択状態で他の矩形をクリックした時の処理
    rectCanvas.on('selection:updated', (e) => {
      let selectedObj = e.selected[0];            // 選択したオブジェクト
      let selectedRect = selectedObj._objects[0]; // 選択した矩形

      // 現在の選択ラベルを変更
      changeCurrentLabel(selectedObj.id)

      // 矩形の設定を変更
      changeDrawnRect(selectedRect);

      // 選択した該当ラベルを強調
      //emphasizeLabel(selectedObj.id);

      // [削除]ボタンを追加        
      //addDeleteBtn(selectedObj.id, deselectedObj.id);

      // [削除]ボタンの削除
      //removeDeleteBtn(deselectedObj.id);
    });

    // 選択状態で背景をクリックしたときの処理
    rectCanvas.on('before:selection:cleared', (e) => {
      // 現在の選択ラベルを初期値に設定
      changeCurrentLabel(0)

      // 全矩形を非選択状態にする
      makeUnselectedAll()

      // ラベルの強調を終了
      //endLabelEmphasis();

      // [削除]ボタンの削除
      //removeDeleteBtn(deselectedObj.id);
    });

    // 拡大縮小時のテキストボックスのサイズ固定処理
    rectCanvas.on({
      'object:scaling': onChange
    });
    function onChange(obj) {
      let textbox = obj.target.item(1);
      let group = obj.target;
      let scaleX = group.width / (group.width * group.scaleX);
      let scaleY = group.height / (group.height * group.scaleY);
      textbox.set({
        scaleX: scaleX,
        scaleY: scaleY
      });
    }

    // 矩形修正時の更新処理
    // rectCanvas.on('object:modified', (e) => {
    //   let rectObj = e.target;
    //   let rect = rectObj._objects[0]; // 矩形

    //   let objId = rectObj.id;
    //   let labelName = rectObj._objects[1].text.trim();    // ラベル名

    //   let canvasWidth = rectCanvas.width;     // キャンバスサイズ（幅）
    //   let canvasHeight = rectCanvas.height;   // キャンバスサイズ（高さ）
    //   let imageWidth = 426;   // 画像サイズ（幅） TODO 描画する画像サイズを取得
    //   let imgaeHeight = 240   // 画像サイズ（高さ）
    //   let xMagnification = canvasWidth / imageWidth;   // サイズ倍率(x)
    //   let yMagnification = canvasHeight / imgaeHeight; // サイズ倍率(y)  

    //   let x = Math.round(rectObj.left * imageWidth / canvasWidth);
    //   let y = Math.round(rectObj.top * imgaeHeight / canvasHeight);
    //   let w = Math.round(rectObj.width * imageWidth / canvasWidth);
    //   let h = Math.round(rectObj.height * imgaeHeight / canvasHeight);


    //   //let newRect = oldRect.concat();
    //   //newRect[objId - 1] = [labelName, x, y, w, h];
    // });
  }

  return (
    <CanvasContext.Provider value={{
      imageCanvas,
      setImageCanvas,
      rectCanvas,
      setRectCanvas,
      resizeCoordinate,
      drawCanvas,
      setDrawCanvas,
      initImageCanvas,
      initRectCanvas,
      drawRect,
      rectSelectionEventHandler,
      changeDrawnRect,
      checkedLabel,
      canvasRef,
      deleteRect
    }}>
      {children}
    </CanvasContext.Provider>
  );
}
