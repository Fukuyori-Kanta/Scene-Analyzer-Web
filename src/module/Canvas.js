import React, { useState, useEffect, useLayoutEffect } from "react"
import { useCurrent } from "./CurrentProvider"
import { fabric } from "fabric"

export default function Canvas({ videoId, data }) {
  const { currentScene, changeCurrentScene, currentLabel, changeCurrentLabel } = useCurrent();

  const [style, setStyle] = useState()
  const [rectCanvas, setRectCanvas] = useState()

  useEffect(() => {
    const parentElements = document.getElementById('switch-screen').getBoundingClientRect()  // 親要素
    const width = parentElements['width'] - 3   // 画像表示領域の幅
    const height = parentElements['height'] - 2 // 画像表示領域の高さ

    const style = {
      width: width,
      height: height,
      marginLeft: '1px'
    }
    setStyle(style)
  }, []);

  useEffect(() => {
    showCanvas()
  }, [currentScene]);

  /* ラベルデータ */
  const labelsData = []
  data.filter(item => {
    if (item.scene_no == 'scene_' + currentScene) {
      labelsData.push(item)
    }
  })

  // サムネ画像の表示
  const showCanvas = () => {
    const imageCanvas = document.getElementById("image-area")
    const Context = imageCanvas.getContext("2d")

    const parentElements = document.getElementById('switch-screen').getBoundingClientRect()  // 親要素
    const width = parentElements['width'] - 3   // 画像表示領域の幅
    const height = parentElements['height'] - 2 // 画像表示領域の高さ

    let canvasWidth = imageCanvas.width     // キャンバスサイズ（幅）
    let canvasHeight = imageCanvas.height   // キャンバスサイズ（高さ）

    let thumbnailPath = '/result/thumbnail/' + videoId + '/thumbnail' + currentScene + '.jpg' // サムネ画像のパス

    // サムネ画像を描画
    let img = new Image()
    img.src = thumbnailPath
    img.onload = function () {
      Context.drawImage(img, 0, 0, canvasWidth, canvasHeight)
    }

    let rectCanvas = new fabric.Canvas('rect-area', { width: width, height: height })    // バウンディングボックスを描画するためのキャンバス

    let rectCanvasWidth = rectCanvas.width     // キャンバスサイズ（幅）
    let rectCanvasHeight = rectCanvas.height   // キャンバスサイズ（高さ）
    let imageWidth = 426   // 画像サイズ（幅） TODO 描画する画像サイズを取得
    let imgaeHeight = 240   // 画像サイズ（高さ）
    let xMagnification = rectCanvasWidth / imageWidth   // サイズ倍率(x)
    let yMagnification = rectCanvasHeight / imgaeHeight // サイズ倍率(y)   

    let objId = 1     // バウンディングボックスを一意に識別するためのID

    // バウンディングボックスを描画
    for (let data of labelsData) {
      let labelId = data.label_id    // ラベルID
      // 物体ラベルの場合のみ描画
      if (labelId.slice(0, 1) == 'N') {
        let labelName = data.label_name_ja // ラベル名（日本語）
        let score = data.recognition_score // 認識スコア

        let x = data.x_axis * xMagnification   // x軸の座標
        let y = data.y_axis * yMagnification   // y軸の座標
        let w = data.width * xMagnification    // 幅
        let h = data.height * yMagnification   // 高さ

        let coordinate = [x, y, w, h]   // 引数にする座標データ

        // バウンディングボックスを描画
        drawRect(objId, coordinate, labelName)

        objId += 1
        // 更新前の矩形データを保存
        //oldRect.push([labelName, data.x_axis, data.y_axis, data.width, data.height])
      }
    }
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

    // 矩形選択時のイベントハンドラ
    rectSelectionEventHandler()

    // 矩形選択時のイベントハンドラ
    function rectSelectionEventHandler() {
      // 何も選択していない状態で矩形をクリックした時の処理
      rectCanvas.on('selection:created', (e) => {
        let selectedObj = e.selected[0];            // 選択したオブジェクト
        let selectedRect = selectedObj._objects[0]; // 選択した矩形

        // 現在の選択ラベルを変更
        changeCurrentLabel(selectedObj.id)

        changeDrawnRect(selectedRect, 'selected');
      })

      // 選択状態で他の矩形をクリックした時の処理
      rectCanvas.on('selection:updated', (e) => {
        let deselectedObj = e.deselected[0];            // 選択解除したオブジェクト
        let deselectedRect = deselectedObj._objects[0]; // 選択解除した矩形
        let selectedObj = e.selected[0];            // 選択したオブジェクト
        let selectedRect = selectedObj._objects[0]; // 選択した矩形

        // 現在の選択ラベルを変更
        changeCurrentLabel(selectedObj.id)

        // 矩形の設定を変更
        changeDrawnRect(deselectedRect, 'deselected');
        changeDrawnRect(selectedRect, 'selected');

        // 選択した該当ラベルを強調
        //emphasizeLabel(selectedObj.id);

        // [削除]ボタンを追加        
        //addDeleteBtn(selectedObj.id, deselectedObj.id);

        // [削除]ボタンの削除
        //removeDeleteBtn(deselectedObj.id);
      });

      // 選択状態で背景をクリックしたときの処理
      rectCanvas.on('before:selection:cleared', (e) => {
        let deselectedObj = e.target;                   // 選択解除したオブジェクト
        let deselectedRect = deselectedObj._objects[0]; // 選択解除した矩形

        // 現在の選択ラベルを初期値に設定
        changeCurrentLabel(0)

        // 矩形の設定を変更
        changeDrawnRect(deselectedRect, 'deselected');

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
      rectCanvas.on('object:modified', (e) => {
        let rectObj = e.target;
        let rect = rectObj._objects[0]; // 矩形

        let objId = rectObj.id;
        let labelName = rectObj._objects[1].text.trim();    // ラベル名

        let canvasWidth = rectCanvas.width;     // キャンバスサイズ（幅）
        let canvasHeight = rectCanvas.height;   // キャンバスサイズ（高さ）
        let imageWidth = 426;   // 画像サイズ（幅） TODO 描画する画像サイズを取得
        let imgaeHeight = 240   // 画像サイズ（高さ）
        let xMagnification = canvasWidth / imageWidth;   // サイズ倍率(x)
        let yMagnification = canvasHeight / imgaeHeight; // サイズ倍率(y)  

        let x = Math.round(rectObj.left * imageWidth / canvasWidth);
        let y = Math.round(rectObj.top * imgaeHeight / canvasHeight);
        let w = Math.round(rectObj.width * imageWidth / canvasWidth);
        let h = Math.round(rectObj.height * imgaeHeight / canvasHeight);


        //let newRect = oldRect.concat();
        //newRect[objId - 1] = [labelName, x, y, w, h];
      });

      // 描画されたバウンディングボックスの設定を変更（追加）する関数
      // デフォルトは非選択状態とし、選択状態の時に各種変数を更新
      function changeDrawnRect(rect, rectStatus) {
        let rectStrokeWidth = 2;
        let rectstroke = '#0BF';
        let rectFill = 'rgba(174,230,255,0.1)';

        // 選択状態の時、変数を更新
        if (rectStatus == 'selected') {
          rectStrokeWidth = 3;    // 線の幅
          rectstroke = '#BF0';    // 線の色
          rectFill = 'rgba(230,255,174,0.5)'; // 塗りつぶし色
        }

        // 変更
        rect.set({
          strokeWidth: rectStrokeWidth,  // 線の幅
          stroke: rectstroke, // 線の色
          fill: rectFill,     // 塗潰し色
        }).setCoords();

        // 変更したオブジェクトの描画
        rectCanvas.renderAll();
      }
    }
  }
  return (
    <div>
      <canvas id="image-area" style={style}></canvas>
      <canvas id="rect-area" className="lower-canvas" style={style}></canvas>
    </div>
  )

}