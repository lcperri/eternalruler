export default async function handler(req, res) {
  // 1️⃣ Verificar que las variables de entorno existan
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!email) {
        return res.status(500).json({ 
        error: "❌ Falta GOOGLE_SERVICE_ACCOUNT_EMAIL",
        found: false
        });
    }

    if (!privateKey) {
        return res.status(500).json({ 
        error: "❌ Falta GOOGLE_PRIVATE_KEY",
        found: false
        });
    }

    // 2️⃣ Mostrar información básica (sin exponer la clave completa)
    return res.status(200).json({
        success: true,
        message: "✅ Variables de entorno encontradas",
        data: {
        email: email,
        privateKeyStart: privateKey.substring(0, 30) + "...",
        privateKeyLength: privateKey.length,
        hasNewlines: privateKey.includes('\n') || privateKey.includes('\\n'),
        }
    });
}