import React, { useState, useEffect } from "react"
import request from 'superagent'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useLocation
} from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'
import { fabric } from "fabric"

class ResultDetailPage extends React.Component {
  constructor(props) {
    super(props)
    this.clickHandler = this.clickHandler.bind(this)  // 
    this.editBtnClickHandler = this.editBtnClickHandler.bind(this)  // 編集ボタンクリックイベントをバインド
    this.saveBtnClickHandler = this.saveBtnClickHandler.bind(this)  // 保存ボタンクリックイベントをバインド
    // 状態の初期化
    this.state = {
      items: null,
      currentNo: 1,
      editMode: false
    }
  }
  // マウントされるとき
  componentWillMount() {
    const { params } = this.props.match
    const id = params.id

    this.setState({
      videoId: id
    })

    // JSONデータを読み込む --- (※2)
    request.get('http://192.168.204.128/result/' + id)
      .end((err, res) => {
        this.loadedJSON(err, res)
      })
  }
  // データを読み込んだとき --- (※3)
  loadedJSON(err, res) {
    if (err) {
      console.log('JSON読み込みエラー')
      return
    }
    const sceneList = [...new Set(res.body.map(item => item.scene_no))]
    // 状態を更新 --- (※4)
    this.setState({
      items: res.body,
      productName: res.body[0].product_name,
      sceneList: sceneList
    })
  }
  /* 別シーンをクリックしたときの処理 */
  clickHandler(e) {
    const clickedScene = e.currentTarget.dataset.scene_no

    this.setState({
      currentNo: clickedScene
    })
  }
  /* 編集ボタンを押したときの処理 */
  editBtnClickHandler(e) {
    this.setState({
      editMode: true
    })
  }
  /* 保存ボタンを押したときの処理 */
  saveBtnClickHandler(e) {
    this.setState({
      editMode: false
    })
  }

  render() {
    // JSONデータの読み込みが完了してるか? --- (※5)
    if (!this.state.items) {
      return <div className='App'>
        現在読み込み中...</div>
    }
    const videoId = this.state.videoId // 動画ID
    const productName = this.state.productName  // 作品名
    const sceneNo = this.state.no // シーン番号
    const sceneCount = this.state.sceneList.length  // 全シーン数

    /* シーン一覧用サムネイル */
    const thumbnail = [...Array(sceneCount).keys()].map(i => ++i).map(cnt => {
      const imgPath = '/result/thumbnail/' + videoId + '/thumbnail' + cnt + '.jpg'
      // 現在のシーンの枠に色付け
      let isColorRed = false
      if (cnt === this.state.currentNo) {
        //isColorRed = true
      }
      return (
        <li className="item" key={cnt}>
          <img data-scene_no={cnt}
            className="thumbnail"
            src={`${process.env.PUBLIC_URL}` + imgPath}
            onClick={this.clickHandler}
            style={isColorRed ? { borderColor: 'red' } : {}} />
        </li>
      )
    })

    /* ラベルデータ */
    const labelsData = []
    this.state.items.filter(item => {
      if (item.scene_no == 'scene_' + this.state.currentNo) {
        labelsData.push(item)
      }
    })
    const labels = labelsData.map((label, index) => {
      return (
        <div data-label_id={index + 1} className="label-item" key={index + 1}>
          <h3 className="label">{label.label_name_ja}</h3>
        </div>
      )
    })

    /* 好感度データ */
    const favoData = []
    const ListCnt = [...Array(sceneCount).keys()].map(i => ++i).map(cnt => {
      let l = []
      this.state.items.filter(data => {
        if (data.scene_no.indexOf('scene_' + cnt) !== -1) {
          l.push(data.favo)
        }
      })
      favoData.push(l[0])
    })

    // 表示領域の切り替え
    const showMovieScreen = (isEditMode) => {
      if (!isEditMode) {
        return <Video videoId={videoId} no={this.state.currentNo} />
      } else {
        return <Canvas videoId={videoId} no={this.state.currentNo} data={labelsData} />
      }
    }

    /* データの表示 */
    return (
      <div id="result-show">
        <Breadcrumbs productName={productName} />

        <div className="video-info">
          <div id="file-name">{productName}</div>
          <div id="scene-no">{this.state.currentNo}シーン目</div>
        </div>

        <div id="result-screen">
          <div id="movie-screen" className="border-line layer-wrap" >
            {showMovieScreen(this.state.editMode)}
          </div>

          <div id="label-screen" className="border-line">
            <div className="annotation-area">
              <h2 className="heading tag">このシーンのラベル一覧</h2>
              <div className="button-area" >
                <div className="edit-btn" style={{ display: this.state.editMode ? 'none' : '' }} onClick={this.editBtnClickHandler}>
                  <p>編集</p>
                </div>
                <div className="save-btn" style={{ display: this.state.editMode ? '' : 'none' }} onClick={this.saveBtnClickHandler}>
                  <p>保存</p>
                </div>
                <div className="cancel-btn" style={{ display: this.state.editMode ? '' : 'none' }}>
                  <p>キャンセル</p>
                </div>
              </div>
            </div>

            <div id="labels">{labels}</div>

            <div id="input-area"></div>

            <h2 className="heading tag">このシーンの好感度</h2>

            <div className="favo-gragh">
              <canvas id="canvas"></canvas>
            </div>
          </div>
        </div>

        <div className="scene-list-screen border-line">
          <h4 className="heading margin-left">シーン分割結果（計 : <span id="scene-cnt">{sceneCount}</span>シーン）</h4>
          <div id="scene-list" className="horizontal-scroll">{thumbnail}</div>
        </div>
      </div>
    )
  }
}
class Canvas extends React.Component {
  constructor(props) {
    super(props)
    // 状態の初期化
    this.state = {
      labelData: this.props
    }
  }
  render() {
    const parentElements = document.getElementById('movie-screen').getBoundingClientRect()  // 親要素
    const width = parentElements['width'] - 3   // 画像表示領域の幅
    const height = parentElements['height'] - 2 // 画像表示領域の高さ
    const style = {
      width: width,
      height: height,
      marginLeft: '1px'
    }
    return (
      <>
        <canvas id="image-area" style={style}></canvas>
        <canvas id="rect-area" className="lower-canvas" style={style}></canvas>
      </>
    )
  }
  // 描画終了後の処理
  componentDidMount() {
    // サムネ画像の表示
    this.showCanvas()
    
  }
  // 更新後の処理
  componentDidUpdate(prevProps, prevState, snapshot) {
    /*
    // 状態の初期化
    this.setState = ({
      labelData: this.props
    }, ()=>{
      this.showCanvas()
    })
    */
   this.showCanvas()
  }
  // サムネ画像の表示
  showCanvas() {
    const imageCanvas = document.getElementById("image-area")
    const Context = imageCanvas.getContext("2d")

    const parentElements = document.getElementById('movie-screen').getBoundingClientRect()  // 親要素
    const width = parentElements['width'] - 3   // 画像表示領域の幅
    const height = parentElements['height'] - 2 // 画像表示領域の高さ

    let canvasWidth = imageCanvas.width     // キャンバスサイズ（幅）
    let canvasHeight = imageCanvas.height   // キャンバスサイズ（高さ）

    const videoId = this.props.videoId  // 動画ID
    const currentNo = this.props.no     // 現在のシーン番号

    let thumbnailPath = '/result/thumbnail/' + videoId + '/thumbnail' + currentNo + '.jpg' // サムネ画像のパス

    // サムネ画像を描画
    let img = new Image()
    img.src = thumbnailPath
    img.onload = function () {
      Context.drawImage(img, 0, 0, canvasWidth, canvasHeight)
    }
    
    let rectCanvas = new fabric.Canvas('rect-area', {width: width, height: height})    // バウンディングボックスを描画するためのキャンバス

    let rectCanvasWidth = rectCanvas.width     // キャンバスサイズ（幅）
    let rectCanvasHeight = rectCanvas.height   // キャンバスサイズ（高さ）
    let imageWidth = 426   // 画像サイズ（幅） TODO 描画する画像サイズを取得
    let imgaeHeight = 240   // 画像サイズ（高さ）
    let xMagnification = rectCanvasWidth / imageWidth   // サイズ倍率(x)
    let yMagnification = rectCanvasHeight / imgaeHeight // サイズ倍率(y)   
      
    let objId = 1     // バウンディングボックスを一意に識別するためのID

    const labelData = this.state.labelData.data// ラベルデータ
    
    // バウンディングボックスを描画
    for (let data of labelData) {
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
    
  }
}

class Video extends React.Component {
  constructor(props) {
    super(props)
    // 状態の初期化
    this.state = {
      items: null // 読み込んだデータ保存用
    }
  }
  render() {
    const videoId = this.props.videoId
    const currentNo = this.props.no
    const videoPath = '/result/scene/' + videoId + '/scene' + currentNo + '.mp4'
    return (
      <video src={`${process.env.PUBLIC_URL}` + videoPath} controls="controls" autoPlay="autoplay"></video>
    )
  }
}

class Labels extends React.Component {
  constructor(props) {
    super(props)
    // 状態の初期化
    this.state = {
      items: null // 読み込んだデータ保存用
    }
  }
  render() {
    const videoId = this.props.videoId
    const currentNo = this.props.no
    const videoPath = '/result/scene/' + videoId + '/scene' + currentNo + '.mp4'
    return (
      <video src={`${process.env.PUBLIC_URL}` + videoPath} controls="controls" autoPlay="autoplay"></video>
    )
  }
}

class ButtonArea extends React.Component {
  constructor(props) {
    super(props)
    this.editBtnClickHandler = this.editBtnClickHandler.bind(this)  // 編集ボタンクリックイベントをバインド
    // 状態の初期化
    this.state = {
      editMode: false
    }
  }
  /* 編集ボタンを押したときの処理 */
  editBtnClickHandler(e) {
    this.setState({
      editMode: true
    })
  }
  render() {
    return (
      <div className="button-area" >
        <div className="edit-btn" onClick={this.editBtnClickHandler}>
          <p>編集</p>
        </div>
        <div className="save-btn">
          <p>保存</p>
        </div>
        <div className="cancel-btn">
          <p>キャンセル</p>
        </div>
      </div>
    )
  }
}
/*
    function drawChart(favoData, current, videoId) { 
      // x軸ラベル（シーン〇  〇は全角数字）
      const xAxisLabels = [...Array(favoData.length).keys()].map((d) => {return "シーン" + zenkaku2Hankaku(String(d+1))})
  
      // 描画するグラフのデータ
      const lineChartData = {
          labels : xAxisLabels, 
          datasets : [
              {
              label: "好感度",
              lineTension: 0,
              data : favoData, 
              borderColor: '#00a0dcff',
              backgroundColor: '#00a0dc11',
              pointRadius: [3]
              }
          ]
      }
      // グラフのオプション
      const lineChartOption = {
          // 大きさ
          scales: {
              yAxes: [                    // Ｙ軸 
                  {
                      ticks: {            // 目盛り        
                          min: 0,         // 最小値
                          //max: 0.06,    // 最大値
                          stepSize: 0.01  // 間隔
                      }
                  }
              ]
          },
          // 凡例
          legend: {
              display: false
          },
          // アニメーション
          animation: false, 
          // マウスオーバー時のカーソル変更関数
          onHover : function(e, el) {
              if (! el || el.length === 0) {
                  $('#canvas').css('cursor', 'default')
              } else {
                  $('#canvas').css('cursor', 'pointer')
              }
          },
      }
  
      // ポイントの大きさを設定（現在シーンには、大きくポイントを描画）
      for (let i = 0 i < lineChartData.datasets[0].data.length i++) {
          lineChartData.datasets[0].pointRadius[i] = 3
      }
      lineChartData.datasets[0].pointRadius[current-1] = 10
  
      let myCanvas = $('#canvas')[0]
      let ctx = myCanvas.getContext('2d')
      // 既に描画している場合は、一度クリア
      // クリアしないと描画ずれが起きる
      if(myChart) {
          myChart.destroy()
      }
      // 折れ線グラフを描画
      myChart = new Chart(ctx, {
          type: 'line',
          data: lineChartData,
          options: lineChartOption
      }) 
    }
    */
export default ResultDetailPage