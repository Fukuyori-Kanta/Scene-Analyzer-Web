import React, { useState, useEffect } from "react"
import { Fetch } from "../Provider/Fetch"
import Breadcrumbs from '../components/Breadcrumbs'
import StatisticsTab from './StatisticsTab'

export default function StatisticsPage() {
  return (
    <Fetch
      uri={`http://192.168.204.128/statistics`}
      renderSuccess={StatisticsPageContents}
    />
  )
}

function StatisticsPageContents({ data }) {
  return (
    <div id="statistics">
      <Breadcrumbs />

      <h2 className="heading margin-left">統計データ</h2>
      <StatisticsTab data={data} />
    </div>
  )
}