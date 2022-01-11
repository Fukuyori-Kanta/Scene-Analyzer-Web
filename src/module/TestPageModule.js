import React, { Component } from 'react'

// SuperAgentの利用を宣言 --- (※1)
import request from 'superagent'
/*
class TestPage extends Component {
  constructor (props) {
    super(props)
    // 状態の初期化
    this.state = {
      items: null // 読み込んだデータ保存用
    }
  }
  // マウントされるとき
  componentWillMount () {
    // JSONデータを読み込む --- (※2)
    request.get('/192.168.204.128')
      .end(function(err, res) {
        if (err) {
          console.log(err);
        } 
        console.log(res)
        this.setState({
          items: res.body
        })
      });
  }
  
  render () {
    const result = this.state.items.map(e => {
      return (
        <h3>{e.video_id}</h3>
      )
    })
    return result
  }
}

*/
class TestPage extends Component {
  constructor (props) {
    super(props)
    // 状態の初期化
    this.state = {
      items: null // 読み込んだデータ保存用
    }
  }
  // マウントされるとき
  componentWillMount () {
    // JSONデータを読み込む --- (※2)
    request.get('http://192.168.204.128/history')
      .end((err, res) => {
        this.loadedJSON(err, res)
      })
  }
  // データを読み込んだとき --- (※3)
  loadedJSON (err, res) {
    if (err) {
      console.log('JSON読み込みエラー')
      return
    }
    // 状態を更新 --- (※4)
    this.setState({
      items: res.body
    })
  }
  render () {
    // JSONデータの読み込みが完了してるか? --- (※5)
    if (!this.state.items) {
      return <div className='App'>
        現在読み込み中</div>
    }
    // 読み込んだデータからselect要素を作る --- (※6)
    const options = this.state.items.map(e => {
      return <option value={e.video_id} key={e.video_id}>
        {e.product_name}
      </option>
    })
    const path = './result/scene/' + this.state.items[0].video_id + '/scene2.mp4'
    console.log(path)
    /*
    return (
      <h3>{options}</h3>
      <video src="C:\Users\fukuyori\Scene-Analyzer\resources\app\result\scene\K201076840\scene1.mp4" controls="controls" autoplay="autoplay"></video>
    )
    */
    return (
      <video src={path} controls="controls" autoPlay="autoplay"></video>
    )
  }
}

export default TestPage
