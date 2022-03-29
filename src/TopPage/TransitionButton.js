import React from 'react'

export default function TransitionButton({ herf, value }) {
  return (
    <a className="button" href={herf}>{value}</a>
  )
}