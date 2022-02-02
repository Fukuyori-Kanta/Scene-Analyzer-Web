import React, {useState, useEffect} from 'react'

const TestPage = () => {
  const [count, setCount] = useState(0)

  const [isEditMode, setEditMode] = useState(false)

  useEffect(() => {
    document.title =`${count}回クリックされました`
    console.log("再レンダーされました")
  }, [count])

  useEffect(() => {
    console.log(isEditMode)
  }, [isEditMode])

  const showMovieScreen = (isEditMode) => {
    if (!isEditMode) {
      return <Video />
    } else {
      return <Canvas />
    }
  }

  return (
    <>
      {showMovieScreen(isEditMode)}
      <button onClick={()=>setEditMode(!isEditMode)}>
        ボタン
      </button>
    </>
  )
}

const Video = () => {
  return (
    <>
      <p>video</p>
    </>
  )
}
const Canvas = () => {
  return (
    <>
      <p>canvas</p>
    </>
  )
}

export default TestPage