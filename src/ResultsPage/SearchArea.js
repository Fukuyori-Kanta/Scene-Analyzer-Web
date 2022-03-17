import React, { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { useSearch } from "../Provider/SearchProvider"
import { useHistory } from "react-router"

export default function SearchArea() {
  const { searchWord, setSearchWord, selectedOption, setSelectedOption } = useSearch()
  const history = useHistory()

  // 
  const handleChange = (event) => {
    setSearchWord(event.target.value);
  }

  // オプション変更時の処理
  const onOptionChange = (event) => {
    setSelectedOption(event.target.value)
  }

  const formSubmit = (event) => {
    event.preventDefault();
    history.push(`/search/` + selectedOption + `/` + searchWord)
  }

  // useEffect(() => {
  //   console.log(searchWord)
  // }, [searchWord])

  return (
    <form className="search_container grid" onSubmit={formSubmit} >
      <div id="search-option">
        <input id="video-name"
               type="radio"
               name="search-option"
               value="video-name"
               checked={selectedOption === 'video-name'}
               onChange={onOptionChange}
        />
        <label htmlFor="video-name" className="radio-label">動画名</label>

        <input id="label-name"
               type="radio" 
               name="search-option" 
               value="label-name"  
               checked={selectedOption === 'label-name'} 
               onChange={onOptionChange}
        />
        <label htmlFor="label-name" className="radio-label">ラベル名</label>
      </div>

      <div id="search-area">
        <input id="search-word" type="text" size="25" placeholder="動画名を検索" onChange={handleChange} />
        <FontAwesomeIcon id="search-button" icon={faSearch} onClick={formSubmit} />
      </div>
    </form>
  )
}


