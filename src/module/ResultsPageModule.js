import React from 'react'
import request from 'superagent'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import {
  BrowserRouter as Router,
  Route, 
  Link, 
  Switch
} from 'react-router-dom'
import ResultDetailPage from './ResultDetailPageModule'

class Button extends React.Component {
  render () {
    const value = this.props.value  // 遷移先ページ名
    const herf = this.props.herf // 遷移先パス
    return (
      <a className="button" href={herf}>{value}</a>
    )
  }
}



class ResultsPage extends React.Component {
  constructor(props) {
    super(props)
    // 状態の初期化
    this.state = {
      items: null // 読み込んだデータ保存用
    }
  }
  // マウントされるとき
  componentWillMount() {
    // JSONデータを読み込む
    request.get('http://192.168.204.128/results')
      .end((err, res) => {
        this.loadedJSON(err, res)
      })
  }
  // データを読み込んだとき
  loadedJSON(err, res) {
    if (err) {
      console.log('JSON読み込みエラー')
      return
    }
    // 状態を更新
    this.setState({
      items: res.body
    })
  }
  render() {
    const styleNowLoding = {
      margin: "10px"
    }
    // JSONデータの読み込みが完了してるか?
    if (!this.state.items) {
      return (
        <div className='App' style={styleNowLoding}>
          <h2>読み込み中...</h2>
        </div>
      )
    }

    const allCount = this.state.items.length  // 全CM数
    
    // サムネ画像
    const thumbnail = this.state.items.map(e => {
      const videoId = e.video_id
      const productName = e.product_name
      const imgPath = '/result/thumbnail/' + videoId + '/thumbnail1.jpg'
      return (
        <Thumbnail videoId={videoId} productName={productName} imgPath={imgPath} key={videoId}/>
      )
    })
    
    return (
      <div id="result-list">
        <div className="bread">
          <ul>
            <li><a href="/top">トップページ</a></li>
            <li><a href="/results">結果一覧</a></li>
          </ul>
        </div>

        <div className="container">
          <div className="left-side">
            <h2 className="heading">結果一覧<span id="scene-count">{allCount}</span>件</h2>
            <div className="help-area">
              <div className="help-icon">?</div>
              <div className="tooltip">
                これまで分析してきた１０００ＣＭの分析結果を閲覧できます。<br />
                気になるＣＭがあればクリックして確認してみてください。
                <a href="/help">詳細</a>
              </div>
            </div>
          </div>
          <form method="get" action="#" className="search_container grid">
            <div id="search-option">
              <input type="radio" name="search-option" value="video-name" id="video-name" />
              <label htmlFor="video-name" className="radio-label">動画名</label>

              <input type="radio" name="search-option" value="label-name" id="label-name" />
              <label htmlFor="label-name" className="radio-label">ラベル名</label>
            </div>

            <div id="search-area">
              <input id="search-word" type="text" size="25" placeholder="動画名を検索" />
              <FontAwesomeIcon id="search-button" icon={faSearch} />
            </div>
          </form>
        </div>

        <div id="video-list">{thumbnail}</div>
      </div>
    )
  }
}

class Thumbnail extends React.Component {
  constructor(props) {
    super(props)
    this.clickHandler = this.clickHandler.bind(this)
  }
  clickHandler (e) {
    
    //window.alert(e.currentTarget.dataset.id);
    //const clickedVideoId = this.
    //console.log(clickedVideoId)
  }
  render () {
    return (
        <div className="item">
          <Link to={'result/' + this.props.videoId}>
            <img data-id={this.props.videoId}
              className="thumbnail"
              src={`${process.env.PUBLIC_URL}` + this.props.imgPath} 
              onClick={this.clickHandler}/>
          </Link>
          <Link to={'result/' + this.props.videoId}>
            <p className="video-name" 
              data-id={this.props.videoId}
              onClick={this.clickHandler}>{this.props.productName}</p>
          </Link>
        </div>
    )
  }
}

export default ResultsPage