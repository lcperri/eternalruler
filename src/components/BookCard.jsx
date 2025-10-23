import React from 'react'
import sabiduriaVol2Tum from '../assets/sabiduria-vol2.png'

const BookCard = ({ book , loading, error } ) => {
  console.log(book)

  const bookIDWithoutTumb = '1hjelxF7GGybwtELthzi67i3ZRLQVkFsJ'

  const thumbnail = 
    book.id === bookIDWithoutTumb 
    ? sabiduriaVol2Tum
    : book.thumbnailLink?.replace('=s220', '=s600')

  return (
          <div
            key={book.id}
            className="w-76 sm:w-83 py-8 px-6 bg-gray-200 rounded-4xl shadow-lg hover:shadow-xl transition"
          >
            <img
              // src=
              src={thumbnail}
              alt={book.name}
              className="mx-auto rounded-2xl mb-3 h-90 w-65 object-cover shadow"
            />
            <h3 className="font-semibold text-gray-800 mb-2 text-sm line-clamp-2">
              {book.name}
            </h3>
            <div className="flex gap-2 justify-center">
              <a
                href={book.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-15 text-sm py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-400"
              >
                Leer
              </a>
              <a
                href={`https://drive.google.com/uc?export=download&id=${book.id}`}
                className="w-22 text-sm py-2 bg-red-400 text-white rounded-lg hover:bg-red-300"
              >
                Descargar
              </a>
            </div>
          </div>
  )
}

export default BookCard