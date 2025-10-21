const FOLDER_ID = "144LydAQEZR2be21ykA31DCWGkXuRqzMh";
const API_KEY = "AIzaSyCHmbbXnvTjN8fB4qC3bWT1k8k5FJQFsXw";

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

