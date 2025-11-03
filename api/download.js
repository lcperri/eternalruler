import googleDriveAuth from "../src/services/googleDriveAuth.js";

export default async function handler(req, res) {
    const { id, filename = "archivo" } = req.query;
    if (!id) return res.status(400).send("Falta el ID del archivo");

    try {
      const drive = googleDriveAuth()

      // 🔹 Obtenemos metadata
      const fileMetadata = await drive.files.get({
          fileId: id,
          fields: 'name, mimeType, size'
      });

       // 🔹 Tipo MIME -> PDF
      const contentType = fileMetadata.data.mimeType || "application/pdf";
      // Leemos el header content-type que dice qué tipo de archivo es (ej. application/pdf).
      const safeFilename = encodeURIComponent(filename || fileMetadata.data.name);
      // Codificamos el filename para que no rompa las cabeceras si tiene espacios o caracteres especiales,
      const fileSize = fileMetadata.data.size;

            // 🔹 Obtener token y hacer fetch manual
      // const auth = drive.context._options.auth;
      // const authClient = await auth.getClient();
      // const tokenResponse = await authClient.getAccessToken();

      // 🔹 SEGUNDA LLAMADA: Solo contenido
      // const driveUrl = `https://www.googleapis.com/drive/v3/files/${id}?alt=media`;
      
      // Hace una petición HTTP a la URL de Drive y espera la respuesta.
      // Se incluye un header User-Agent para que el servidor no descarte la petición
      // por venir de un "bot" o de un entorno serverless.
      // const response = await fetch(driveUrl, {
      //   headers: {
      //     'Authorization': `Bearer ${tokenResponse.token}`,
      //     "User-Agent": "Mozilla/5.0", // Evita bloqueos de user-agent
      //   },
      //   redirect: 'follow'
      // });

      // if (!response.ok) {
      //   const errText = await response.text();
      //   console.error("Error de Drive:", errText);
      //   return res.status(response.status).send("Error al descargar archivo desde Drive");
      // }

      console.log(`📥 Descargando: ${fileMetadata.data.name}`);

      // ⭐ Headers personalizados para forzar descarga de PDF
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFilename}`);
      res.setHeader("Content-Length", fileSize);
      res.setHeader("Accept-Ranges", "bytes"); // Permite resumir descargas
      res.setHeader("Cache-Control", "private, max-age=3600");

      // 🔹 Obtener stream directamente de googleapis
      const fileStream = await drive.files.get(
          { fileId: id, 
            alt: 'media' },
          { responseType: 'stream' }
      );

      // 🔹 Pipe directo (Node.js maneja el backpressure automáticamente)
      fileStream.data
        .on('end', () => {
            console.log('✅ Descarga completada');
            res.end();
        })
        .on('error', (err) => {
            console.error('❌ Error en stream:', err);
            if (!res.headersSent) {
                res.status(500).send("Error al transmitir archivo");
            } else {
                res.end();
            }
        })
        .pipe(res);

      // // 🔹 Stream directo al cliente
      // if (response.body) {
      //   // Si la respuesta tiene un cuerpo en forma de stream (ReadableStream)
      //   const reader = response.body.getReader();
      //   // Obtenemos un "reader" para leer trozos (chunks) del stream.
      //   while (true) {
      //     const { done, value } = await reader.read();
      //     // Leemos el siguiente chunk: 'done' indica si terminó, 'value' es un Uint8Array con bytes.
      //     if (done) break;
      //     res.write(value);
      //     // Escribimos ese chunk directamente en la respuesta al cliente (stream passthrough).
      //   }
      //   res.end();
      // } else {
      //   res.status(500).send("No se pudo obtener el cuerpo del archivo.");
      // }

    } catch (err) {
      console.error("Error general:", err);
      res.status(500).send("Error interno del servidor");
    }
}