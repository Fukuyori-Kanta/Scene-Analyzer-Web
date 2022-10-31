import React, { useMemo, useEffect, useState } from "react"
import { useTable, useSortBy } from "react-table"
import { Link } from 'react-router-dom'

export default function AnnotationHistoryTable(userId) {

  // テーブルの列定義
  const [state, setState] = useState({
    columns: [
      { Header: "動画ID", accessor: "video_id", disableSortBy: false },
      { Header: "動画名", accessor: "product_name", disableSortBy: false },
      { Header: "シーン番号", accessor: "scene_no", disableSortBy: true },
      { Header: "ラベル名", accessor: "label_name_ja", disableSortBy: false },
      { Header: "操作", accessor: "operation", disableSortBy: false },
      { Header: "X座標", accessor: "x_axis", disableSortBy: true },
      { Header: "Y座標", accessor: "y_axis", disableSortBy: true },
      { Header: "幅", accessor: "width", disableSortBy: true },
      { Header: "高さ", accessor: "height", disableSortBy: true },
      { Header: "タイムスタンプ", accessor: "timestamp", disableSortBy: false }
    ],
  })

  // 作業履歴データ
  const [data, setData] = useState([])

  // 作業履歴データを格納する関数
  useEffect(() => {
    const fetchAnnotationResults = async () => {
      setData(await getAnnotationResult(userId.userId))
    }
    fetchAnnotationResults()
  }, [])

  // 作業履歴を取得する関数
  const getAnnotationResult = async (userId) => {
    let res = await fetch(`/api/annotationResults/` + userId)
    let results = await res.json()

    return results
  }

  // テーブルの設定
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        data: data,
        columns: state.columns,
        initialState: {
          sortBy: [{ id: "product_name", desc: true }], // 動画名列をソートの初期状態
          hiddenColumns: ['video_id'],  // 動画ID列を非表示
        },
      },
      useSortBy
    )

  return (
    <div className="annotation-result">
      <table {...getTableProps()} border="1">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  {column.canSort &&
                    (() => {
                      return (
                        <div>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? "🔽"
                              : "🔼"
                            : ""}
                        </div>
                      )
                    })()}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  // 動画名押下時に該当動画へ遷移
                  if (cell.column.id === 'product_name') {
                    const videoId = row.allCells[0].value // 動画ID
                    const scene_no = row.allCells[2].value.split('_')[1]  // シーン番号
                    const imgPath = './result/thumbnail/' + videoId + '/thumbnail' + scene_no + '.jpg'  // サムネ画像のパス
                    return (
                      <td {...cell.getCellProps()}>
                        {/* サムネ画像 */}
                        {/* <Link to={'/result/' + videoId + '/'}>
                          <img src={imgPath} alt="サムネ" border="0" width="40%" height="20%" />
                        </Link> */}
                        {/* リンク付き動画名 */}
                        <p>
                          <Link to={'/result/' + videoId + '/'}>{cell.render('Cell')}</Link>
                        </p>
                      </td>
                    )
                  }

                  // 各操作にクラスを設定（cssで色付けるため）
                  if (cell.value == 'delete') {
                    return <td {...cell.getCellProps()}><p className="delete">{cell.render('Cell')}</p></td>
                  }
                  else if (cell.value == 'add') {
                    return <td {...cell.getCellProps()}><p className="add">{cell.render('Cell')}</p></td>
                  }
                  else if (cell.value == 'edit') {
                    return <td {...cell.getCellProps()}><p className="edit">{cell.render('Cell')}</p></td>
                  }
                  else if (cell.value == 'moving_scaling') {
                    return <td {...cell.getCellProps()}><p className="moving">moving</p></td>
                  }
                  else {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  }
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}