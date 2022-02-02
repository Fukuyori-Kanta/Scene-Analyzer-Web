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
import Breadcrumbs from './Breadcrumbs'
import Thumbnail from './Thumbnail'

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
        <Thumbnail videoId={videoId} productName={productName} imgPath={imgPath} key={videoId} />
      )
    })

    return (
      <div id="result-list">
        <Breadcrumbs />

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
          <SearchArea />

        </div>

        <div id="video-list">{thumbnail}</div>

      </div>
    )
  }
}

class SearchArea extends React.Component {
  constructor(props) {
    super(props)
    const value = (this.props.value) ? this.props.value : '' // 検索ワード
    // 状態の初期化
    this.state = {
      value: value,
      
      isOK: this.checkValue(value)

    }
  }// パターンに合致するかチェック --- (※2)
  checkValue(s) {
    const zipPattern = /^\d{3}-\d{4}$/
    return zipPattern.test(s)
  }
  // 値がユーザーにより変更されたとき --- (※3)
  handleChange(e) {
    const v = e.target.value
    // 数値とハイフン以外を除外
    const newValue = v.replace(/[^0-9-]+/g, '')
    const newIsOK = this.checkValue(newValue)
    // 状態に設定
    this.setState({
      value: newValue,
      isOK: newIsOK
    })
    // イベントを実行する --- (※4)
    if (this.props.onChange) {
      this.props.onChange({
        target: this,
        value: newValue,
        isOK: newIsOK
      })
    }
  }
  // プロパティが変更されたとき --- (※5)
  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
      isOK: this.checkValue(nextProps.value)
    })
  }
  // 描画 --- (※6)
  render() {
    const msg = this.renderStatusMessage()
    return (
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
    )
  }
  // 入力が正しいかどうかのメッセージ --- (※7)
  renderStatusMessage() {
    // メッセージ表示用の基本的なStyle
    const so = {
      margin: '8px',
      padding: '8px',
      color: 'white'
    }
    let msg = null
    if (this.state.isOK) { // OKのとき
      so.backgroundColor = 'green'
      msg = <span style={so}>OK</span>
    } else { // NGのとき (ただし空白の時は非表示)
      if (this.state.value !== '') {
        so.backgroundColor = 'red'
        msg = <span style={so}>NG</span>
      }
    }
    return msg
  }
}

// class SearchArea extends React.Component {
//   constructor(props) {
//     super(props)
//     const value = (this.props.value) ? this.props.value : '' // 検索ワード
//     // 状態の初期化
//     this.state = {
//       value: value, 
//       isOK: this.checkValue(value)

//     }
//   }// パターンに合致するかチェック --- (※2)
//   checkValue (s) {
//     const zipPattern = /^\d{3}-\d{4}$/
//     return zipPattern.test(s)
//   }
//   // 値がユーザーにより変更されたとき --- (※3)
//   handleChange (e) {
//     const v = e.target.value
//     // 数値とハイフン以外を除外
//     const newValue = v.replace(/[^0-9-]+/g, '')
//     const newIsOK = this.checkValue(newValue)
//     // 状態に設定
//     this.setState({
//       value: newValue,
//       isOK: newIsOK
//     })
//     // イベントを実行する --- (※4)
//     if (this.props.onChange) {
//       this.props.onChange({
//         target: this,
//         value: newValue,
//         isOK: newIsOK
//       })
//     }
//   }
//   // プロパティが変更されたとき --- (※5)
//   componentWillReceiveProps (nextProps) {
//     this.setState({
//       value: nextProps.value,
//       isOK: this.checkValue(nextProps.value)
//     })
//   }
//   // 描画 --- (※6)
//   render () {
//     const msg = this.renderStatusMessage()
//     return (
//       <div>
//         <label>郵便番号: <br />
//           <input type='text'
//             placeholder='郵便番号を入力'
//             value={this.state.value}
//             onChange={e => this.handleChange(e)} />
//           {msg}
//         </label>
//       </div>
//     )
//   }
//   // 入力が正しいかどうかのメッセージ --- (※7)
//   renderStatusMessage () {
//     // メッセージ表示用の基本的なStyle
//     const so = {
//       margin: '8px',
//       padding: '8px',
//       color: 'white'
//     }
//     let msg = null
//     if (this.state.isOK) { // OKのとき
//       so.backgroundColor = 'green'
//       msg = <span style={so}>OK</span>
//     } else { // NGのとき (ただし空白の時は非表示)
//       if (this.state.value !== '') {
//         so.backgroundColor = 'red'
//         msg = <span style={so}>NG</span>
//       }
//     }
//     return msg
//   }
// }


export default ResultsPage