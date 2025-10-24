export default async function handler (req, res) {
    const FOLDER_ID = process.env.FOLDER_ID
    const API_KEY = process.env.GOOGLE_API_KEY
 
    const query = `'${FOLDER_ID}' in parents and mimeType='application/pdf'`
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodedQuery}&key=${API_KEY}&fields=files(id,name,thumbnailLink,webViewLink)`

    try {
        const response = await fetch(url)
        const data = await response.json()
        
        if (!data.files) 
            return res.status(404).json({message: 'No se encontraron archivos.'})

        res.status(200).json(data.files)
    }
    catch (err) {
        console.error('Error al traer los archivos desde la API de google', err)
        res.status(500).json({message:'Internal server error =P'})
    }
}