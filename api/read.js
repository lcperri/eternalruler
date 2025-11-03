import googleDriveAuth from '../src/services/googleDriveAuth.js'

// ✅ Cache del cliente de autenticación (evita recrearlo en cada request)
// let authClient = null

export default async function handler(req, res) {
    // const drive = await googleDriveAuth()
    // console.log(drive)

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
        res.setHeader("Content-Type", fileMetadata.data.mimeType || "application/pdf")
        res.setHeader("Cache-Control", "public, max-age=86400") //mantiene en cache por 24 horas
        res.setHeader("Accept-Ranges", "bytes"); //descarga parcial para optimizar tiempo de carga inicial
        res.setHeader("X-Content-Type-Options", "nosniff")

        //Si el metadata trae file size tambien lo envía
        if (fileMetadata.data.size) {
            res.setHeader("Content-Length", fileMetadata.data.size)
        }

        //Descargamos archivo como stream nativo de Node ya que OAuth lo permite a diferencia de fetch con api pública
        const response =  await drive.files.get(
            { fileId: id, alt: 'media' },
            { responseType: 'stream' }
        )

        //Transmitimos el archivo como stream efeciente nativo de nodejs
        response.data
        .on('end', () => {
            console.log(`✅ PDF ${id} servido correctamente`)
            res.end()
        })
        .on('error', (err) => {
            console.error('❌ Error streaming:', err)
            if(!res.headersSent) {
                res.status(500).json({error: "Error al transmitir el archivo"})
            }
        })
        .pipe(res)

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


    //VERSION SIN OAUTH2.0
  // Usar API de Google Drive para mejor rendimiento
//     const API_KEY = process.env.GOOGLE_API_KEY;
//     const driveUrl = API_KEY 
//         ? `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${API_KEY}`
//         : `https://drive.google.com/uc?export=download&id=${id}`;

//     try {
//         const response = await fetch(driveUrl, {
//             headers: {
//                 "User-Agent": "Mozilla/5.0",
//             },
//         });

//         if (!response.ok) {
//             console.error(`Error ${response.status}: No se pudo obtener el archivo`);
//             return res.status(response.status).json({ 
//                 error: "Error al obtener PDF desde google Drive" 
//             });
//         }

//         // Headers para visualización en iframe
//         res.setHeader("Content-Type", "application/pdf");
//         res.setHeader("Cache-Control", "public, max-age=86400"); // Cache de 24 horas
//         res.setHeader("Accept-Ranges", "bytes"); // Permitir carga parcial

//         // Streaming eficiente para archivos grandes
//         if (response.body) {
//             const reader = response.body.getReader();
//             while (true) {
//                 const { done, value } = await reader.read();
//                 if (done) break;
//                 res.write(value);
//             }  
//             res.end();
//         } else {
//             // Fallback para navegadores sin soporte de streams
//             const buffer = Buffer.from(await response.arrayBuffer());
//             res.send(buffer);
//         }
        
//         } catch (err) {
//             console.error("Error al obtener PDF:", err);
//             res.status(500).json({ error: "Error interno del servidor" });
//         }
// }
