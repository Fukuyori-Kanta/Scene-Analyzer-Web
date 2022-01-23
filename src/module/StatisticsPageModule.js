import React from 'react'
import request from 'superagent'
import Breadcrumbs from './Breadcrumbs'

class BarGraph extends React.Component {
  constructor(props) {
    super(props)
    // 状態の初期化
    this.state = {
      items: null // 読み込んだデータ保存用
    }
  }
  // マウントされるとき
  componentWillMount() {
    const category = this.props.category
    // JSONデータを読み込む
    request.get('http://192.168.204.128/statistics/' + category)
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
    console.log(res)
    // 状態を更新
    this.setState({
      items: res.body
    })
  }
  render() {
    return (<div>{this.state.items}</div>)
  }

}

class StatisticsPage extends React.Component {
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
    request.get('http://192.168.204.128/category')
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
    /*
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
    else {
      const tabList = this.state.items.map((ctg, index) => {
        const id = "TAB-" + ('00' + index + 1).slice(-2);

        const subtitle = ctg.category_name + "上位，中位，下位 ラベル件数TOP10"
        return (
          <React.Fragment>
            <input id={id} type="radio" name="TAB" className="tab-switch" />
            <label className="tab-label" htmlFor={id}>{ctg.category_name}</label>
            <div className="tab-content">
              <h3 className="margin-left">{subtitle}</h3>
              <div id="graghArea-1" className="flex" ><BarGraph category={ctg.category_name} /></div>
            </div>
          </React.Fragment>
        )
      })
      return (
        <div className="tab-wrap">
          {tabList}
        </div>
      )  
    }
    */
    return (
      <div>
        <Breadcrumbs />
      </div>
    )
  }
}

/*
class StatisticsPage extends React.Component {
  render() {
    return (
      <div className="tab-wrap">
        <CategoryTabList />
      </div>
    )
  }
}
*/



export default StatisticsPage