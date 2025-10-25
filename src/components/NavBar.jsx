import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <div className='min-w-screen relative flex flex-col px-8 md:px-20 pt-6 pb-2 md:pt-10 md:pb-6 gap-1 md:gap-2 bg-black/50 text-left'>
        <h2 className="text-3xl md:text-6xl py-0 font-bold hover:text-gray-300"> 
            <Link to="/">
                ETERNAL RULER 
            </Link>
        </h2>
        <div className='text-xl md:text-4xl pb-4 text-red-300'>♾⛥⚡📖 Biblioteca Digital </div>
        {/* <div className='pt-4'> */}
            {/* <Link to="/" className='cursor-pointer underline hover:text-gray-700 font-semibold'> INICIO</Link> */}
        {/* </div> */}
    </div>
  )
}

export default NavBar