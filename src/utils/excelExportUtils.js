import ExcelJS from "exceljs";

/**
 * Generador de planillas Excel (.xlsx) con diseño corporativo premium, autoría y redes sociales
 * @param {Object} options
 * @param {string} options.sheetName - Nombre de la pestaña (ej: "Cubicación ICHA")
 * @param {string} options.title - Título principal (ej: "Resumen de Cubicación - Catálogo ICHA")
 * @param {string} options.subtitle - Subtítulo (ej: "Instituto Chileno del Acero · Perfiles Oficiales")
 * @param {string} options.standardTag - Etiqueta de norma (ej: "NORMA ICHA OFICIAL")
 * @param {Array<{ header: string, key: string, width?: number, align?: 'left'|'center'|'right', numFmt?: string }>} options.columns - Definición de columnas
 * @param {Array<Object>} options.data - Arreglo de objetos con los datos de las filas
 * @param {Object} options.summary - Resumen { subtotal, extraPct, extraWeight, grandTotal, tonTotal, unitLabel, tonUnitLabel }
 * @param {string} options.filename - Nombre del archivo .xlsx a descargar
 */
export async function generateTakeoffExcel({
  sheetName = "Cubicación",
  title = "Reporte de Cubicación de Estructuras de Acero",
  subtitle = "Plataforma de Ingeniería Estructural & BIM · AtelijuDesign",
  standardTag = "CÁLCULO ESTRUCTURAL",
  columns = [],
  data = [],
  summary = {},
  filename = "cubicacion_acero.xlsx",
}) {
  if (!data || data.length === 0) {
    alert("No hay datos en la lista de cubicación.");
    return;
  }

  const wb = new ExcelJS.Workbook();
  wb.creator = "Andrés Gallo P. - AtelijuDesign";
  wb.created = new Date();
  wb.properties.date1904 = false;

  const ws = wb.addWorksheet(sheetName, {
    views: [{ showGridLines: true }],
  });

  const numCols = columns.length;
  const lastColLetter = getColLetter(numCols);

  // 1. Fila 1: Franja de Acento Superior Bicolor
  const accentRow = ws.addRow(new Array(numCols).fill(""));
  accentRow.height = 6;
  for (let c = 1; c <= numCols; c++) {
    const cell = accentRow.getCell(c);
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2563EB" }, // Blue-600
    };
  }

  // 2. Fila 2: Título Principal y Tag de Norma
  const titleRow = ws.addRow(new Array(numCols).fill(""));
  titleRow.height = 28;
  ws.mergeCells(`A2:${getColLetter(Math.max(1, numCols - 2))}2`);
  const titleCell = ws.getCell("A2");
  titleCell.value = title.toUpperCase();
  titleCell.font = { name: "Arial", size: 13, bold: true, color: { argb: "FF0F172A" } };
  titleCell.alignment = { vertical: "middle", horizontal: "left" };

  // Tag en las últimas columnas
  if (numCols >= 3) {
    ws.mergeCells(`${getColLetter(numCols - 1)}2:${lastColLetter}2`);
    const tagCell = ws.getCell(`${getColLetter(numCols - 1)}2`);
    tagCell.value = standardTag.toUpperCase();
    tagCell.font = { name: "Arial", size: 8.5, bold: true, color: { argb: "FF2563EB" } };
    tagCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } };
    tagCell.alignment = { vertical: "middle", horizontal: "center" };
    tagCell.border = {
      top: { style: "thin", color: { argb: "FFE2E8F0" } },
      bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
      left: { style: "thin", color: { argb: "FFE2E8F0" } },
      right: { style: "thin", color: { argb: "FFE2E8F0" } },
    };
  }

  // 3. Fila 3: Subtítulo & Metadatos
  const subRow = ws.addRow(new Array(numCols).fill(""));
  subRow.height = 18;
  ws.mergeCells(`A3:${getColLetter(Math.max(1, numCols - 2))}3`);
  const subCell = ws.getCell("A3");
  subCell.value = `${subtitle}  |  Autor: Andrés Gallo P. (andresgallo@pm.me)  |  Fecha: ${new Date().toLocaleDateString("es-CL")}`;
  subCell.font = { name: "Arial", size: 8.5, italic: true, color: { argb: "FF64748B" } };
  subCell.alignment = { vertical: "middle", horizontal: "left" };

  // 4. Fila 4: Espaciador
  const spacerRow = ws.addRow(new Array(numCols).fill(""));
  spacerRow.height = 8;

  // 5. Fila 5: Encabezados de Tabla
  const headerValues = columns.map((col) => col.header);
  const headerRow = ws.addRow(headerValues);
  headerRow.height = 24;

  headerRow.eachCell((cell, colNum) => {
    cell.font = { name: "Arial", size: 9, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0F172A" }, // Slate-900
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: columns[colNum - 1]?.align || "center",
      wrapText: true,
    };
    cell.border = {
      top: { style: "medium", color: { argb: "FF334155" } },
      bottom: { style: "medium", color: { argb: "FF2563EB" } },
      left: { style: "thin", color: { argb: "FF334155" } },
      right: { style: "thin", color: { argb: "FF334155" } },
    };
  });

  // 6. Filas de Datos
  data.forEach((rowObj, rIdx) => {
    const rowValues = columns.map((col) => rowObj[col.key]);
    const row = ws.addRow(rowValues);
    row.height = 20;

    const isEven = rIdx % 2 === 0;
    const rowBgColor = isEven ? "FFFFFFFF" : "FFF8FAFC"; // Slate-50 alternating

    row.eachCell((cell, colNum) => {
      const colDef = columns[colNum - 1] || {};
      cell.font = { name: "Arial", size: 9, color: { argb: "FF1E293B" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: rowBgColor },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: colDef.align || "left",
      };

      if (colDef.numFmt) {
        cell.numFmt = colDef.numFmt;
      }

      cell.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };
    });
  });

  // 7. Espaciador antes del Resumen
  const gapRow = ws.addRow(new Array(numCols).fill(""));
  gapRow.height = 10;

  // 8. Filas de Resumen Consolidado (Summary Card Rows)
  const unitStr = summary.unitLabel || "kg";
  const tonUnitStr = summary.tonUnitLabel || "Ton";
  const labelColIdx = Math.max(1, numCols - 1);
  const valColIdx = numCols;

  // Fila Resumen 1: Subtotal Estructural
  const subtotalRow = ws.addRow(new Array(numCols).fill(""));
  subtotalRow.height = 20;
  if (labelColIdx > 1) {
    ws.mergeCells(`A${subtotalRow.number}:${getColLetter(labelColIdx)}${subtotalRow.number}`);
  }
  const subLabelCell = subtotalRow.getCell(1);
  subLabelCell.value = "SUBTOTAL PESO ESTRUCTURAL:";
  subLabelCell.font = { name: "Arial", size: 9, bold: true, color: { argb: "FF475569" } };
  subLabelCell.alignment = { vertical: "middle", horizontal: "right" };

  const subValCell = subtotalRow.getCell(valColIdx);
  subValCell.value = summary.subtotal || 0;
  subValCell.numFmt = `#,##0.00 "${unitStr}"`;
  subValCell.font = { name: "Arial", size: 9.5, bold: true, color: { argb: "FF0F172A" } };
  subValCell.alignment = { vertical: "middle", horizontal: "right" };
  applySummaryBorder(subtotalRow, numCols, "FFF1F5F9");

  // Fila Resumen 2: Margen de Conexiones
  const marginRow = ws.addRow(new Array(numCols).fill(""));
  marginRow.height = 20;
  if (labelColIdx > 1) {
    ws.mergeCells(`A${marginRow.number}:${getColLetter(labelColIdx)}${marginRow.number}`);
  }
  const marginLabelCell = marginRow.getCell(1);
  marginLabelCell.value = `MARGEN CONEXIONES / DESPUNTE (+${summary.extraPct || 0}%):`;
  marginLabelCell.font = { name: "Arial", size: 9, bold: true, color: { argb: "FFD97706" } }; // Amber-600
  marginLabelCell.alignment = { vertical: "middle", horizontal: "right" };

  const marginValCell = marginRow.getCell(valColIdx);
  marginValCell.value = summary.extraWeight || 0;
  marginValCell.numFmt = `+#,##0.00 "${unitStr}"`;
  marginValCell.font = { name: "Arial", size: 9.5, bold: true, color: { argb: "FFD97706" } };
  marginValCell.alignment = { vertical: "middle", horizontal: "right" };
  applySummaryBorder(marginRow, numCols, "FFFFFBEB"); // Amber-50

  // Fila Resumen 3: Total General Estimado (Destacado en Slate-900)
  const grandRow = ws.addRow(new Array(numCols).fill(""));
  grandRow.height = 24;
  if (labelColIdx > 1) {
    ws.mergeCells(`A${grandRow.number}:${getColLetter(labelColIdx)}${grandRow.number}`);
  }
  const grandLabelCell = grandRow.getCell(1);
  grandLabelCell.value = "PESO TOTAL ESTIMADO:";
  grandLabelCell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
  grandLabelCell.alignment = { vertical: "middle", horizontal: "right" };

  const grandValCell = grandRow.getCell(valColIdx);
  grandValCell.value = summary.grandTotal || 0;
  grandValCell.numFmt = `#,##0.00 "${unitStr}"`;
  grandValCell.font = { name: "Arial", size: 11, bold: true, color: { argb: "FF38BDF8" } }; // Sky-400
  grandValCell.alignment = { vertical: "middle", horizontal: "right" };

  for (let c = 1; c <= numCols; c++) {
    grandRow.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F172A" } };
    grandRow.getCell(c).border = {
      top: { style: "medium", color: { argb: "FF2563EB" } },
      bottom: { style: "medium", color: { argb: "FF2563EB" } },
      left: { style: "thin", color: { argb: "FF334155" } },
      right: { style: "thin", color: { argb: "FF334155" } },
    };
  }

  // Fila Resumen 4: Total en Toneladas (Destacado Verde Esmeralda)
  const tonRow = ws.addRow(new Array(numCols).fill(""));
  tonRow.height = 22;
  if (labelColIdx > 1) {
    ws.mergeCells(`A${tonRow.number}:${getColLetter(labelColIdx)}${tonRow.number}`);
  }
  const tonLabelCell = tonRow.getCell(1);
  tonLabelCell.value = "PESO TOTAL EN TONELADAS:";
  tonLabelCell.font = { name: "Arial", size: 9.5, bold: true, color: { argb: "FF047857" } }; // Emerald-700
  tonLabelCell.alignment = { vertical: "middle", horizontal: "right" };

  const tonValCell = tonRow.getCell(valColIdx);
  tonValCell.value = summary.tonTotal || 0;
  tonValCell.numFmt = `#,##0.000 "${tonUnitStr}"`;
  tonValCell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FF047857" } };
  tonValCell.alignment = { vertical: "middle", horizontal: "right" };
  applySummaryBorder(tonRow, numCols, "FFECFDF5"); // Emerald-50

  // 9. Fila de Redes Sociales & Contacto al pie de la Planilla Excel
  const footerSpacer = ws.addRow(new Array(numCols).fill(""));
  footerSpacer.height = 10;

  const socialRow = ws.addRow(new Array(numCols).fill(""));
  socialRow.height = 20;
  ws.mergeCells(`A${socialRow.number}:${lastColLetter}${socialRow.number}`);
  const socialCell = socialRow.getCell(1);
  socialCell.value = "Ing. Andrés Gallo P.  |  Email: andresgallo@pm.me  |  LinkedIn: in/andresgallop  |  GitHub: Atelijudesign  |  YouTube: @andresgalloparra";
  socialCell.font = { name: "Arial", size: 8, color: { argb: "FF2563EB" }, underline: true };
  socialCell.alignment = { vertical: "middle", horizontal: "center" };
  socialCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFC" } };

  // 10. Configuración de Anchos de Columna
  columns.forEach((col, idx) => {
    ws.getColumn(idx + 1).width = col.width || 18;
  });

  // 11. Generar y Descargar Archivo .xlsx
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function applySummaryBorder(row, numCols, bgColor) {
  for (let c = 1; c <= numCols; c++) {
    const cell = row.getCell(c);
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
    cell.border = {
      top: { style: "thin", color: { argb: "FFE2E8F0" } },
      bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
      left: { style: "thin", color: { argb: "FFE2E8F0" } },
      right: { style: "thin", color: { argb: "FFE2E8F0" } },
    };
  }
}

function getColLetter(colIdx) {
  let letter = "";
  while (colIdx > 0) {
    let rem = (colIdx - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    colIdx = Math.floor((colIdx - rem) / 26);
  }
  return letter || "A";
}
