
// SERVICIO en desuso ya que hemos implementado Backend proxy Serverless
const API_KEY = "Se llevó a .env y a configuración de variables gloables de vercel";
const FOLDER_ID = "Se llevó a .env y a configuración de variables gloables de vercel";

export const fetchGoogleDrivePDFs = async () => {
    const query = `${FOLDER_ID}'+in+parents+and+mimeType='application/pdf`
    const url = `https://www.googleapis.com/drive/v3/files?q='${query}'&key=${API_KEY}&fields=files(id,name,thumbnailLink,webViewLink)`

    // Retornamos una promesa
    return fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error("Error al obtener los archivos de Google Drive" + res.status)
            }
            return res.json()
        })
        .then(data => {
            return data.files
        })
        .catch(err => console.log(err   ))
}

