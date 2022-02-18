import React from "react"
import { useMode } from './ModeProvider'

import { useAnnotation } from "./AnnotationProvider";
import { fabric } from "fabric"

export default function LabelInpuForm() {
  let { isEditMode } = useMode();
  let { Canvas, setCanvas } = useAnnotation();
  let rectCanvas = Canvas;

  // バウンディングボックスを描画する関数
  function drawRect(objId, coordinate, labelName) {
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

  // 新規矩形を描画する関数
  function drawNewRectArea(labelName) {
    const Canvas = document.getElementById("new-rect-area")
    const Context = Canvas.getContext("2d")

    var RectEdgeColor = "#0BF";
    var RectInnerColor = "rgba(174,230,255,0.3)";
    var IndicatorColor = "rgba(0, 0, 0, 0.6)";
    var index = 0;
    var DrawingMemory = { 0: { x: null, y: null, w: null, h: null } };

    Context.strokeStyle = IndicatorColor;
    Context.fillStyle = RectInnerColor;
    Context.lineWidth = 2;
    var startPosition = { x: null, y: null };
    var isDrag;

    function dragStart(x, y) {
      isDrag = true;
      startPosition.x = x;
      startPosition.y = y;
    }

    function dragEnd(x, y) {
      if (isDrag) {
        DrawingMemory[index] = { x: startPosition.x, y: startPosition.y, w: x - startPosition.x, h: y - startPosition.y };
        index += 1;
        drawFromMemory();
      } else {
        clear();
        drawFromMemory();
      }
      isDrag = false;
      //$('#new-rect-area').remove();

      let coordinate = [DrawingMemory[index - 1].x, DrawingMemory[index - 1].y, DrawingMemory[index - 1].w, DrawingMemory[index - 1].h]   // 引数にする座標データ
      //let objId = $('.label-item:last').data('labelId');  // オブジェクトID（ラベル表示要素に追加されたID）
      let objId = 10
      // バウンディングボックスを描画
      drawRect(objId, coordinate, labelName);
      //newRect = oldRect.concat();
      //newRect.push([labelName, DrawingMemory[index - 1].x, DrawingMemory[index - 1].y, DrawingMemory[index - 1].w, DrawingMemory[index - 1].h]);

    }

    function drawFromMemory() {
      Context.strokeStyle = RectEdgeColor;

      for (let i = 0; i < index; i++) {
        Context.fillRect(DrawingMemory[i].x, DrawingMemory[i].y, DrawingMemory[i].w, DrawingMemory[i].h);
      }
      for (let i = 0; i < index; i++) {
        Context.strokeRect(DrawingMemory[i].x, DrawingMemory[i].y, DrawingMemory[i].w, DrawingMemory[i].h);
      }
      Context.strokeStyle = IndicatorColor;
    }

    function draw(x, y) {
      clear(); // Initialization.
      drawFromMemory(); // Draw Bounding Boxes.

      // Draw Indicator.
      Context.beginPath();
      Context.moveTo(0, y); // start
      Context.lineTo(Canvas.width, y); // end
      Context.moveTo(x, 0); // start
      Context.lineTo(x, Canvas.height); // end
      Context.closePath();
      Context.stroke();

      // Draw the current Bounding Box.
      if (isDrag) {
        Context.strokeStyle = RectEdgeColor;
        Context.fillRect(startPosition.x, startPosition.y, x - startPosition.x, y - startPosition.y);
        Context.strokeRect(startPosition.x, startPosition.y, x - startPosition.x, y - startPosition.y);
        Context.strokeStyle = IndicatorColor;
      }
    }

    function mouseHandler() {
      Canvas.addEventListener('mousedown', function (e) {
        dragStart(e.layerX, e.layerY);
      });
      Canvas.addEventListener('mouseup', function (e) {
        dragEnd(e.layerX, e.layerY);
      });
      Canvas.addEventListener('mouseout', function (e) {
        dragEnd(e.layerX, e.layerY);
      });
      Canvas.addEventListener('mousemove', function (e) {
        draw(e.layerX, e.layerY);
      });
    }
    mouseHandler();

    function clear() {
      Context.clearRect(0, 0, Canvas.width, Canvas.height);
    }
  }
  
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



  return (
    <div id="input-area">
      {isEditMode
        ? <>
          <input id="input-word" type="text" size="25" placeholder="ラベル名を入力して下さい" />
          <div className="add-btn" /*onClick={() => drawNewRectArea()}*/><p>追加</p></div>
        </>
        : <>
        </>
      }
    </div>
  )
}