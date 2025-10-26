import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TikTokWarning from '../components/TiktokWarning'

const LandingPage = () => {
  const [isTikTok, setIsTikTok] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/tiktok/i.test(userAgent)) {
      setIsTikTok(true);
    }
  }, []);

  if (isTikTok) {
    // Si está en TikTok, solo muestra el aviso
    return <TikTokWarning />;
  }

  return (
    <div>
        {/* Overlay oscuro */}
        {/* <div className="absolute inset-0  rounded-4xl" /> */}

        {/* Contenido principal */}
        <div className="relative z-10 mx-10 px-6 py-8 md:px-12 lg:px-24 bg-black/50 rounded-3xl shadow-xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              ETERNAL RULER
            </h1>
            <p className="text-lg md:text-2xl font-light max-w-2xl mx-auto drop-shadow-md">
              Somos conciencia. Nuestras almas son amor puro. Controla tus pensamientos y tus emociones.
            </p>
            <Link to="/home">
              <button className="cursor-pointer mt-8 bg-red-300 text-black font-semibold px-6 py-3 rounded-2xl shadow-lg hover:bg-gray-200 transition-all">
                Descarga los libros
              </button>
            </Link>
        </div>
    </div>
  )
}

export default LandingPage