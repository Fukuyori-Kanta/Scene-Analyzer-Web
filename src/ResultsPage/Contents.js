import React, { useEffect } from "react"
import VideoList from '../components/VideoList'
import { usePagination } from '../Provider/PaginationProvider'
import ReactPaginate from 'react-paginate'
import { useLocation } from 'react-router-dom'
import SearchArea from './SearchArea'

export default function Contents({ data }) {
  const { currentPage, setCurrentPage, perPage, handlePaginate } = usePagination()  // ページネーション用の変数・関数
  
  // 遷移先からのhistory-back(ブラウザバック)に対応
  let location = useLocation()  // 現在のURL
  let page = location.search.substring(location.search.indexOf('=') + 1)  // ページ番号

  const offset = (currentPage - 1) * perPage  // 何番目のアイテムから表示するか
  
  useEffect(() => {
    // 前のページの状態があるなら
    if (page != '' && currentPage == 1) {
      setCurrentPage(page)
    }
  },[page])
  
  return (
    <>
      <div className="grid-container">
        <ReactPaginate
          forcePage={currentPage - 1}
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
    </>
  )
}