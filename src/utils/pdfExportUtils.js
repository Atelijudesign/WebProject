import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generador de reportes PDF corporativos de alta calidad para cubicaciones y herramientas de ingeniería
 * Incluye autoría, redes sociales interactivas, membrete institucional y resumen de pesos.
 * 
 * @param {Object} options
 * @param {string} options.title - Título principal (ej: "Resumen de Cubicación - Catálogo ICHA")
 * @param {string} options.subtitle - Subtítulo / Norma (ej: "Instituto Chileno del Acero · NCh427 / ASTM")
 * @param {string} options.standardTag - Etiqueta de norma (ej: "NORMA ICHA OFICIAL" o "AISC v15.0")
 * @param {Array<string>} options.headers - Encabezados de columnas
 * @param {Array<Array<any>>} options.rows - Filas de datos de los perfiles
 * @param {Object} options.summary - Resumen numérico { subtotal, extraPct, extraWeight, grandTotal, tonTotal, unitLabel, tonUnitLabel }
 * @param {Object} [options.columnAlignments] - Objeto { 0: 'center', 1: 'center', 3: 'right', ... }
 * @param {string} options.filename - Nombre del archivo a guardar (ej: "cubicacion_perfiles.pdf")
 */
export function generateTakeoffPdf({
  title = "Reporte de Cubicación de Estructuras de Acero",
  subtitle = "Plataforma de Ingeniería Estructural & BIM",
  standardTag = "CÁLCULO ESTRUCTURAL",
  headers = [],
  rows = [],
  summary = {},
  columnAlignments = {},
  filename = "cubicacion_acero.pdf",
}) {
  if (!rows || rows.length === 0) {
    alert("No hay datos en la lista de cubicación.");
    return;
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // 1. Franja Superior Bicolor de Marca (Brand Stripe)
  doc.setFillColor(37, 99, 235); // #2563eb Blue
  doc.rect(0, 0, pageWidth, 5, "F");
  doc.setFillColor(6, 182, 212); // #06b6d4 Cyan
  doc.rect(0, 5, pageWidth * 0.35, 1.5, "F");

  // 2. Membrete Superior
  // Tag de Norma / Badge
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(margin, 11, 52, 5.5, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(37, 99, 235);
  doc.text(standardTag.toUpperCase(), margin + 26, 15, { align: "center" });

  // Título Principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(title, margin, 22.5);

  // Subtítulo
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(subtitle, margin, 27.5);

  // Autor & Contacto en Header (Izquierda / Abajo del subtítulo)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85); // slate-700
  doc.text("Autor / Responsable:", margin, 32.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(37, 99, 235);
  doc.text("Andrés Gallo P. — Proyectista Estructural BIM", margin + 30, 32.5);

  // Metadatos (Derecha)
  const metaX = pageWidth - margin;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-CL")}`, metaX, 14, { align: "right" });
  doc.text(`Margen Conexiones: +${summary.extraPct || 0}%`, metaX, 18.5, { align: "right" });
  doc.text(`Email: andresgallo@pm.me`, metaX, 23, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129); // emerald-500
  doc.text("DOCUMENTO TÉCNICO OFICIAL", metaX, 28, { align: "right" });

  // Línea separadora
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.4);
  doc.line(margin, 36, pageWidth - margin, 36);

  // 3. Estilos de Columnas para la Tabla
  const colStyles = {};
  headers.forEach((_, idx) => {
    colStyles[idx] = {
      halign: columnAlignments[idx] || "left",
      cellPadding: 3,
    };
  });

  // 4. Tabla de Perfiles
  autoTable(doc, {
    startY: 40,
    head: [headers],
    body: rows,
    theme: "plain",
    styles: {
      font: "helvetica",
      fontSize: 8.5,
      textColor: [30, 41, 59], // slate-800
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [15, 23, 42], // slate-900
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "center",
      valign: "middle",
      cellPadding: 3.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    columnStyles: colStyles,
    margin: { left: margin, right: margin },
    didDrawPage: (data) => {
      // 5. Pie de Página en cada página con redes sociales
      const pNum = data.pageNumber;
      
      // Línea divisoria superior del footer
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

      // Fila 1 del Footer: Redes Sociales & Contacto
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105); // slate-600

      // Iconos textuales y enlaces
      const fY1 = pageHeight - 11.5;
      doc.text("Andrés Gallo P.  |  Email: andresgallo@pm.me  |  LinkedIn: in/andresgallop  |  GitHub: Atelijudesign  |  YouTube: @andresgalloparra", margin, fY1);

      // Links clickeables sobre el texto
      doc.link(margin + 58, fY1 - 2.5, 28, 4, { url: "https://www.linkedin.com/in/andresgallop/" });
      doc.link(margin + 98, fY1 - 2.5, 26, 4, { url: "https://github.com/Atelijudesign" });
      doc.link(margin + 138, fY1 - 2.5, 34, 4, { url: "https://www.youtube.com/@andresgalloparra" });

      // Fila 2 del Footer: Copyright y Paginación
      const fY2 = pageHeight - 6.5;
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text("© 2026 AtelijuDesign · Plataforma de Ingeniería Estructural, Detallamiento y Automatización BIM", margin, fY2);
      doc.text(`Página ${pNum}`, pageWidth - margin, fY2, { align: "right" });
    },
  });

  // 6. Bloque Inferior: Tarjeta de Autor/Contacto (Izquierda) + Resumen Ejecutivo (Derecha)
  let finalY = doc.lastAutoTable.finalY + 6;

  // Si no cabe en la página actual, agregar nueva página
  if (finalY + 48 > pageHeight - 20) {
    doc.addPage();
    finalY = 20;
  }

  const usableWidth = pageWidth - 2 * margin;
  const cardGap = 6;
  const authorBoxWidth = usableWidth * 0.46;
  const summaryBoxWidth = usableWidth * 0.54 - cardGap;

  const authorX = margin;
  const summaryX = authorX + authorBoxWidth + cardGap;
  const cardHeight = 44;

  const unitStr = summary.unitLabel || "kg";
  const tonUnitStr = summary.tonUnitLabel || "Ton";

  // --- TARJETA DE AUTOR & REDES SOCIALES (Izquierda) ---
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(authorX, finalY, authorBoxWidth, cardHeight, 2, 2, "F");
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(authorX, finalY, authorBoxWidth, cardHeight, 2, 2, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("DATOS DEL AUTOR & CONTACTO", authorX + 6, finalY + 6.5);

  doc.setDrawColor(226, 232, 240);
  doc.line(authorX + 4, finalY + 9, authorX + authorBoxWidth - 4, finalY + 9);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(37, 99, 235);
  doc.text("Andrés Gallo P.", authorX + 6, finalY + 14.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Proyectista Estructural BIM", authorX + 6, finalY + 19);

  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text("• Email: andresgallo@pm.me", authorX + 6, finalY + 25);
  doc.text("• LinkedIn: linkedin.com/in/andresgallop", authorX + 6, finalY + 30.5);
  doc.text("• GitHub: github.com/Atelijudesign", authorX + 6, finalY + 36);
  doc.text("• YouTube: @andresgalloparra", authorX + 6, finalY + 41);

  // Enlaces interactivos en la tarjeta
  doc.link(authorX + 6, finalY + 27.5, authorBoxWidth - 12, 4, { url: "https://www.linkedin.com/in/andresgallop/" });
  doc.link(authorX + 6, finalY + 33, authorBoxWidth - 12, 4, { url: "https://github.com/Atelijudesign" });
  doc.link(authorX + 6, finalY + 38, authorBoxWidth - 12, 4, { url: "https://www.youtube.com/@andresgalloparra" });

  // --- TARJETA DE RESUMEN DE PESOS (Derecha) ---
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(summaryX, finalY, summaryBoxWidth, cardHeight, 2, 2, "F");
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(summaryX, finalY, summaryBoxWidth, cardHeight, 2, 2, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text("RESUMEN DE PESOS Y CÓMPUTO", summaryX + 6, finalY + 6.5);

  doc.setDrawColor(226, 232, 240);
  doc.line(summaryX + 4, finalY + 9, summaryX + summaryBoxWidth - 4, finalY + 9);

  // Fila 1: Subtotal
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Subtotal Estructural:", summaryX + 6, finalY + 14.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${formatNum(summary.subtotal)} ${unitStr}`, summaryX + summaryBoxWidth - 6, finalY + 14.5, { align: "right" });

  // Fila 2: Margen
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Margen Conexiones (+${summary.extraPct || 0}%):`, summaryX + 6, finalY + 20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(217, 119, 6); // amber-600
  doc.text(`+${formatNum(summary.extraWeight)} ${unitStr}`, summaryX + summaryBoxWidth - 6, finalY + 20, { align: "right" });

  // Fila 3: Total General (Destacado)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(summaryX + 3, finalY + 23.5, summaryBoxWidth - 6, 8.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL ESTIMADO:", summaryX + 6, finalY + 29);
  doc.setFontSize(9.5);
  doc.setTextColor(56, 189, 248); // sky-400
  doc.text(`${formatNum(summary.grandTotal)} ${unitStr}`, summaryX + summaryBoxWidth - 6, finalY + 29, { align: "right" });

  // Fila 4: Total en Toneladas
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("TOTAL TONELADAS:", summaryX + 6, finalY + 38);
  doc.setFontSize(8.5);
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text(`${formatNum(summary.tonTotal, 3)} ${tonUnitStr}`, summaryX + summaryBoxWidth - 6, finalY + 38, { align: "right" });

  // Descargar PDF
  doc.save(filename);
}

function formatNum(val, decimals = 2) {
  if (typeof val !== "number" || isNaN(val)) return "0.00";
  return val.toLocaleString("es-CL", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
