import React, { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

export default function SearchArea() {
  const [searchWord, setSearchWord] = useState('')
  const [sercheOption, setSearchOption] = useState('video-name')

  const go = (event) => {
    //event.preventDefault();
    //console.log(searchWord)
    //window.location.href = "/results/"
    
  }

  const handleChange = (event) => {
    setSearchWord(event.target.value);
  }

  useEffect(() => {
    console.log(searchWord)
  }, [searchWord])



  return (
    <form className="search_container grid" >
      <div id="search-option">
        <input type="radio" name="search-option" value="video-name" id="video-name" />
        <label htmlFor="video-name" className="radio-label">動画名</label>

        <input type="radio" name="search-option" value="label-name" id="label-name" />
        <label htmlFor="label-name" className="radio-label">ラベル名</label>
      </div>

      <div id="search-area">
        <input id="search-word" type="text" size="25" placeholder="動画名を検索" onChange={handleChange}/>
        <FontAwesomeIcon id="search-button" icon={faSearch} />
      </div>
    </form>
  )
}


