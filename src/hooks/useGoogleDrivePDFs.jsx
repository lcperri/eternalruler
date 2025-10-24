import { useState, useEffect } from "react";
// import { fetchGoogleDrivePDFs } from "../services/googleDriveServices";

export function useDrivePDFs() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() => {
        fetch("api/books")
        .then(async (res) => {
            if (!res.ok) 
                throw new Error("Error al obtener los libros. Hook --> API local")

            const data = await res.json()
            setFiles(data)
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    },[])


    // ESTE CODIGO ERA CUADO SE LLAMABA A LA API DESDE EL FRONTEND:
    // useEffect(() => {
    //     fetchGoogleDrivePDFs()
    //     .then((data) => {
    //         setFiles(data);
    //         setLoading(false);
    //     })
    //     .catch(err => setError(err))
    // }, []);
    return { files, loading, error };
}