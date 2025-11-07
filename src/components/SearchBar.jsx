import React, { useState } from 'react'

const SearchBar = ({ onSearchChange, searchQuery }) => {

return (
        <div className="flex bg-gray-900/70 backdrop-blur-md px-4 py-2 md:py-3 rounded-full border border-gray-700 shadow-lg max-w-md">
            <input
                type="text"
                placeholder="Buscar libro..."
                className=" bg-transparent text-white placeholder-gray-400 outline-none px-2 text-sm"
                onChange={(e) => onSearchChange(e.target.value)}
                value={searchQuery}
            />
            <button className="cursor-pointer active:text-indigo-300 text-indigo-400 hover:text-indigo-300 font-medium ml-2 text-sm">
                Buscar
            </button>
        </div>
)
}

export default SearchBar