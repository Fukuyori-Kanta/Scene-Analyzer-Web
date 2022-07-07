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
import UserPage from './LoginPage/UserPageModule'
import NaviMenu from './components/NavigationManu'
import RegistInputPage from './LoginPage/RegistInputPageModule'
import DropdownMenu from './components/DropdownMenu'

// React Routerを使ったメインコンポーネントの定義
const SceneAnalyzerApp = () => (
  <>
    <Header />
    <Routes>
      <Route exact path='/' element={<TopPage />} />
      <Route path='/top' element={<TopPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/user' element={<UserPage />} />
      <Route path='/regist' element={<RegistInputPage />} />
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
    <DropdownMenu />
  </header>
)

const NotFound = () => {
  <div>
    <div><h1>Not Found</h1></div>
  </div>
}

export default SceneAnalyzerApp
