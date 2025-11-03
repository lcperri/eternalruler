import googleDriveAuth from '../src/services/googleDriveAuth.js'

// ✅ Cache del cliente de autenticación (evita recrearlo en cada request)
// let authClient = null

export default async function handler(req, res) {
    const { id } = req.query
    
    if (!id) {
        return res.status(400).json({ error: "Falta el ID del archivo" });
    }

    try {
        const drive = await googleDriveAuth()

        //Obtenemos metadata del archivo:
        const fileMetadata = await drive.files.get({
            fileId: id,
            fields: 'name, mimeType, size, trashed'
        })

        //Verificamos que el archivo no está en la papelera:
        if (fileMetadata.data.trashed) {
            return res.status(410).json({error: 'El arvhivo está en la papelera'})
        }

        //Optimizamos headers para iframe:
        // res.setHeader("Content-Type", fileMetadata.data.mimeType || "application/pdf")
        // res.setHeader("Cache-Control", "public, max-age=86400") //mantiene en cache por 24 horas
        // res.setHeader("Accept-Ranges", "bytes"); //descarga parcial para optimizar tiempo de carga inicial
        // res.setHeader("X-Content-Type-Options", "nosniff")

          // ⭐ Obtenemos token temporal
        const auth = drive.context._options.auth;
        const authClient = await auth.getClient();
        const tokenResponse = await authClient.getAccessToken();

          // ⭐ Redirigir a Google viewer nativo optimizado para móvil
        const driveViewerUrl = `https://drive.google.com/file/d/${id}/preview`;

        res.redirect(302, driveViewerUrl);
        console.log(`✅ PDF ${id} redirigido a viewer de Google drive correctamente`)

        // //Si el metadata trae file size tambien lo envía
        // if (fileMetadata.data.size) {
        //     res.setHeader("Content-Length", fileMetadata.data.size)
        // }

        // //Descargamos archivo como stream nativo de Node ya que OAuth lo permite a diferencia de fetch con api pública
        // const response =  await drive.files.get(
        //     { fileId: id, alt: 'media' },
        //     { responseType: 'stream' }
        // )

        // //Transmitimos el archivo como stream efeciente nativo de nodejs
        // response.data
        // .on('end', () => {
        //     console.log(`✅ PDF ${id} servido correctamente`)
        //     res.end()
        // })
        // .on('error', (err) => {
        //     console.error('❌ Error streaming:', err)
        //     if(!res.headersSent) {
        //         res.status(500).json({error: "Error al transmitir el archivo"})
        //     }
        // })
        // .pipe(res)

    } catch (err) {
        console.error("❌ Error al obtener PDF:", err.message)

            // Manejo específico de errores
        if (err.code === 404) {
            return res.status(404).json({ error: "Archivo no encontrado o sin permisos" })
        }
        
        if (err.code === 403) {
        return res.status(403).json({ 
            error: "Acceso denegado. Verifica que el Service Account tenga permisos sobre este archivo.",
            hint: `Comparte el archivo con: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`
        });
        }

        res.status(500).json({ 
            error: "Error interno del servidor",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}