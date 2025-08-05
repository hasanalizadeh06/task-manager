import React from 'react'
import { MdErrorOutline } from 'react-icons/md'

function page() {
  return (
    <div className='w-full h-full bg-[#ffffff1a] rounded-2xl flex flex-col items-center justify-center'>
      <MdErrorOutline size={150}/>
      <div className='text-3xl font-semibold text-gray-300 mt-5'>
        This page not found
      </div>
    </div>
  )
}

export default page