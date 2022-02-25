import React from 'react'
import BarGraph from './BarGraph'

export default function StatisticsTab({ data }) {
  // 17項目の好感要因リスト（ex ['R1', '出演者']）
  const catList = data.filter(item => {
    return item.ranking === 1 && item.kubun === 'top'
  }).map(item => { return [item.category, item.category_name] })

  // 統計グラフ
  const statisticsGraph = catList.map((item, index) => {
    const tabId = "TAB-" + ('00' + (index + 1)).slice(-2)
    const catName = item[1] // カテゴリー名
    const graphId = "graghArea-" + (index + 1)
    const values = data.filter(d => d.category == item[0])
    let isChecked = false // 最初のタブをデフォルトチェック
    if (tabId == 'TAB-01') {
      isChecked = true
    }
    return (
      <React.Fragment key={tabId}>
        <input id={tabId} type="radio" name="TAB" className="tab-switch" defaultChecked={isChecked ? 'checked' : ''} />
        <label className="tab-label" htmlFor={tabId}>{catName}</label>
        <div className="tab-content">
          <h3 className="margin-left">
            '{catName}' 上位，中位，下位 ラベル件数TOP10
            <span style={{ fontSize: "14px", color: "red", float: "right" }}>
              ※赤字はその区分で多く付与されたラベル
            </span>
          </h3>
          <BarGraph id={graphId} values={values} />
        </div>
      </React.Fragment>
    )
  })
  return (
    <div className="tab-wrap">
      {statisticsGraph}
    </div>
  )
}
