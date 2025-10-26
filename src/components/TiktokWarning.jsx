import React, { useEffect, useState } from "react";

export default function TikTokWarning() {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    const userAgent = navigator.userAgent;
    
    // Guardar info de debug
    setDebugInfo(userAgent);
    
    const isInApp = 
      /tiktok/i.test(userAgent) || 
      /bytedance/i.test(userAgent) ||
      /musically/i.test(userAgent) ||
      /fban|fbav|instagram/i.test(userAgent) ||
      /line\//i.test(userAgent);
    
    // Forzar a mostrar siempre para testing
    setShowModal(true); // 🔥 TEMPORAL: Muestra siempre el modal
    
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
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-lg transition font-medium"
          >
            🌐 Abrir en navegador
          </button>

          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition font-medium ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
            }`}
          >
            {copied ? '✅ ¡Enlace copiado!' : '📋 Copiar enlace'}
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-300 space-y-2">
          <p className="font-medium text-white">Instrucciones:</p>
          <ol className="text-left space-y-1 pl-4">
            <li>1. Toca los <strong>tres puntos</strong> (⋯) arriba</li>
            <li>2. Selecciona <strong>"Abrir en navegador"</strong></li>
            <li>3. O copia el enlace y pégalo en Safari/Chrome</li>
          </ol>
        </div>

        {/* 🔍 DEBUG INFO - Eliminar después */}
        <div className="mt-6 p-4 bg-black/50 rounded-lg text-left">
          <p className="text-xs text-gray-400 font-mono break-all">
            <strong className="text-white">User Agent:</strong><br/>
            {debugInfo}
          </p>
        </div>
      </div>
    </div>
  );
}