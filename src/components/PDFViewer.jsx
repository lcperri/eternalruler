import React from 'react'

const PDFViewer = ({isOpen, onClose, book}) => {
    if (!isOpen) return false

    return (    
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="w-[100%] md:w-[80%] h-[100%] p-0 relative">
                <button
                onClick={() => onClose(false)}
                className="w-10 h-10 cursor-pointer fixed z-[9999] top-3 left-1 bg-gray-400/70 hover:bg-gray-400 active:bg-gray-400 
                text-white rounded-full px-2 py-1 text-xl shadow-2xl"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
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