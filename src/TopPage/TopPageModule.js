import React from 'react'
import { Fetch } from '../Provider/Fetch'
import TransitionButton from './TransitionButton'
import VideoList from '../components/VideoList'

export default function TopPage() {
  return (
    <Fetch
      uri={`/api/history`}
      renderSuccess={TopPageContents}
    />
  )
}

function TopPageContents({ data }) {
  return (
    <div id="index">
      {/* 遷移ボタン */}
      <section id="page-transition">
        <div className="btn-wrapper">
          <TransitionButton herf="/results" value="結果一覧" />
          <TransitionButton herf="/statistics" value="統 計" />
          <TransitionButton herf="/newAnalysis" value="新規分析" />
        </div>
      </section>

      {/* 閲覧履歴 */}
      <section id="recent-videos" className="border-line-vertical">
        <div id="history-heading">
          <h3 className="bgc-gray text-center">閲 覧 履 歴</h3>
        </div>
        <VideoList id='access-history' dataList={data}/>
        <div id="add">
          <a href="/results"><h3 className="bgc-gray text-center border-gray">さらに見る</h3></a>
        </div>
      </section>
    </div>
  )
}
