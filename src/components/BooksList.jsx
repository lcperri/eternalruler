import React, { useEffect, useState } from 'react'
import BookCard from './BookCard'
import { useDrivePDFs } from '../hooks/useGoogleDrivePDFs'

const BooksList = () => {    
  const { files, loading, error } = useDrivePDFs()

  if (loading) 
    return <p className="text-center text-2xl">Cargando libros...</p>;
  if (error)
    return <p className="text-center">{error}</p>;

  return (
    <div className="flex flex-col text-center py-15 md:py-30 ">
      <div className="flex flex-wrap gap-8 justify-center">
        { files.map((file, index) => (
          <BookCard key={ file.id || index } book= { file } loading={ loading } error={ error } />
        ))}
      </div>
    </div>
  )
}

export default BooksList