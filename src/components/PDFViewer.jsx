import React from 'react'

const PDFViewer = ({isOpen, onClose, book}) => {
    if (!isOpen) return false

    const bookViewUrl = `https://drive.google.com/file/d/${book.id}/preview`;
    const bookDownloadUrl = `https://drive.google.com/uc?export=download&id=${book.id}`;

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="rounded-2xl w-[100%] md:w-[80%] h-[100%] p-0 relative shadow-2xl">
                <button
                onClick={() => onClose(false)}
                className="cursor-pointer absolute top-0 right-0 bg-gray-300 hover:bg-gray-400 text-black rounded-full px-3 py-1 text-sm font-bold"
                >
                    X
                </button>
                <iframe
                    src={bookViewUrl}
                    className="w-full h-full rounded-xl"
                    // allow="autoplay"
                >
                </iframe>
                {/* <a
                    href={bookDownloadUrl}
                    className="absolute bottom-4 right-4 bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg shadow-md"
                >
                    Descargar PDF
                </a> */}
            </div>
        </div>
    )
}

export default PDFViewer