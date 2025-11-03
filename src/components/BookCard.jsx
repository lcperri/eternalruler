// import React, { useState } from 'react'
// import sabiduriaVol2Tum from '../assets/sabiduria-vol2.png'
// import PDFViewer from './PDFViewer';

// export default function BookCard({ book }) {
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const bookIDWithoutTumb = '1hjelxF7GGybwtELthzi67i3ZRLQVkFsJ'
//     const thumbnail = 
//         book.id === bookIDWithoutTumb 
//         ? sabiduriaVol2Tum
//         : book.thumbnailLink?.replace('=s220', '=s600')

// return (
//     <div className="w-76 sm:w-83 py-8 px-6 bg-gray-200 rounded-4xl shadow-lg hover:shadow-xl transition">
//         <img
//             src={thumbnail}
//             alt={book.name}
//             className="mx-auto rounded-2xl mb-3 h-90 w-65 object-cover"
//         />
//         <h3 className="font-semibold text-gray-800 mb-2 text-sm line-clamp-2 text-center">
//             {book.name}
//         </h3>
//         <h4>
//             Peso: {book.size}
//         </h4>
//         <button
//             onClick={() => setIsModalOpen(true)}
//             // onClick={() => window.open(`/api/read?id=${book.id}`, "_blank")}
//             className="mr-2 cursor-pointer w-22 text-sm py-2 bg-red-400 text-white rounded-lg hover:bg-red-300"
//         >
//             Leer
//         </button>

//         <button
//             onClick={() => {
//                 const url = `${window.location.origin}/api/download?id=${book.id}&filename=${encodeURIComponent(book.name)}`
//                 window.open(url, '_blank')
//             }}
//             rel="noopener noreferrer"
//             className="ml-2 cursor-pointer w-24 text-sm py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-600"
//         >
//             Descargar
//         </button>

//         {/* Modalde visor PDF */}
//         <PDFViewer 
//             isOpen={isModalOpen}
//             onClose={() => setIsModalOpen(false)}
//             book={book} 
//         />
//     </div>
//     )
// }




import React, { useState } from 'react'
import sabiduriaVol2Tum from '../assets/sabiduria-vol2.png'
import PDFViewer from './PDFViewer';

export default function BookCard({ book }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const bookIDWithoutTumb = '1hjelxF7GGybwtELthzi67i3ZRLQVkFsJ'
    const thumbnail = 
        book.id === bookIDWithoutTumb 
        ? sabiduriaVol2Tum
        : book.thumbnailLink?.replace('=s220', '=s600')

const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
        const url = `/api/download?id=${book.id}&filename=${encodeURIComponent(book.name)}`;
        
        // ⭐ Hacer fetch primero para validar que la descarga está lista
        // const response = await fetch(url, { method: 'HEAD' });
        
        // if (!response.ok) {
        //     throw new Error('Error al generar descarga');
        // }

        // Redirección simple (la que tienes ahora en el API)
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank'
        // link.download = book.name;
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Esperar 3 segundos antes de habilitar el botón
        setTimeout(() => setIsDownloading(false), 3000);
        
    } catch (error) {
        console.error('Error al descargar:', error);
        alert('Error al iniciar la descarga');
        setIsDownloading(false);
    }
};

    return (
        <div className="w-76 sm:w-83 py-8 px-6 bg-gray-200/95 rounded-4xl shadow-lg hover:shadow-xl transition">
            <img
                src={thumbnail}
                alt={book.name}
                className="mx-auto rounded-2xl mb-3 h-90 w-65 object-cover"
            />
            <h3 className="font-semibold text-gray-800 mb-2 text-sm line-clamp-2 text-center">
                {book.name}
            </h3>
            <h4 className="text-xs text-gray-600 text-center mb-3">
                Peso: {(book.size / (1024 * 1024)).toFixed(2)}MB
            </h4>
            
            <div className="flex justify-center gap-2">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="cursor-pointer w-22 text-sm py-2 bg-red-400 text-white rounded-lg hover:bg-red-300 transition"
                >
                    Leer
                </button>

                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`cursor-pointer w-24 text-sm py-2 text-white rounded-lg transition ${
                        isDownloading 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-gray-400 hover:bg-gray-600'
                    }`}
                >
                    {isDownloading ? 'Descargando...' : 'Descargar'}
                </button>
            </div>

            {/* Modal de visor PDF */}
            <PDFViewer 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                book={book} 
            />
        </div>
    )
}