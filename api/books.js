import googleDriveAuth from "../src/services/googleDriveAuth.js";

export default async function handler (req, res) {
     // ========== CORS HEADERS ==========
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    // Preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    // Solo permitir GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

     // ========== PROCESO PRINCIPAL ==========
    try {
        console.log('📖 [API /books] Request recibida')
        const startTime = Date.now()

        const drive = googleDriveAuth()
        
        const data = await drive.files.list({
            fields: `files(id,name,thumbnailLink,size)`,
            orderBy: 'modifiedTime desc'
        });

        const files = data.data.files || []
        const duration = Date.now() - startTime

         // ========== CACHE HEADERS (CDN de Vercel) ==========
        res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')//Cache por 5 minutos
        res.setHeader('CDN-Cache-Control', 'public, s-maxage=300')
        res.setHeader('Vercel-CDN-Cache-Control', 'public, s-maxage=300')

        res.status(200).json({
            success: true,
            files: files,
            meta: {
                count: files.length,
                duration,
                timestamp: new Date().toISOString()
            }
        })
        console.log("✅ Libros servidos")

    } catch (err) {
        console.error('Error:', err)
        res.status(500).json({ 
            error: err.message || 'Error al obtener archivos' 
        })
    }
}
    // ***** LLAMANDO A API PUBLICA *******//
    // const FOLDER_ID = process.env.FOLDER_ID
    // const API_KEY = process.env.GOOGLE_API_KEY
 
    // const query = `'${FOLDER_ID}' in parents and mimeType='application/pdf'`
    // const encodedQuery = encodeURIComponent(query);
    // const url = `https://www.googleapis.com/drive/v3/files?q=${encodedQuery}&key=${API_KEY}&fields=files(id,name,thumbnailLink,webViewLink)`

    // try {
    //     const response = await fetch(url)
    //     const data = await response.json()
        
    //     if (!data.files) 
    //         return res.status(404).json({message: 'No se encontraron archivos.'})

    //     res.status(200).json(data.files)
    // }
    // catch (err) {
    //     console.error('Error al traer los archivos desde la API de google', err)
    //     res.status(500).json({message:'Internal server error =P'})
    // }
