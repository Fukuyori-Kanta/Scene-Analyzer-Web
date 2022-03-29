import React from 'react'

/* サブタイトル */
export default function SubTitle({ heading = '' }) {
  return (
    <h2 className="heading">{heading}</h2>
  )
}