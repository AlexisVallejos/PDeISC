// ARCHIVO: modules/pdf.js
// QUÉ HACE: genera el PDF descargable con la tabla de posiciones usando la librería pdfkit.
// El PDF se arma "en streaming": se va escribiendo directamente en la respuesta HTTP.

import PDFDocument from "pdfkit"; // Librería que crea documentos PDF desde JavaScript.

// Escribo una tabla de posiciones sencilla en un PDF descargable.
export function enviarPdf(res, puntajes) {
  const pdf = new PDFDocument({ margin: 50, size: "A4" }); // Documento A4 con 50 puntos de margen.
  res.setHeader("Content-Type", "application/pdf"); // Le digo al navegador que lo que llega es un PDF.
  res.setHeader("Content-Disposition", "attachment; filename=tabla-de-posiciones-ahorcado.pdf"); // "attachment" fuerza la descarga y define el nombre del archivo.
  pdf.pipe(res); // Conecto la salida del PDF con la respuesta: lo que se escribe viaja al navegador.
  pdf.fontSize(20).text("El Ahorcado | Tabla de posiciones", { align: "center" }); // Título centrado, tamaño 20.
  pdf.moveDown().fontSize(10).text(`Generado: ${new Date().toLocaleString("es-AR")}`); // Fecha y hora de generación en formato argentino.
  pdf.moveDown().font("Helvetica-Bold").text("#   Jugador                         Puntos       Tiempo       Fecha"); // Encabezado de columnas en negrita.
  pdf.font("Helvetica"); // Vuelvo a la fuente normal para las filas.
  if (puntajes.length === 0) pdf.moveDown().text("Todavía no hay puntajes guardados."); // Si no hay datos, aviso en lugar de dejar la tabla vacía.
  puntajes.forEach((fila, indice) => { // Recorro cada puntaje; "indice" empieza en 0.
    const fecha = new Date(fila.fecha).toLocaleDateString("es-AR"); // Convierto la fecha guardada a dd/mm/aaaa.
    pdf.text(`${indice + 1}.  ${fila.nombre}                         ${fila.puntos}                 ${fila.tiempo}s           ${fecha}`); // Una línea por jugador: posición, nombre, puntos, tiempo y fecha.
  });
  pdf.end(); // Cierro el documento: termina el archivo y se completa la respuesta.
}
