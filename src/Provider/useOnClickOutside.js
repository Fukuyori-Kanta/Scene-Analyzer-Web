import { useEffect } from 'react'

// 要素の外をクリックしたら発火するカスタムフック
export default function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // 該当の要素なら何もしない
      if (!ref.current || ref.current.contains(event.target)) {
        return
      }
      handler(event)
    }
    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler])
}