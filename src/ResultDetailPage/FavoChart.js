import React from 'react'
import { useCurrent } from '../Provider/CurrentProvider'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function FavoChart({ favoData }) {
  const { currentScene, changeCurrentScene } = useCurrent()

  // 全角 → 半角に変換する関数
  function zenkaku2Hankaku(str) {
    return str.replace(/[A-Za-z0-9]/g, function (s) {
      return String.fromCharCode(s.charCodeAt(0) + 0xFEE0)
    })
  }

  // x軸ラベル（シーン〇  〇は全角数字）
  const xAxisLabels = [...Array(favoData.length).keys()].map((d) => { return "シーン" + zenkaku2Hankaku(String(d + 1)); })

  // 描画するグラフのデータ
  const lineChartData = {
    labels: xAxisLabels,
    datasets: [
      {
        label: '好感度',
        lineTension: 0,
        data: favoData,
        borderColor: '#00a0dcff',
        backgroundColor: '#00a0dc11',
        pointRadius: [3],
      }
    ]
  }
  // グラフのオプション
  const lineChartOption = {
    plugins: {
      // 凡例無し
      legend: {
        display: false
      },
    },
    // アニメーション無し
    animation: false,
    // 大きさ
    scales: {
      y: {
        ticks: {
          min: 0,
          stepSize: 0.01,
        },
      },
    },
    // クリックイベント
    onClick: function (evt, elements, chartInstance) {
      if (!elements.length) {
        return
      }
      const clickedScene = elements[0].index + 1 // クリックしたシーン番号

      // クリックしたシーンに遷移
      changeCurrentScene(clickedScene)
    },
  }
  // ポイントの大きさを設定（現在シーンには、大きくポイントを描画）
  for (let i = 0; i < lineChartData.datasets[0].data.length; i++) {
    lineChartData.datasets[0].pointRadius[i] = 3

  }
  lineChartData.datasets[0].pointRadius[currentScene - 1] = 10

  return (
    <>
      <h2 className="tag">このシーンの好感度</h2>
      <div className="favo-gragh">
        <Line data={lineChartData} options={lineChartOption} />
      </div>
    </>
  )
}