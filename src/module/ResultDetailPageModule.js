﻿import React from 'react'
import request from 'superagent'

class Button extends React.Component {
  render() {
    const value = this.props.value  // 遷移先ページ名
    const herf = this.props.herf // 遷移先パス
    return (
      <a className="button" href={herf}>{value}</a>
    )
  }
}

class ResultDetailPage extends React.Component {
  constructor(props) {
    super(props)
    this.clickHandler = this.clickHandler.bind(this)
    // 状態の初期化
    this.state = {
      items: null,
      currentNo: 1
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
  clickHandler (e) {
    const clickedScene = e.currentTarget.dataset.scene_no
    console.log(clickedScene)

    this.setState({
      currentNo: clickedScene
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
      return (
        <li className="item" key={cnt}>
          <img data-scene_no={cnt} 
            className="thumbnail"
            src={`${process.env.PUBLIC_URL}` + imgPath} 
            onClick={this.clickHandler} />
        </li>
      )
    })

    /* ラベルデータ */
    const labelsData = []
    this.state.items.filter(data => {
      if(data.scene_no.indexOf('scene_' + this.state.currentNo)!== -1) {
        labelsData.push(data.label_name_ja)
      }
    })
    const labels = labelsData.map((label, index) => {
      return (
        <div data-label_id={index+1} className="label-item" key={index+1}>
          <h3 className="label">{label}</h3>
        </div>
      )
    })
    

    /* 好感度データ */
    const favoData = []
    const ListCnt = [...Array(sceneCount).keys()].map(i => ++i).map(cnt => {
      let l = []
      this.state.items.filter(data => {
        if(data.scene_no.indexOf('scene_' + cnt)!== -1) {
          l.push(data.favo)
        }
      })
      favoData.push(l[0])
    })
    console.log(favoData)
    /*
    function drawChart(favoData, current, videoId) { 
      // x軸ラベル（シーン〇  〇は全角数字）
      const xAxisLabels = [...Array(favoData.length).keys()].map((d) => {return "シーン" + zenkaku2Hankaku(String(d+1));});
  
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
                  $('#canvas').css('cursor', 'default');
              } else {
                  $('#canvas').css('cursor', 'pointer');
              }
          },
      }
  
      // ポイントの大きさを設定（現在シーンには、大きくポイントを描画）
      for (let i = 0; i < lineChartData.datasets[0].data.length; i++) {
          lineChartData.datasets[0].pointRadius[i] = 3
      }
      lineChartData.datasets[0].pointRadius[current-1] = 10
  
      let myCanvas = $('#canvas')[0];
      let ctx = myCanvas.getContext('2d');
      // 既に描画している場合は、一度クリア
      // クリアしないと描画ずれが起きる
      if(myChart) {
          myChart.destroy();
      }
      // 折れ線グラフを描画
      myChart = new Chart(ctx, {
          type: 'line',
          data: lineChartData,
          options: lineChartOption
      }); 
    }
    */

    /* データの表示 */
    return (
      <div id="result-show">
        <div className="bread">
          <ul>
            <li><a href="/top">トップページ</a></li>
            <li><a href="/results">結果一覧</a></li>
            <li>{productName}</li>
          </ul>
        </div>

        <div className="video-info">
          <div id="file-name">{productName}</div>
          <div id="scene-no">{this.state.currentNo}シーン目</div>
        </div>

        <div id="result-screen">

          <div id="movie-screen" className="border-line"><Video videoId={videoId} no={this.state.currentNo}/></div>

          <div id="label-screen" className="border-line">
            <div className="annotation-area">
              <h2 className="heading tag">このシーンのラベル一覧</h2>
              <div className="button-area">
                <div className="edit-btn">
                  <p>編集</p>
                </div>
                <div className="save-btn">
                  <p>保存</p>
                </div>
                <div className="cancel-btn">
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

class Video extends React.Component {
  constructor(props) {
    super(props)
    // 状態の初期化
    this.state = {
      items: null // 読み込んだデータ保存用
    }
  }
  render () {
    const videoId = this.props.videoId
    const currentNo = this.props.no
    const videoPath = '/result/scene/' + videoId + '/scene' + currentNo + '.mp4'
    return (
      <video  src={`${process.env.PUBLIC_URL}` + videoPath} controls="controls" autoPlay="autoplay"></video>
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
  render () {
    const videoId = this.props.videoId
    const currentNo = this.props.no
    const videoPath = '/result/scene/' + videoId + '/scene' + currentNo + '.mp4'
    return (
      <video  src={`${process.env.PUBLIC_URL}` + videoPath} controls="controls" autoPlay="autoplay"></video>
    )
  }
}

class Thumbnail extends React.Component {
  constructor(props) {
    super(props)
    this.clickHandler = this.clickHandler.bind(this)
  }
  render () {

    return (
        <div className="item">
          <img data-id={this.props.videoId}
            className="thumbnail"
            data-scene-no="1"
            src={`${process.env.PUBLIC_URL}` + this.props.imgPath} 
            onClick={this.clickHandler}/>
        </div>
    )
  }
}


export default ResultDetailPage