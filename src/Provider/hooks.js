import { useState, useEffect } from 'react'
import { formatToTimeZone } from 'date-fns-timezone'

export function useFetch(uri) {
  const [data, setData] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uri) return
    fetch(uri)
      .then(data => data.json())
      .then(setData)
      .then(() => setLoading(false))
      .catch(setError)
  }, [uri])

  return {
    loading,
    data,
    error
  }
}

export function useNowDate() {
  return formatToTimeZone(new Date(), 'YYYY-MM-DD HH:mm:ss', { timeZone: 'Asia/Tokyo' })
}