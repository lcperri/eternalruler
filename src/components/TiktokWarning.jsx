import React, { useEffect, useState } from "react";

export default function TikTokWarning() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const isInTikTok = /tiktok/i.test(navigator.userAgent);
    if (isInTikTok) {
      setShowModal(true);
    }
  }, []);

  const handleCopy = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    alert("📋 Enlace copiado. Pégalo en Safari o Chrome para abrir correctamente.");
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-[9999]">
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-2xl w-[90%] max-w-md text-center animate-fade-in">
        <h2 className="text-xl font-semibold text-white mb-4">
          ⚠️ Abre esta página en tu navegador
        </h2>
        <p className="text-white/90 mb-6">
          TikTok limita funciones como las descargas y el visor de PDF.  
          Para continuar, abre esta página en <strong>Safari o Chrome</strong>.
        </p>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg mx-auto transition"
        >
          Copiar enlace
        </button>

        <p className="text-sm text-gray-300 mt-4">
          Luego pégalo en tu navegador preferido.
        </p>
      </div>
    </div>
  );
}
