import React, { useState } from 'react'
import sabiduriaVol2Tum from '../assets/sabiduria-vol2.png'
import PDFViewer from './PDFViewer';

export default function BookCard({ book }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [downloadState, setDownloadState] = useState('idle'); // idle, preparing, downloading, completed
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadedFileUrl, setDownloadedFileUrl] = useState(null);

    const bookIDWithoutTumb = '1hjelxF7GGybwtELthzi67i3ZRLQVkFsJ'
    const thumbnail = 
        book.id === bookIDWithoutTumb 
        ? sabiduriaVol2Tum
        : book.thumbnailLink?.replace('=s220', '=s600')

    const handleDownload = async () => {
        setDownloadState('preparing');
        setDownloadProgress(0);
        
        try {
            const url = `/api/download?id=${book.id}&filename=${encodeURIComponent(book.name)}`;
            
            // Iniciar fetch con streaming
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Error al descargar el archivo');
            }

            // Obtener el tamaño total del archivo
            const contentLength = response.headers.get('content-length');
            const total = parseInt(contentLength, 10);

            // Leer el stream por chunks
            const reader = response.body.getReader();
            const chunks = [];
            let receivedLength = 0;

            setDownloadState('downloading');

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                chunks.push(value);
                receivedLength += value.length;
                
                // Calcular y actualizar progreso
                const progress = total ? Math.round((receivedLength / total) * 100) : 0;
                setDownloadProgress(progress);
            }

            // Crear el blob con todos los chunks
            const blob = new Blob(chunks, { type: 'application/pdf' });
            const blobUrl = window.URL.createObjectURL(blob);
            
            // Guardar la URL para el botón "Abrir"
            setDownloadedFileUrl(blobUrl);
            
            // Cambiar estado a completado
            setDownloadState('completed');

            // Descargar automáticamente el archivo
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = book.name;
            document.body.appendChild(link);
            link.click();
            
            // Pequeño delay para UX fluido antes de marcar completado
            setTimeout(() => {
                setDownloadState('completed');
                setDownloadProgress(100); // asegurar que marque 100%
            }, 800);

        } catch (error) {
            console.error('Error al descargar:', error);
            alert('Error al iniciar la descarga');
            setDownloadState('idle');
            setDownloadProgress(0);
        }
    };

    const handleOpenFile = () => {
        if (downloadedFileUrl) {
            // Abrir el archivo en nueva pestaña
            window.open(downloadedFileUrl, '_blank');
        }
    };

    const getButtonContent = () => {
        switch (downloadState) {
            case 'preparing':
                return (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Preparando...
                    </span>
                );
            case 'downloading':
                return `${downloadProgress}%`;
            case 'completed':
                return 'Abrir';
            default:
                return 'Descargar';
        }
    };

    const getButtonStyle = () => {
        switch (downloadState) {
            case 'preparing':
                return 'bg-blue-400 cursor-wait';
            case 'downloading':
                return 'bg-green-500 cursor-wait';
            case 'completed':
                return 'bg-purple-500 hover:bg-purple-600 cursor-pointer';
            default:
                return 'bg-gray-400 hover:bg-gray-600 cursor-pointer';
        }
    };

    const handleButtonClick = () => {
        if (downloadState === 'completed') {
            handleOpenFile();
        } else if (downloadState === 'idle') {
            handleDownload();
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
                    className="cursor-pointer w-22 text-sm py-2 bg-red-300 text-white rounded-lg hover:bg-red-400 transition"
                >
                    Leer
                </button>

                <button
                    onClick={handleButtonClick}
                    disabled={downloadState === 'preparing' || downloadState === 'downloading'}
                    className={`w-24 text-sm py-2 text-white rounded-lg transition ${getButtonStyle()}`}
                >
                    {getButtonContent()}
                </button>
            </div>

           {/* Barra de progreso y estado visual */}
            {(downloadState === 'downloading' || downloadState === 'completed') && (
            <div className="mt-3 w-full text-center">
                <div className="bg-gray-300 rounded-full h-2 overflow-hidden">
                <div 
                    className={`h-full transition-all duration-300 ease-out ${
                    downloadState === 'completed' ? 'bg-purple-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${downloadProgress}%` }}
                ></div>
                </div>

                {downloadState === 'downloading' && (
                <p className="text-xs text-gray-600 mt-1">{downloadProgress}%</p>
                )}

                {downloadState === 'completed' && (
                <p className="text-xs text-purple-600 font-semibold mt-1">Completado ✅</p>
                )}
            </div>
            )}

            {/* Modal de visor PDF */}
            <PDFViewer 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                book={book} 
            />
        </div>
    )
}


// import React, { useState } from 'react'
// import sabiduriaVol2Tum from '../assets/sabiduria-vol2.png'
// import PDFViewer from './PDFViewer';

// export default function BookCard({ book }) {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isDownloading, setIsDownloading] = useState(false);

//     const bookIDWithoutTumb = '1hjelxF7GGybwtELthzi67i3ZRLQVkFsJ'
//     const thumbnail = 
//         book.id === bookIDWithoutTumb 
//         ? sabiduriaVol2Tum
//         : book.thumbnailLink?.replace('=s220', '=s600')

// const handleDownload = async () => {
//     setIsDownloading(true);
    
//     try {
//         const url = `/api/download?id=${book.id}&filename=${encodeURIComponent(book.name)}`;
        
//         // ⭐ Hacer fetch primero para validar que la descarga está lista
//         // const response = await fetch(url, { method: 'HEAD' });
        
//         // if (!response.ok) {
//         //     throw new Error('Error al generar descarga');
//         // }

//         // Redirección simple (la que tienes ahora en el API)
//         const link = document.createElement('a');
//         link.href = url;
//         link.target = '_blank'
//         // link.download = book.name;
//         link.rel = 'noopener noreferrer';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
        
//         // Esperar 3 segundos antes de habilitar el botón
//         setTimeout(() => setIsDownloading(false), 3000);
        
//     } catch (error) {
//         console.error('Error al descargar:', error);
//         alert('Error al iniciar la descarga');
//         setIsDownloading(false);
//     }
// };

//     return (
//         <div className="w-76 sm:w-83 py-8 px-6 bg-gray-200/95 rounded-4xl shadow-lg hover:shadow-xl transition">
//             <img
//                 src={thumbnail}
//                 alt={book.name}
//                 className="mx-auto rounded-2xl mb-3 h-90 w-65 object-cover"
//             />
//             <h3 className="font-semibold text-gray-800 mb-2 text-sm line-clamp-2 text-center">
//                 {book.name}
//             </h3>
//             <h4 className="text-xs text-gray-600 text-center mb-3">
//                 Peso: {(book.size / (1024 * 1024)).toFixed(2)}MB
//             </h4>
            
//             <div className="flex justify-center gap-2">
//                 <button
//                     onClick={() => setIsModalOpen(true)}
//                     className="cursor-pointer w-22 text-sm py-2 bg-red-400 text-white rounded-lg hover:bg-red-300 transition"
//                 >
//                     Leer
//                 </button>

//                 <button
//                     onClick={handleDownload}
//                     disabled={isDownloading}
//                     className={`cursor-pointer w-24 text-sm py-2 text-white rounded-lg transition ${
//                         isDownloading 
//                             ? 'bg-gray-300 cursor-not-allowed' 
//                             : 'bg-gray-400 hover:bg-gray-600'
//                     }`}
//                 >
//                     {isDownloading ? 'Descargando...' : 'Descargar'}
//                 </button>
//             </div>

//             {/* Modal de visor PDF */}
//             <PDFViewer 
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 book={book} 
//             />
//         </div>
//     )
// }