import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import wallpaper from './assets/sabiduria.jpg'

const App = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex flex-col items-center justify-center text-white text-center"
      style={{ 
        backgroundImage: `url(${wallpaper})`,
        backgroundAttachment: 'fixed' //  efecto parallax
      }}
    >
      {/* Overlay oscuro */}
        {/* <div className="absolute inset-0 bg-black/20" /> */}

      <div className='relative z-10'>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </div>
    </div>
    );
}


export default App