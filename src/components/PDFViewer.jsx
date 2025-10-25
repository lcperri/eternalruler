import React from 'react'

const PDFViewer = ({isOpen, onClose, book}) => {
    if (!isOpen) return false

    const bookViewUrl = `https://drive.google.com/file/d/${book.id}/preview`;
    // const bookViewUrl = `${window.location.origin}/api/read?id=${book.id}`

    return (    
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="w-[100%] md:w-[80%] h-[100%] p-0 relative">
                <button
                onClick={() => onClose(false)}
                className="cursor-pointer fixed z-10 right-39 md:right-180 bg-gray-300 hover:bg-gray-400 text-black rounded-full px-3 py-1 text-sm font-bold"
                >
                    X
                </button>
                <iframe
                    src={bookViewUrl}
                    className="absolute z-0 right-[-25px] w-[115%] h-full rounded-xl items-center"
                    // allow="autoplay"
                >
                </iframe>
            </div>
        </div>
    )
}

export default PDFViewer