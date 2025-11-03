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
                className="w-10 h-10 cursor-pointer absolute z-10 top-15 left-5 bg-gray-300/70 hover:bg-gray-400 
                text-white rounded-2xl px-0 py-1 text-xl font-extralight"
                >
                    🡰
                </button>
                <iframe
                    src={`${window.location.origin}/api/read?id=${book.id}`} 
                    className="z-0 w-[100%] h-full rounded-xl items-center"
                    // allow="autoplay"
                >
                </iframe>
            </div>
        </div>
    )
}

export default PDFViewer