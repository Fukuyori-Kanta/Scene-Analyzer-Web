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
import { useLocation, useParams } from 'react-router-dom'
import SearchArea from './SearchArea'
import SearchProvider from "../Provider/SearchProvider"
import Contents from "./Contents"

export default function ResultsPage() {
  const selectedOption = useParams().option // 検索オプション
  const searchWord = useParams().words  // 検索ワード

  return (
    <SearchProvider>
      <PaginationProvider>
        {
          !searchWord
            ?
            <Fetch
              uri={`/api/results`}
              renderSuccess={ResultsPageContents}
            />
            :
            <Fetch
              uri={`/api/results/` + selectedOption + `/` + decodeURI(searchWord)}
              renderSuccess={ResultsPageContents}
            />
        }
      </PaginationProvider>
    </SearchProvider>
  )
}

function ResultsPageContents({ data }) {
  return (
    <div id="result-list">
      <Breadcrumbs />
      <div className="flex">
        <SubTitle heading={"結果一覧　" + data.length + " 件"} />
        <HelpIcon />
      </div>

      <Contents data={data} />
    </div >
  )
}