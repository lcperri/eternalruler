import { useState, useEffect } from "react";
import { fetchGoogleDrivePDFs } from "../services/googleDriveServices";

export function useDrivePDFs() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 


    useEffect(() => {
        fetchGoogleDrivePDFs()
        .then((data) => {
            setFiles(data);
            setLoading(false);
        })
        .catch(err => setError(err))
    }, []);

    return { files, loading, error };
}