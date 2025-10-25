export default async function handler(req, res) {
    const { id } = req.query; // En Vercel, los params vienen en req.query
    console.log(req.query)
    if (!id) return res.status(400).send("Falta el ID del archivo");

    // const bookUrl = `https://drive.google.com/uc?export=view&id=${id}`;
    const bookUrl = `https://drive.google.com/file/d/${id}/preview`;
    
    res.redirect(bookUrl);
    // try {
    //     const response = await fetch(bookUrl);
        
    //     if (!response.ok)
    //         return res.status(response.status).send("Error al obtener PDF");

    //     // Configurar tipo de contenido
    //     res.setHeader("Content-Type", "application/pdf");

    //     // Convertir el cuerpo en ArrayBuffer (serverless no soporta streaming directo)
    //     const buffer = Buffer.from(await response.arrayBuffer());
    //     res.send(buffer);
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).send("Error interno del servidor");
    // }
}