import React from 'react'
import request from 'superagent'
import Thumbnail from './Thumbnail'

class Button extends React.Component {
  render() {
    const value = this.props.value  // 遷移先ページ名
    const herf = this.props.herf // 遷移先パス
    return (
      <a className="button" href={herf}>{value}</a>
    )
  }
}

class TopPage extends React.Component {
  constructor(props) {
    super(props)
    // 状態の初期化
    this.state = {
      items: null // 読み込んだデータ保存用
    }
  }
  // マウントされるとき
  componentWillMount() {
    // JSONデータを読み込む --- (※2)
    request.get('http://192.168.204.128/history')
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
    // 状態を更新 --- (※4)
    this.setState({
      items: res.body
    })
  }
  render() {
    // JSONデータの読み込みが完了してるか? --- (※5)
    if (!this.state.items) {
      return <div className='App'>
        現在読み込み中</div>
    }
    // 読み込んだデータからselect要素を作る --- (※6)
    const thumbnail = this.state.items.map(e => {
      const videoId = e.video_id
      const productName = e.product_name
      const imgPath = '/result/thumbnail/' + videoId + '/thumbnail1.jpg'
      return (
        <Thumbnail videoId={videoId} productName={productName} imgPath={imgPath} key={videoId} />
      )
    })
    return (
      <div id="index">
        <section id="page-transition">
          <div className="btn-wrapper">
            <Button herf="/results" value="結果一覧" />
            <Button herf="/statistics" value="統 計" />
            <Button herf="/newAnalysis" value="新規分析" />
          </div>
        </section>

        <section id="recent-videos" className="border-line-vertical">
          <div id="history-heading">
            <h3 className="bgc-gray text-center">閲 覧 履 歴</h3>
          </div>

          <div id="access-history">
            {thumbnail}
          </div>

          <div id="add">
            <a href="/results"><h3 className="bgc-gray text-center border-gray">さらに見る</h3></a>
          </div>

        </section>
      </div>
    )
  }
}

export default TopPage