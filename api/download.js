export default async function handler(req, res) {
  const { id, filename = "archivo" } = req.query;
  if (!id) return res.status(400).send("Falta el ID del archivo");

  const bookUrl = `https://drive.google.com/uc?export=download&id=${id}`;

  const safeFilename = filename
    ? encodeURIComponent(filename)
    : "archivo.pdf"

  try {
    const response = await fetch(bookUrl);
    if (!response.ok)
      return res.status(response.status).send("Error al descargar PDF");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${safeFilename}.pdf"`
    );

    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    console.error("Error al  descargar el archivo:", err);
    res.status(500).send("Error interno del servidor :P");
  }
}