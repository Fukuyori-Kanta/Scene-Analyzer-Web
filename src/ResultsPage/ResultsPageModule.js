import React from "react"
import { Fetch } from "../Provider/Fetch"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import Breadcrumbs from '../components/Breadcrumbs'
import VideoList from '../components/VideoList'
import PaginationProvider, { usePagination } from '../Provider/PaginationProvider'
import ReactPaginate from 'react-paginate'
import HelpIcon from '../components/HelpIcon'
import SubTitle from "../components/SubTitle"
import { useLocation } from 'react-router-dom'

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
  const { currentPage, setCurrentPage, perPage, handlePaginate } = usePagination()  // ページネーション用の変数・関数
  const offset = (currentPage - 1) * perPage  // 何番目のアイテムから表示するか

  let location = useLocation()  // 現在のURL
  let page = location.search.substring(location.search.indexOf('=')+1)  // ページ番号
  // console.log(page)
  // console.log(currentPage)
  // if (page != '' && page != currentPage) {
  //   console.log("変えるよ")
  //   setCurrentPage(page)
  //   //history.pushState({}, '', `?page=${page}`)
  //   //console.log("何もないよ")
  // } 
  

  return (
    <div id="result-list">
      <Breadcrumbs />
      <div className="flex">
        <SubTitle heading={"結果一覧　" + data.length + " 件"} />
        <HelpIcon />
      </div>

      <div className="grid-container">
        <ReactPaginate
          forcePage={currentPage-1}
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          pageCount={Math.ceil(data.length / perPage)} // 全部のページ数。端数の場合も考えて切り上げに。
          marginPagesDisplayed={2} // 一番最初と最後を基準にして、そこからいくつページ数を表示するか
          pageRangeDisplayed={3} // アクティブなページを基準にして、そこからいくつページ数を表示するか
          onPageChange={handlePaginate} // クリック時のfunction
          containerClassName={'pagination'} // ページネーションであるulに着くクラス名
          subContainerClassName={'pages pagination'}
          activeClassName={'active'} // アクティブなページのliに着くクラス名
          previousClassName={'pagination__previous'} // 「<」のliに着けるクラス名
          nextClassName={'pagination__next'} // 「>」のliに着けるクラス名
          disabledClassName={'pagination__disabled'} // 使用不可の「<,>」に着くクラス名
        />

        <SearchArea />
      </div>

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
