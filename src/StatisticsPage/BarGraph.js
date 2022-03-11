import React from 'react'

export default function BarGraph({ id, values }) {
  const kubunDict = { 'top': '上位', 'mid': '中位', 'btm': '下位' } // 区分の辞書

  const chart = Object.keys(kubunDict).map(kubun => {
    const kubunName = kubunDict[kubun]  // 区分（上位、中位、下位 のいずれか）
    const targetVal = values.filter(item => item.kubun === kubun) // 描画用データ
    return (
      <div className="chart-wrap" key={kubun}>
        <div className="chart-title">{kubunName}</div>
        <div id="dashboard-stats" className="chart bars-horizontal brand-primary"></div>

        <Chart data={targetVal} kubun={kubun} />
      </div>
    )
  })

  return (
    <div id={id} className="flex">
      {chart}
    </div>
  )
}

function Chart({ data, kubun }) {
  const max_value = Math.max.apply(Math, data.map(d => d.count)) // 最大値

  // チャートの色設定（区分ごとに変更）
  let backgroundcColor = ''
  switch (kubun) {
    case 'top':
      backgroundcColor = 'linear-gradient(45deg, #7fc3ff, #6bb6ff)'
      break;
    case 'mid':
      backgroundcColor = 'linear-gradient(45deg, rgb(195, 255, 127), rgb(182, 255, 107))'
      break
    default:
      backgroundcColor = 'linear-gradient(45deg, rgb(255, 127, 195), rgb(255, 107, 182))'
      break
  }

  return (
    <>
      {
        data.map((val, index) => {
          const percent = Math.ceil((val.count / max_value) * 100) // 最大値からみた該当データの割合
          const style = {
            width: percent,
            background: backgroundcColor
          }

          // 正規化した値が0.2以上の場合（その区分特有のラベル）、赤字にする
          let isRedColor = false
          if (val.norm >= 0.2) {
            isRedColor = true
          }

          return (
            <div className="row" key={index}>
              <span className="label" style={{ color: isRedColor ? '#F00' : '#000' }}>{val.label}</span>
              <div className="bar-wrap">
                <div className="bar in" data-value={val.count} data-class={kubun} style={style}></div>
              </div><span className="count">{val.count}</span>
            </div>
          )
        })
      }
    </>
  )
}