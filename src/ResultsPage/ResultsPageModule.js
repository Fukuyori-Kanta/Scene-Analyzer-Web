import React from 'react'
import { Fetch } from '../Provider/Fetch'
import Breadcrumbs from '../components/Breadcrumbs'
import PaginationProvider from '../Provider/PaginationProvider'
import HelpIcon from '../components/HelpIcon'
import SubTitle from '../components/SubTitle'
import { useParams } from 'react-router-dom'
import SearchProvider from '../Provider/SearchProvider'
import Contents from './Contents'

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
        <SubTitle heading={'結果一覧　' + data.length + ' 件'} />
        <HelpIcon />
      </div>

      <Contents data={data} />
    </div >
  )
}