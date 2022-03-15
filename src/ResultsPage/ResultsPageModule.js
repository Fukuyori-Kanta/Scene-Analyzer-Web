import React from "react"
import { Fetch } from "../Provider/Fetch"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import Breadcrumbs from '../components/Breadcrumbs'
import VideoList from '../components/VideoList'
import PaginationProvider, { usePagination } from '../Provider/PaginationProvider'
import ReactPaginate from 'react-paginate'

export default function ResultsPage({ searchoption, searchWord }) {
  return (
    <PaginationProvider>
      <Fetch
        uri={`/api/results`}
        renderSuccess={ResultsPageContents}
      />
    </PaginationProvider>
  )
}

function ResultsPageContents({ data }) {
  const { currentPage, perPage, handlePaginate } = usePagination()  // ページネーション用の変数・関数
  const offset = (currentPage - 1) * perPage  // 何番目のアイテムから表示するか

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
      
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        pageCount={Math.ceil(data.length / perPage)} // 全部のページ数。端数の場合も考えて切り上げに。
        marginPagesDisplayed={2} // 一番最初と最後を基準にして、そこからいくつページ数を表示するか
        pageRangeDisplayed={5} // アクティブなページを基準にして、そこからいくつページ数を表示するか
        onPageChange={handlePaginate} // クリック時のfunction
        containerClassName={'pagination'} // ページネーションであるulに着くクラス名
        subContainerClassName={'pages pagination'}
        activeClassName={'active'} // アクティブなページのliに着くクラス名
        previousClassName={'pagination__previous'} // 「<」のliに着けるクラス名
        nextClassName={'pagination__next'} // 「>」のliに着けるクラス名
        disabledClassName={'pagination__disabled'} // 使用不可の「<,>」に着くクラス名
      />

      <VideoList dataList={data.slice(offset, offset + perPage)} id='video-list' />
    </div >
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
