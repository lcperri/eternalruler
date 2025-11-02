import { google } from 'googleapis';

export default async function handler(req, res) {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });

        const drive = google.drive({ version: 'v3', auth });
        
        const response = await drive.files.list({
            pageSize: 5,
            fields: 'files(id, name)',
        });

        res.status(200).json({
            success: true,
            archivos: response.data.files,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}