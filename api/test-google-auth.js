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


    try {
        const { google } = await import('googleapis')

        // Limpiar la clave (remover comillas extras si existen)
        let cleankey = privateKey

         // Si empieza y termina con comillas, quitarlas
        if (cleankey.startsWith('"') && cleankey.endsWith('"')) {
            cleankey = cleankey.slice(1, -1)
        }

        // Reemplazar \n por saltos de línea reales
        cleankey = cleankey.replace(/\\n/g, '\n')

        // lUEGO Intentar crear el cliente de autenticación
        const auth = new google.auth.JWT({
            email: email,
            key: cleankey,
            scopes: ['https://www.googleapis.com/auth/drive.readonly']
        })

        // Intentar autenticar con Google
        await auth.authorize()

        return res.status(200).json({
            success: true,
            message: 'Autenticación exitosa',
            data: {
                email: email,
                authenticated: true,
                keyFormat: "Formato correcto"
            }
        })
    } catch (err) {
    // 6️⃣ Si falló, mostrar el error
        return res.status(500).json({
            error: "❌ Error al autenticar con Google",
            message: err.message,
            details: {
                email: email,
                keyStartsCorrectly: privateKey.includes('BEGIN PRIVATE KEY'),
                errorType: err.code || 'unknown'
            }
        });
    }
}