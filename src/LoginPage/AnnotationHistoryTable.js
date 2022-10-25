import React, { useMemo, useEffect, useState } from "react"
import { useTable, useSortBy } from "react-table"

export default function AnnotationHistoryTable(userId) {

  // テーブルの列定義
  const [state, setState] = useState({
    columns: [
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
          sortBy: [{ id: "product_name", desc: true }],
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
                  if (cell.value == 'add') {
                    return <td {...cell.getCellProps()} className='add'>{cell.render("Cell")}</td>
                  }
                  else if (cell.value == 'delete') {
                    return <td {...cell.getCellProps()} className='delete'>{cell.render("Cell")}</td>
                  }
                  else if (cell.value == 'moving_scaling') {
                    return <td {...cell.getCellProps()} className='moving'>{cell.render("Cell")}</td>
                  }
                  else {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
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