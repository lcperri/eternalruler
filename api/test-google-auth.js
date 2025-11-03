import googleDriveAuth from '../src/services/googleDriveAuth.js';

export default async function handler(req, res) {
    try {
        const drive = await googleDriveAuth()
        console.log(drive)
        res.status(200).json({
                success: true,
                archivos: drive.data.files,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}