import React, {createContext, useState, useContext, useEffect } from 'react'

const PaginationContext = createContext()
export const usePagination = () => useContext(PaginationContext)

export default function PaginationProvider({ children }) {
  //const totalPageCount = NumberUtil.roundByCeil(dataCounts, numberOfDisplaysPerpage)
  const perPage = 20  // 1ページあたりの表示アイテム数
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    history.pushState({}, '', `?page=${currentPage}`)
  }, [currentPage])

  // ページクリック時のイベント
  const handlePaginate = (selectedPage) => {
    // selectedPage.selectedには、ページ番号 - 1が入る
    const page = selectedPage.selected + 1
    setCurrentPage(page)
  }

  return (
    <PaginationContext.Provider value={{ currentPage, setCurrentPage, handlePaginate, perPage }}>
      {children}
    </PaginationContext.Provider>
  )
}
