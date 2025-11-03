import { useState, useEffect } from "react";
// import { fetchGoogleDrivePDFs } from "../services/googleDriveServices";

export function useDrivePDFs() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() => {
        fetch("/api/books")
        .then(async (res) => {
            if (!res.ok) 
                throw new Error("Error al obtener los libros. Hook --> API local")

            const data = await res.json()
            console.log(data)
            setFiles(data.files)
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    },[])

    return { files, loading, error };
}