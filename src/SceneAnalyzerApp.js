import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'
import './css/style.css'
import TopPage from './TopPage/TopPageModule'
import TestPage from './TestPage/TestPageModule'
import ResultsPage from './ResultsPage/ResultsPageModule'
import ResultDetailPage from './ResultDetailPage/ResultDetailPageModule'
import StatisticsPage from './StatisticsPage/StatisticsPageModule'
import NewAnalysisPage from './NewAnalysisPage/NewAnalysisPageModule'

// React Routerを使ったメインコンポーネントの定義
const SceneAnalyzerApp = () => (
  <Router>
    <Header />
    <Switch>
      <Route exact path='/' component={TopPage} />
      <Route path='/top' component={TopPage} />
      <Route path='/results' component={ResultsPage} />
      <Route path='/result/:id' component={ResultDetailPage} />
      <Route path='/statistics' component={StatisticsPage} />
      <Route path='/newAnalysis' component={NewAnalysisPage} />
      <Route path='/test' component={TestPage} />
      <Route component={NotFound} />
    </Switch>
    {/* <Footer /> */}
  </Router>
)

// ヘッダーの定義
const Header = () => (
  <header className="page-header">
    <NaviMenu
      title="SceneAnalyzer"
      values="結果一覧,統計,新規分析"
      herf="/results,/statistics,/newAnalysis" />
    <HamburgerMenu />
  </header>
)
/*
// フッター
const Footer = () => (
  <div style={styleHeader}>
    分析結果を確認するためのアプリです。
  </div>
)
*/
const NotFound = () => {
  <div>
    <div><h1>Not Found</h1></div>
  </div>
}
/*
// 統計ページのコンポーネント
const StatisticsPage = () => (
  <div><h1>統計</h1></div>
)
*/
/*
// 新規分析ページのコンポーネント
const NewAnalysisPage = () => (
  <div><h1>新規分析</h1></div>
)
*/
// スタイルの定義
const styleHeader = {
  backgroundColor: '#a2a851',
  color: 'white',
  padding: 8
}
class NaviMenu extends React.Component {
  render() {
    const values = this.props.values.split(",") // 遷移先ページ名
    const herf = this.props.herf.split(",") // 遷移先パス

    // 遷移先のページ名とパスの対応リスト作成関数
    const zip = (...arrays) => {
      const length = Math.min(...(arrays.map(arr => arr.length)))
      return new Array(length).fill().map((_, i) => arrays.map(arr => arr[i]))
    }

    const items = zip(values, herf) // 遷移先のページ名とパスの対応リスト
    const itemsObj = items.map(
      (item) => {
        return (
          <li key={item[0]}>
            <a href={item[1]}>{item[0]}</a>
          </li>
        )
      })
    let title = this.props.title  // タイトル
    if (!title) title = "LIST"

    return (
      <div className="left-side">
        <h1 className="headline"><a href="/top">{title}</a></h1>
        <ul className="main-nav">{itemsObj}</ul>
      </div>)
  }
}

// ハンバーガーメニュー
const HamburgerMenu = () => {
  return (
    <div className="right-side">
      <div className="menu-btn">
        <i className="fa fa-bars" aria-hidden="true"></i>
      </div>
      <ul className="menu">
        <li className="menu-item">アカウント</li>
        <li className="menu-item">スコア</li>
        <li className="menu-item">ランキング</li>
        <li className="menu-item"><a href="/help">ヘルプ</a></li>
        <li className="menu-item">お問い合わせ</li>
      </ul>
    </div>
  )
}
export default SceneAnalyzerApp
