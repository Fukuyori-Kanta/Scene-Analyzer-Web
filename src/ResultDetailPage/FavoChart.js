import React from 'react'
import { useCurrent } from '../Provider/CurrentProvider'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
} from 'chart.js'
import 'chartjs-adapter-moment'

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
)

export default function FavoChart({ favoData, frameData }) {
  const { currentScene, changeCurrentScene } = useCurrent()

  // 全角 → 半角に変換する関数
  function zenkaku2Hankaku(str) {
    return str.replace(/[A-Za-z0-9]/g, function (s) {
      return String.fromCharCode(s.charCodeAt(0) + 0xFEE0)
    })
  }

  // フレーム数をそのシーンまでの時間（秒:ミリ秒 = ss:SSS）にする
  let time = frameData.map((frame, index) => {
    return (Math.round((frameData.slice(0, index + 1).reduce((sum, element) => sum + element, 0) / 30) * 1000) / 1000).toFixed(3);
  })

  // x軸ラベル（シーン〇  〇は全角数字）
  const xAxisLabels = [...Array(favoData.length).keys()].map((d) => { return "シーン" + zenkaku2Hankaku(String(d + 1)); })

  // 描画するグラフのデータ
  const lineChartData = {
    labels: time,
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
      // ツールチップを数値からシーン数に変更
      tooltip: {
        callbacks: {
          title: function (context) {
            let title = ''

            if (context[0].parsed.y !== null) {
              title += xAxisLabels[context[0].dataIndex] // シーン数に変更
            }
            return title
          }
        }
      }
    },
    // アニメーション無し
    animation: false,
    // 大きさ
    scales: {
      x: {
        // 軸ラベル表示
        display: true,
        title: {
          display: true,
          text: '秒',
          font: { size: 14 },
        },
        // 時間軸の設定
        type: 'time',
        time: {
          parser: 'ss.SSS',
          unit: 'second',
          stepSize: 1,
          displayFormats: {
            'second': 'ss'
          }
        },
        // X軸の範囲を指定（maxはデータの最大値）
        ticks: {
          min: 0,
          max: Math.round((time[time.length-1]))
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: '好感度スコア',
          font: { size: 14 },
        },
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