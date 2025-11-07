import React, { useEffect, useState } from 'react'
import BookCard from './BookCard'
import { useDrivePDFs } from '../hooks/useGoogleDrivePDFs'

const BooksList = ({ searchQuery }) => {    
  const { files, loading, error } = useDrivePDFs()
  const [ filteredFiles, setFilteredFiles ] = useState([])
  
  //Normalizamos texto par omitir tildes:
  const normalizeText = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  }
  
  const cleanQuery = normalizeText(searchQuery)

  useEffect(() => {
    if (!loading) {
      if (!cleanQuery.trim()) {
        setFilteredFiles(files)
      } else {
        const results = files.filter(file =>
          normalizeText(file.name).includes(cleanQuery)
        )
        setFilteredFiles(results)
      }
    }
  }, [cleanQuery, files, loading])
  
  if (loading) 
    return <p className="text-center text-2xl py-20">Cargando libros...</p>;
  if (error)
    return <p className="text-center">{error}</p>;

  // 🔍 Resaltar coincidencias
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;

    const cleanText = normalizeText(text).toLowerCase();
    const cleanQuery = normalizeText(query).toLowerCase();

    const startIndex = cleanText.indexOf(cleanQuery);
    if (startIndex === -1) return text;

    const endIndex = startIndex + cleanQuery.length;

    return (
      text.substring(0, startIndex) +
      `<span class="bg-indigo-300 py-[1px] rounded-xl font-semibold">` +
      text.substring(startIndex, endIndex) +
      '</span>' +
      text.substring(endIndex)
    );
  };

  
  const filesToShow = searchQuery.trim() === '' ? files : filteredFiles

  return (
    <div className="flex flex-col text-center pt-50 pb-60 md:pt-60 md:pb-20 ">
      <div className="flex flex-wrap gap-8 justify-center">
        { filesToShow.map((file, index)  => (
          <BookCard
              key={file.id}
              book={{
                ...file,
                highlightedName: highlightMatch(file.name, searchQuery)
              }}
          />))
        }
      </div>
    </div>
  )
}

export default BooksList