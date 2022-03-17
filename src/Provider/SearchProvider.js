import React, { createContext, useState, useContext } from "react";

const SearchContext = createContext();
export const useSearch = () => useContext(SearchContext);

export default function SearchProvider({ children }) {
  const [searchWord, setSearchWord] = useState('')  // 検索ワード（最大3単語）
  const [selectedOption, setSelectedOption] = useState('video-name')  // 検索オプション

  return (
    <SearchContext.Provider value={{ searchWord, setSearchWord, selectedOption, setSelectedOption }}>
      {children}
    </SearchContext.Provider>
  )
}
