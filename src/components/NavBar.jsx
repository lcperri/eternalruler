import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const NavBar = ({ onSearchChange, searchQuery }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  //UseEffect para que se oculte l anavBar al hacer csroll down y sea visible al hacer scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // ⬇️ scroll hacia abajo → ocultar navbar
        setIsVisible(false);
      } else {
        // ⬆️ scroll hacia arriba → mostrar navbar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed w-full z-50 top-0 left-0 md:flex md:justify-center md:items-center py-2 md:py-0 bg-black/50 backdrop-blur-md 
        transition-transform duration-500 ease-in-out shadow-2xl ${isVisible ? "translate-y-0" : "-translate-y-full" }`}
    >
      <div className="relative flex flex-col px-8 md:px-20 pb-1 md:py-6 md:pb-6 gap-1 md:gap-2">
        <h2 className="text-3xl md:text-6xl font-bold hover:text-gray-300">
          <Link to="/">ETERNAL RULER</Link>
        </h2>
        <div className="text-xl md:text-4xl pb-2 text-red-300">
          ⛥⚡📖♾ Biblioteca Digital
        </div>
      </div>
      <div className="flex flex-col items-center">
        <SearchBar onSearchChange = { onSearchChange } searchQuery = { searchQuery }/>
      </div>
    </div>
  );
};

export default NavBar;