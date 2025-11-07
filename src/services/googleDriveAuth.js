import { google } from 'googleapis'

//////////////////////:::::::::::::::::CACHE PARA CARGA EFICIENTE :::::::::::::::::::::::::::::::::::::
// Variable global que persiste entre requests
let driveInstance = null

// :::::::::::::::::::::::::::::::  VERSION CON OUATH 2.0  ::::::::::::::::::::::::::::::::::::::::::::
export default function googleDriveAuth() {

    // Si ya existe y no ha expirado, retornar el cache
    if (driveInstance) {
        console.log('✅ Usando Google Drive cacheado')
        return driveInstance
    }
    
    console.log('🔄 Creando nueva conexión a Google Drive...')

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    driveInstance = google.drive({ version: 'v3', auth });

    return driveInstance
}


//:::::::::::::::::::::::::::::::     VERSION CON JSON WEBTOKEN FUNCIONA BIEN: :::::::::::::::::::::::::::::::::::::::
//import jwt from "jsonwebtoken"
// export default async function handler (req, res) {
//     try {
//         const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
//         const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

//         // Paso 1: construimos el payload del JWT
//         const jwtPayload = {
//             iss: clientEmail,
//             scope: "https://www.googleapis.com/auth/drive.readonly",
//             aud: "https://oauth2.googleapis.com/token",
//             exp: Math.floor(Date.now() / 1000) + 3600,
//             iat: Math.floor(Date.now() / 1000),
//         };

//         // Paso 2: firmamos el JWT con RS256
//         const signedJwt = jwt.sign(jwtPayload, privateKey, { algorithm: "RS256" });

//         // Paso 3: solicitamos el token de acceso a Google
//         const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
//             method: "POST",
//             headers: { "Content-Type": "application/x-www-form-urlencoded" },
//             body: new URLSearchParams({
//                 grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
//                 assertion: signedJwt,
//             }),
//         });

//         const tokenData = await tokenRes.json();

//         if (!tokenData.access_token) {
//         return res.status(401).json({
//             error: "❌ No se pudo obtener token de acceso",
//             details: tokenData,
//         });
//         }

//         // Paso 4: hacemos una prueba listando los primeros archivos del Drive
//         const driveRes = await fetch(
//         "https://www.googleapis.com/drive/v3/files?pageSize=5&fields=files(id,name)",
//         {
//             headers: {
//             Authorization: `Bearer ${tokenData.access_token}`,
//             },
//         }
//         );

//         const driveData = await driveRes.json();

//         res.status(200).json({
//             token_obtenido: true,
//             archivos: driveData.files || [],
//             detalles: driveData,
//         });
//     } catch (error) {
//         console.error("Error general:", error);
//         res.status(500).json({ error: error.message });
//     }
// }