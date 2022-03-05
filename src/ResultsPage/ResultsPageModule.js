import React from "react"
import { Fetch } from "../Provider/Fetch"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import Breadcrumbs from '../components/Breadcrumbs'
import VideoList from '../components/VideoList'

export default function ResultsPage({ searchoption, searchWord }) {
  return (
    <Fetch
      uri={`http://192.168.204.128/results`}
      renderSuccess={ResultsPageContents}
    />
  )
}

function ResultsPageContents({ data }) {
  return (
    <div id="result-list">
      <Breadcrumbs />

      <div className="container">
        <div className="left-side">
          <h2 className="heading">結果一覧<span id="scene-count">{data.length}</span>件</h2>
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

      <VideoList dataList={data} id='video-list' />
    </div>
  );
}


function SearchArea() {
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