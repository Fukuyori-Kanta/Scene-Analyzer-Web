import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './css/style.css'
import TopPage from './TopPage/TopPageModule'
import LoginPage from './LoginPage/LoginPageModule'
import TestPage from './TestPage/TestPageModule'
import ResultsPage from './ResultsPage/ResultsPageModule'
import ResultDetailPage from './ResultDetailPage/ResultDetailPageModule'
import StatisticsPage from './StatisticsPage/StatisticsPageModule'
import NewAnalysisPage from './NewAnalysisPage/NewAnalysisPageModule'
import LabelListPage from './LabelListPage/LabelListPageModule'
import UserPage from './UserPageModule'
import NaviMenu from './components/NavigationManu'

// React Routerを使ったメインコンポーネントの定義
const SceneAnalyzerApp = () => (
  <>
    <Header />
    <Routes>
      <Route exact path='/' element={<TopPage />} />
      <Route path='/top' element={<TopPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/user' element={<UserPage />} />
      <Route path='/results' element={<ResultsPage />} />
      <Route path='/search/:option/:words' element={<ResultsPage />} />
      <Route path='/result/:id' element={<ResultDetailPage />} />
      <Route path='/statistics' element={<StatisticsPage />} />
      <Route path='/newAnalysis' element={<NewAnalysisPage />} />
      <Route path='/labels' element={<LabelListPage />} />
      {/* <Route path='/test'  element={<TestPage />} /> */}
      <Route element={<NotFound />} />
    </Routes>
    {/* <Footer /> */}
  </>
)

// ヘッダーの定義
const Header = () => (
  <header className="page-header">
    <NaviMenu
      title="SceneAnalyzer"
      values="結果一覧,統計,新規分析,ラベル一覧"
      herf="/results,/statistics,/newAnalysis,/labels" />
    {/* <HamburgerMenu /> */}
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


// ハンバーガーメニュー
// const HamburgerMenu = () => {
//   return (
//     <div className="right-side">
//       <div className="menu-btn">
//         <i className="fa fa-bars" aria-hidden="true"></i>
//       </div>
//       <ul className="menu">
//         <li className="menu-item">アカウント</li>
//         <li className="menu-item">スコア</li>
//         <li className="menu-item">ランキング</li>
//         <li className="menu-item"><a href="/help">ヘルプ</a></li>
//         <li className="menu-item">お問い合わせ</li>
//       </ul>
//     </div>
//   )
// }
export default SceneAnalyzerApp
