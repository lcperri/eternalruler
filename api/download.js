export default async function handler(req, res) {
  const API_KEY = process.env.GOOGLE_API_KEY

  const { id, filename = "archivo" } = req.query;
  if (!id) return res.status(400).send("Falta el ID del archivo");

  try {
    // 🔹 Llamar a la API oficial de Google Drive (sin necesidad de autenticación si el archivo es público)
    const driveUrl = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${API_KEY}`;
     // - alt=media indica que queremos los bytes reales del archivo (no metadata).

    
    // Hace una petición HTTP a la URL de Drive y espera la respuesta.
    // Se incluye un header User-Agent para que el servidor no descarte la petición
    // por venir de un "bot" o de un entorno serverless.
     const response = await fetch(driveUrl, {
      // headers: {
      //   // Evita bloqueos de user-agent
      //   "User-Agent": "Mozilla/5.0",
      // },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Error de Drive:", errText);
      return res.status(response.status).send("Error al descargar archivo desde Drive");
    }

    // 🔹 Tipo MIME y nombre
    const contentType = response.headers.get("content-type") || "application/pdf";
    // Leemos el header content-type que dice qué tipo de archivo es (ej. application/pdf).
    // Si no viene, asumimos "application/pdf" por defecto.
    const safeFilename = encodeURIComponent(filename);
     // Codificamos el filename para que no rompa las cabeceras si tiene espacios o caracteres especiales,


    // 🔹 Configurar headers
    res.setHeader("Content-Type", contentType);
    // Indicamos al navegador el tipo de contenido que llegará (esto ayuda a que lo abra o lo descargue correctamente).

    res.setHeader(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${safeFilename}`
    );
     // Le decimos al navegador que trate la respuesta como una descarga (attachment)
    // y le damos el nombre del archivo, codificado en UTF-8.


    // 🔹 Stream directo al cliente
    if (response.body) {
      // Si la respuesta tiene un cuerpo en forma de stream (ReadableStream)
      const reader = response.body.getReader();
       // Obtenemos un "reader" para leer trozos (chunks) del stream.
      while (true) {
        const { done, value } = await reader.read();
        // Leemos el siguiente chunk: 'done' indica si terminó, 'value' es un Uint8Array con bytes.
        if (done) break;
        res.write(value);
         // Escribimos ese chunk directamente en la respuesta al cliente (stream passthrough).
      }
      res.end();
    } else {
      res.status(500).send("No se pudo obtener el cuerpo del archivo.");
    }
  } catch (err) {
    console.error("Error general:", err);
    res.status(500).send("Error interno del servidor");
  }
}



// export const config = {
//   runtime: "edge",
// };

// export default async function handler(req) {
//   const { searchParams } = new URL(req.url);
//   const id = searchParams.get("id");
//   const filename = searchParams.get("filename") || "archivo";

//   if (!id) {
//     return new Response("Falta el ID del archivo", { status: 400 });
//   }

//   // 1️⃣ Primer intento
//   const baseUrl = `https://drive.google.com/uc?export=download&id=${id}`;
//   let response = await fetch(baseUrl);

//   // Guardar cookies para el segundo fetch
//   const setCookie = response.headers.get("set-cookie") || "";

//   const contentType = response.headers.get("content-type") || "";

//   // 2️⃣ Detectar si es una página HTML de advertencia (en vez del PDF real)
//   if (contentType.includes("text/html")) {
//     const html = await response.text();

//     // Buscar el token "confirm=" en distintos formatos posibles
//     const tokenRegexes = [
//       /confirm=([0-9A-Za-z_]+)&/i,
//       /id=(.*?)&confirm=([0-9A-Za-z_]+)/i,
//       /name="confirm" value="([0-9A-Za-z_]+)"/i,
//     ];

//     let confirmToken = null;
//     for (const regex of tokenRegexes) {
//       const match = html.match(regex);
//       if (match) {
//         confirmToken = match[1] || match[2];
//         break;
//       }
//     }

//     if (confirmToken) {
//       // 3️⃣ Hacer segunda solicitud con token y cookies
//       const confirmedUrl = `https://drive.google.com/uc?export=download&confirm=${confirmToken}&id=${id}`;
//       response = await fetch(confirmedUrl, {
//         headers: {
//           Cookie: setCookie,
//         },
//       });
//     } else {
//       return new Response("No se pudo confirmar la descarga desde Drive", { status: 500 });
//     }
//   }

//   if (!response.ok) {
//     return new Response("Error al descargar el archivo", { status: response.status });
//   }

//   const safeFilename = encodeURIComponent(filename);

//   // 4️⃣ Devolver stream del archivo (sin límite de tamaño)
//   return new Response(response.body, {
//     headers: {
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `attachment; filename*=UTF-8''${safeFilename}.pdf`,
//     },
//   });
// }
