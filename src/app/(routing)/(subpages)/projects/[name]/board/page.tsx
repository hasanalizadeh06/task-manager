"use client";
import React from 'react'
import BoardTasks from '@/components/BoardTasks'

function page() {
  return (
    <div className="flex gap-6 scrollbar h-full overflow-auto pb-6">
      <BoardTasks/>
    </div>
  )
}

export default page

