import React from 'react'
import Navbar from '../Navbar'

function Home() {
  return (
    <div className='w-full min-h-screen bg-neutral-300'>
        <Navbar />
        <div className='p-2 ml-16'>

            <h1 className='text-sm mb-3 p-3 uppercase font-bold text-gray-700'>Home</h1>

        </div>
    </div>
  )
}

export default Home
