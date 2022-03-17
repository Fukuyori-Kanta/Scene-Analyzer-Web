import React, { useState, useEffect } from "react"
import { Fetch } from "../Provider/Fetch"
import Breadcrumbs from '../components/Breadcrumbs'
import StatisticsTab from './StatisticsTab'
import SubTitle from '../components/SubTitle'

export default function StatisticsPage() {
  return (
    <Fetch
      uri={`/api/statistics`}
      renderSuccess={StatisticsPageContents}
    />
  )
}

function StatisticsPageContents({ data }) {
  return (
    <div id="statistics">
      <Breadcrumbs />
      <SubTitle heading="統計データ" />
      
      <StatisticsTab data={data} />
    </div>
  )
}
