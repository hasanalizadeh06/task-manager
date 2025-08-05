'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function Breadcrumb() {
  const path = usePathname()

  const allSegments = path.split('/').filter(Boolean)

  const displaySegments = allSegments.slice(-2)

  const startIndex = allSegments.length - displaySegments.length

  const breadcrumbs = displaySegments.map((segment, idx) => {
    const realIndex = startIndex + idx
    const href = '/' + allSegments.slice(0, realIndex + 1).join('/')

    let label = segment.replace(/%20/g, ' ')
    if (label.length > 30) label = label.slice(0, 30) + '...'
    label = label.charAt(0).toUpperCase() + label.slice(1)

    return (
      <span key={realIndex}>
        <Link href={href}>
          {label}
        </Link>
        {idx < displaySegments.length - 1 && ' / '}
      </span>
    )
  })

  return (
    <div className='text-xl font-semibold'>
      {allSegments.length > 2 && <span className="text-gray-400">... / </span>}
      {breadcrumbs}
    </div>
  )
}

export default Breadcrumb
