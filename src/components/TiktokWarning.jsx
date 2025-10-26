import React, { useEffect, useState } from "react";

export default function TikTokWarning() {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    const isInApp = 
      userAgent.includes('tiktok') || 
      userAgent.includes('musical_ly') ||      // ✅ TikTok usa esto
      userAgent.includes('bytelocale') ||      // ✅ También esto
      userAgent.includes('bytedance') ||
      userAgent.includes('fban') || 
      userAgent.includes('fbav') || 
      userAgent.includes('instagram') ||
      userAgent.includes('line/');
    
    if (isInApp) {
      setShowModal(true);
    }
  }, []);

  const handleCopy = async () => {
    const currentUrl = window.location.href;
    
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        alert("No se pudo copiar. URL: " + currentUrl);
      }
      
      document.body.removeChild(textArea);
    }
  };

  const openInBrowser = () => {
    const currentUrl = window.location.href;
    
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
      window.location.href = currentUrl;
    } else {
      // Para Android (como el tuyo)
      window.location.href = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;end`;
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md z-[9999] px-4 overflow-y-auto">
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-2xl w-full max-w-md text-center my-8">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-white mb-4">
          Abre esta página en tu navegador
        </h2>
        
        <p className="text-white/90 mb-6 leading-relaxed">
          TikTok, Instagram y Facebook limitan funciones como las descargas y el visor de PDF.  
          <br />
          <strong className="text-white">Abre esta página en Safari o Chrome</strong> para acceder a todas las funciones.
        </p>

        <div className="space-y-3">
          <button
            onClick={openInBrowser}
            className="w-full flex items-center justify-center gap-2 bg-red-300 hover:bg-red-400 active:bg-gray-600 text-white px-6 py-3 rounded-lg transition font-medium"
          >
            🌐 Abrir en navegador
          </button>

          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition font-medium ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border border-white/30'
            }`}
          >
            {copied ? '✅ ¡Enlace copiado!' : '📋 Copiar enlace'}
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-300 space-y-2">
          <p className="font-medium text-white">Instrucciones:</p>
          <ol className="text-left space-y-1 pl-4 list-decimal">
            <li>Toca los <strong>tres puntos</strong> (⋯) arriba a la derecha</li>
            <li>Selecciona <strong>"Abrir en navegador"</strong></li>
            <li>O copia el enlace y pégalo en Chrome</li>
          </ol>
        </div>
      </div>
    </div>
  );
}