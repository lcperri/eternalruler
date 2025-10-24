import React, { useState } from 'react'
import sabiduriaVol2Tum from '../assets/sabiduria-vol2.png'
import PDFViewer from './PDFViewer';

// const BookCard = ({ book , loading, error } ) => {
//   const [open, setOpen] = useState(false);
//   console.log(book)

//   const bookIDWithoutTumb = '1hjelxF7GGybwtELthzi67i3ZRLQVkFsJ'

//   const thumbnail = 
//     book.id === bookIDWithoutTumb 
//     ? sabiduriaVol2Tum
//     : book.thumbnailLink?.replace('=s220', '=s600')

//   const previewUrl = `https://drive.google.com/file/d/${book.id}/preview`;
//   const downloadUrl = `https://drive.google.com/uc?export=download&id=${book.id}`;

//   return (
//           <div
//             key={book.id}
//             className="w-76 sm:w-83 py-8 px-6 bg-gray-200 rounded-4xl shadow-lg hover:shadow-xl transition"
//           >
//             <img
//               // src=
//               src={thumbnail}
//               alt={book.name}
//               className="mx-auto rounded-2xl mb-3 h-90 w-65 object-cover shadow"
//             />
//             <h3 className="font-semibold text-gray-800 mb-2 text-sm line-clamp-2">
//               {book.name}
//             </h3>
//             <div className="flex gap-2 justify-center">
//               <a
//                 // href={book.webViewLink} esto muestra texto plano en algunos moviles.
//                 href={`https://drive.google.com/file/d/${book.id}/preview`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-15 text-sm py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-400"
//               >
//                 Leer
//               </a>
//               <a
//                 href={`https://drive.google.com/uc?export=download&id=${book.id}`}
//                 className="w-22 text-sm py-2 bg-red-400 text-white rounded-lg hover:bg-red-300"
//               >
//                 Descargar
//               </a>
//             </div>

//           {open && (
//         <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
//           <div className="bg-white rounded-2xl w-[90%] md:w-[70%] h-[80%] p-4 relative shadow-2xl">
//             <button
//               onClick={() => setOpen(false)}
//               className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 text-black rounded-full px-3 py-1 text-sm"
//             >
//               ✕
//             </button>

//             <iframe
//               src={previewUrl}
//               className="w-full h-full rounded-xl"
//               allow="autoplay"
//             ></iframe>

//             <a
//               href={downloadUrl}
//               className="absolute bottom-4 right-4 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg shadow-md"
//             >
//               Descargar PDF
//             </a>
//           </div>
//         </div>
//       )}
//           </div>
//   )
// }

// export default BookCard

export default function BookCard({ book }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const bookViewUrl = `https://drive.google.com/file/d/${book.id}/preview`;
    const bookDownloadUrl = `https://drive.google.com/uc?export=download&id=${book.id}`;

    const bookIDWithoutTumb = '1hjelxF7GGybwtELthzi67i3ZRLQVkFsJ'

    const thumbnail = 
        book.id === bookIDWithoutTumb 
        ? sabiduriaVol2Tum
        : book.thumbnailLink?.replace('=s220', '=s600')

return (
    <div className="w-76 sm:w-83 py-8 px-6 bg-gray-200 rounded-4xl shadow-lg hover:shadow-xl transition">
        <img
            src={thumbnail}
            alt={book.name}
            className="mx-auto rounded-2xl mb-3 h-90 w-65 object-cover"
        />
        <h3 className="font-semibold text-gray-800 mb-2 text-sm line-clamp-2 text-center">
            {book.name}
        </h3>
        <button
            onClick={() => setIsModalOpen(true)}
            // onClick={() => window.open(`/api/read?id=${book.id}`, "_blank")}
            className="cursor-pointer w-22 text-sm py-2 bg-red-400 text-white rounded-lg hover:bg-gray-500"
        >
            Ver
        </button>

        <a
            href={`${window.location.origin}/api/download/${book.id}?filename=${encodeURIComponent(book.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer w-28 text-sm py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-600"
        >
            Descargar
        </a>

        {/* Modalde visor PDF */}
        <PDFViewer 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            book={book} 
        />
    </div>
    )
}