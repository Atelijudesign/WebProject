const tipoSelect = document.getElementById("tipoEscalera");
const forms = document.querySelectorAll(".form-section");
function drawAutoDiagram(tipo, s) {
  const container = document.getElementById('svg-container');
  const title = document.getElementById('diagram-title');
  if (!container) return;
  container.innerHTML = '';
  const W = 800, H = 350;
  const xStart = 200, yStart = 80;
  const xEnd = 600, yEnd = 260;
  const stepCount = Math.max(1, s.numPeldanos);
  const stairRisingsCount = tipo === 'tipo1' ? stepCount : Math.max(1, stepCount - 1);
  const stepW = (xEnd - xStart) / stairRisingsCount;
  const stepH = (yEnd - yStart) / stairRisingsCount;
  const ptCallout = (x, y, label = "P.T.", dx = -30, dy = -30) => `
      <circle cx="${x}" cy="${y}" r="2.5" fill="${vColor}"/>
      <line x1="${x}" y1="${y}" x2="${x + dx}" y2="${y + dy}" stroke="${tColor}" stroke-width="1"/>
      <line x1="${x + dx}" y1="${y + dy}" x2="${x + dx + (dx > 0 ? 20 : -20)}" y2="${y + dy}" stroke="${tColor}" stroke-width="1"/>
      <text x="${x + dx + (dx > 0 ? 10 : -10)}" y="${y + dy - 4}" fill="${vColor}" font-size="11px" font-family="monospace" text-anchor="middle">${label}</text>
  `;
  const lColor = "#3b82f6";
  const sColor = "#6b7280";
  const tColor = "#9ca3af";
  const vColor = "#eff6ff";
  // Generar escaleras (Perfil Completo)
  let stairsSvg = "";
  let topOff = 6;  // Stringer top 6px ARRIBA de la pitch line
  let botOff = 22; // Stringer bottom 22px ABAJO de la pitch line (total D=28)
  if (tipo === 'tipo1' || tipo === 'tipo2' || tipo === 'tipo3') {
    // 1. DIBUJAR EL LIMÃâ€œN
    let hChD = 14; 
    let hBotY_s = yStart - topOff + hChD; 
    let hBotY_e = yEnd - topOff + hChD;   
    stairsSvg += `<line x1="${xStart}" y1="${yStart - topOff}" x2="${xEnd}" y2="${yEnd - topOff}" stroke="${lColor}" stroke-width="1.5"/>`;
    stairsSvg += `<line x1="${xStart}" y1="${yStart + botOff}" x2="${xEnd}" y2="${yEnd + botOff}" stroke="${lColor}" stroke-width="1.5"/>`;
    // 2. GENERAR CADA PELDAÃâ€˜O
    let tW = stepW;
    let tH = 6;
    for (let i = 1; i < stairRisingsCount; i++) {
      let currX = xStart + i * stepW;
      let currY = yStart + i * stepH;
      let rectX = currX - tW;
      stairsSvg += `<rect x="${rectX}" y="${currY}" width="${tW}" height="${tH}" fill="none" stroke="${lColor}" stroke-width="1.5"/>`;
    }
    // 3. EXTENSIONES HORIZONTALES
    if (tipo === 'tipo1' || tipo === 'tipo3') {
      stairsSvg += `<line x1="${xStart - 100}" y1="${yStart - topOff}" x2="${xStart}" y2="${yStart - topOff}" stroke="${lColor}" stroke-width="1.5"/>`;
      stairsSvg += `<line x1="${xStart - 100}" y1="${hBotY_s}" x2="${xStart}" y2="${hBotY_s}" stroke="${lColor}" stroke-width="1.5"/>`;
      stairsSvg += `<line x1="${xStart}" y1="${hBotY_s}" x2="${xStart}" y2="${yStart + botOff}" stroke="${lColor}" stroke-width="1.5"/>`;
      stairsSvg += `<line x1="${xStart - 100}" y1="${yStart - topOff}" x2="${xStart - 100}" y2="${hBotY_s}" stroke="${lColor}" stroke-width="1.5"/>`;
    }
    if (tipo === 'tipo1') {
      stairsSvg += `<line x1="${xEnd}" y1="${yEnd - topOff}" x2="${xEnd + 100}" y2="${yEnd - topOff}" stroke="${lColor}" stroke-width="1.5"/>`;
      stairsSvg += `<line x1="${xEnd}" y1="${hBotY_e}" x2="${xEnd + 100}" y2="${hBotY_e}" stroke="${lColor}" stroke-width="1.5"/>`;
      stairsSvg += `<line x1="${xEnd}" y1="${yEnd + botOff}" x2="${xEnd}" y2="${hBotY_e}" stroke="${lColor}" stroke-width="1.5"/>`;
      stairsSvg += `<line x1="${xEnd + 100}" y1="${yEnd - topOff}" x2="${xEnd + 100}" y2="${hBotY_e}" stroke="${lColor}" stroke-width="1.5"/>`;
    }
  } else {
    let p = `M ${xStart} ${yStart}`;
    let cx = xStart, cy = yStart;
    for (let i = 0; i < stairRisingsCount; i++) {
      cy += stepH; p += ` L ${cx} ${cy}`;
      cx += stepW; p += ` L ${cx} ${cy}`;
    }
    stairsSvg += `<path d="${p}" fill="none" stroke="${lColor}" stroke-width="2"/>`;
    let cExt = Math.max(stepW, 20);
    stairsSvg += `<line x1="${xStart - cExt}" y1="${yStart + stepH + 15}" x2="${xEnd + cExt}" y2="${yEnd + stepH + 15}" stroke="${lColor}" stroke-width="2"/>`;
  }
  const txt = (x, y, text, col = tColor, size = "11px", anchor = "middle") => `<text x="${x}" y="${y}" fill="${col}" font-size="${size}" font-family="monospace" text-anchor="${anchor}">${text}</text>`;
  const line = (x1, y1, x2, y2, c = "#4b5563", style = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2" ${style}/>`;
  const dimLineH = (x1, x2, y, text) => `
      ${line(x1, y - 5, x1, y + 5, tColor, 'stroke-width="1"')} ${line(x2, y - 5, x2, y + 5, tColor, 'stroke-width="1"')}
      ${line(x1, y, x2, y, tColor, 'stroke-width="1"')}
      ${txt((x1 + x2) / 2, y - 8, text, vColor)}
  `;
  const dimLineV = (x, y1, y2, text) => `
      ${line(x - 5, y1, x + 5, y1, tColor, 'stroke-width="1"')} ${line(x - 5, y2, x + 5, y2, tColor, 'stroke-width="1"')}
      ${line(x, y1, x, y2, tColor, 'stroke-width="1"')}
      <text x="${x - 8}" y="${(y1 + y2) / 2}" fill="${vColor}" font-size="11px" font-family="monospace" text-anchor="middle" transform="rotate(-90 ${x - 8} ${(y1 + y2) / 2})">${text}</text>
  `;
  const elMarker = (x, y, elStr, labelStr, dirX = -1) => {
    const hLineY = y - 45;
    const lx = x + (150 * dirX);
    const tX = x + (8 * dirX);
    const tAnchor = dirX === -1 ? "end" : "start";
    return `
      <!-- Floor line -->
      <line x1="${x - 15}" y1="${y}" x2="${x + 15}" y2="${y}" stroke="${vColor}" stroke-width="1"/>
      <!-- Triangle -->
      <polygon points="${x},${y} ${x-8},${y-14} ${x},${y-14}" fill="none" stroke="${vColor}" stroke-width="1"/>
      <polygon points="${x},${y} ${x+8},${y-14} ${x},${y-14}" fill="${vColor}" stroke="${vColor}" stroke-width="1"/>
      <line x1="${x - 8}" y1="${y - 14}" x2="${x + 8}" y2="${y - 14}" stroke="${vColor}" stroke-width="1"/>
      <!-- Flag base -->
      <line x1="${x}" y1="${y - 14}" x2="${x}" y2="${hLineY}" stroke="${vColor}" stroke-width="1"/>
      <line x1="${x}" y1="${hLineY}" x2="${lx}" y2="${hLineY}" stroke="${vColor}" stroke-width="1"/>
      <!-- Text lines -->
      <text x="${tX}" y="${hLineY - 6}" fill="${vColor}" font-size="11px" font-family="monospace" text-anchor="${tAnchor}">EL. ${parseFloat(elStr) > 0 ? '+' : ''}${String(elStr).replace('.', ',')}</text>
      <text x="${tX}" y="${hLineY + 12}" fill="${vColor}" font-size="11px" font-family="monospace" text-anchor="${tAnchor}">${labelStr}</text>
      `;
  };
  let svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="fade-in">
      <defs>
          <pattern id="hatch-acero" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="5" stroke="#3b82f6" stroke-width="0.8" opacity="0.45"/>
          </pattern>
      </defs>`;
  if (tipo === 'tipo1') {
    if (title) title.textContent = "Parrilla a Parrilla";
    let grSurface = yStart - topOff;
    let grTop = grSurface - 6;
    let grTopSvg = `<line x1="${xStart - 100}" y1="${grTop}" x2="${xStart}" y2="${grTop}" stroke="${sColor}" stroke-width="1.5"/>` +
      `<line x1="${xStart - 100}" y1="${grSurface}" x2="${xStart}" y2="${grSurface}" stroke="${sColor}" stroke-width="1.5"/>`;
    for (let gx = xStart - 100; gx < xStart; gx += 7) {
      grTopSvg += `<line x1="${gx + 3}" y1="${grTop}" x2="${gx + 3}" y2="${grSurface}" stroke="${sColor}" stroke-width="1"/>`;
    }
    svg += grTopSvg;
    let grSurfaceB = yEnd - topOff;
    let grTopB = grSurfaceB - 6;
    let grBotSvg = `<line x1="${xEnd}" y1="${grTopB}" x2="${xEnd + 100}" y2="${grTopB}" stroke="${sColor}" stroke-width="1.5"/>` +
      `<line x1="${xEnd}" y1="${grSurfaceB}" x2="${xEnd + 100}" y2="${grSurfaceB}" stroke="${sColor}" stroke-width="1.5"/>`;
    for (let gx = xEnd; gx < xEnd + 100; gx += 7) grBotSvg += `<line x1="${gx + 3}" y1="${grTopB}" x2="${gx + 3}" y2="${grSurfaceB}" stroke="${sColor}" stroke-width="1"/>`;
    svg += grBotSvg;
    svg += line(xStart, yStart, xEnd, yEnd, "#ef4444", 'stroke-dasharray="8,5" opacity="0.8" stroke-width="1.2"');
    svg += stairsSvg;
    svg += dimLineH(xStart, xEnd, yStart - 40, `${stepCount} ESP. @ ${s.huella.toFixed(1)} = ${s.longitudMedia.toFixed(1)}`);
    svg += dimLineV(xEnd + 65, yStart, yEnd, `${stepCount} ESP. @ ${(s.alturaTotal / stepCount).toFixed(1)} = ${s.alturaTotal.toFixed(1)}`);
    svg += ptCallout(xStart, yStart, "P.T.", 30, -20);
    svg += ptCallout(xEnd, yEnd, "P.T.", -40, -20);
    svg += elMarker(xStart - 100, grTop, s.ta1.toFixed(3), "T.G.", -1);
    svg += elMarker(xEnd + 100, grTopB, s.ta2.toFixed(3), "T.G.", 1);
  }
  else if (tipo === 'tipo2') {
    if (title) title.textContent = "Concreto a Concreto / T.S.P";
    svg += line(60, yStart, xStart, yStart, sColor);
    svg += line(60, yStart + 4, xStart, yStart + 4, sColor);
    svg += line(xEnd, yEnd, xEnd + 100, yEnd, sColor);
    svg += line(xEnd, yEnd + 4, xEnd + 100, yEnd + 4, sColor);
    svg += line(xStart, yStart, xEnd, yEnd, "#ef4444", 'stroke-dasharray="8,5" opacity="0.8" stroke-width="1.2"');
    svg += stairsSvg;
    const hRisings = Math.max(1, stepCount - 1);
    svg += dimLineH(xStart, xEnd, yStart - 40, `${hRisings} ESP. @ ${s.huella.toFixed(1)} = ${s.longitudMedia.toFixed(1)}`);
    svg += dimLineV(xEnd + 65, yStart, yEnd, `${hRisings} ESP. @ ${s.contrahuella.toFixed(1)} = ${s.alturaTotal.toFixed(1)}`);
    svg += ptCallout(xStart, yStart, "P.T.", 30, -20);
    svg += ptCallout(xEnd, yEnd, "P.T.", -40, -20);
    svg += elMarker(xStart - 100, yStart, s.tcSup.toFixed(3), "T.S.P.", -1);
    svg += elMarker(xEnd + 100, yEnd, s.tcInf.toFixed(3), "T.S.P.", 1);
  }
  else if (tipo === 'tipo3') {
    if (title) title.textContent = "Parrilla a Concreto con Pedestal";
    let grSurface3 = yStart - topOff;
    let grTop3 = grSurface3 - 6;
    let grT3 = `<line x1="${xStart - 100}" y1="${grTop3}" x2="${xStart}" y2="${grTop3}" stroke="${sColor}" stroke-width="1.5"/>` +
      `<line x1="${xStart - 100}" y1="${grSurface3}" x2="${xStart}" y2="${grSurface3}" stroke="${sColor}" stroke-width="1.5"/>`;
    for (let gx = xStart - 100; gx < xStart; gx += 7) {
      grT3 += `<line x1="${gx + 3}" y1="${grTop3}" x2="${gx + 3}" y2="${grSurface3}" stroke="${sColor}" stroke-width="1"/>`;
    }
    svg += grT3;
    let pedH = Math.min((s.hHormigon / s.alturaTotal) * 200, 50);
    svg += `<rect x="${xEnd - 20}" y="${yEnd}" width="40" height="${pedH}" fill="#4b5563" stroke="#9ca3af" stroke-width="1"/>`;
    svg += `<rect x="${xEnd - 80}" y="${yEnd + pedH}" width="160" height="15" fill="${sColor}" opacity="0.6"/>`;
    svg += line(xStart, yStart, xEnd, yEnd, "#ef4444", 'stroke-dasharray="8,5" opacity="0.8" stroke-width="1.2"');
    svg += stairsSvg;
    const hRisings = Math.max(1, stepCount - 1);
    svg += dimLineH(xStart, xEnd, yStart - 40, `${hRisings} ESP. @ ${s.huella.toFixed(1)} = ${s.longitudMedia.toFixed(1)}`);
    svg += dimLineV(xEnd + 65, yStart + (s.hc1 > 0 ? (s.hc1 / s.alturaTotal) * 200 : stepH), yEnd, `${hRisings} ESP. @ ${s.contrahuella.toFixed(1)} = ${(hRisings * s.contrahuella).toFixed(1)}`);
    svg += dimLineV(xEnd + 105, yStart, yEnd + pedH, `${s.alturaTotal.toFixed(1)}`);
    svg += ptCallout(xStart, yStart, "P.T.", 30, -20);
    svg += elMarker(xStart - 100, grTop3, s.ta1.toFixed(3), "T.G.", -1);
    svg += elMarker(xEnd + 130, yEnd + pedH, s.ta2.toFixed(3), "T.C. o N.T.", 1);
  }
  svg += `</svg>`;
  container.innerHTML = svg;
}
if (tipoSelect) {
  tipoSelect.addEventListener("change", (e) => {
    forms.forEach(f => f.classList.remove("active"));
    const targetForm = document.getElementById(`form-${e.target.value}`);
    if (targetForm) targetForm.classList.add("active");
    runCalc();
  });
}
function runCalc() {
  const tipo = tipoSelect ? tipoSelect.value : 'tipo1';
  const targetContrahuella = parseFloat(document.getElementById('contrahuella-obj').value) || 180;
  const huella = parseFloat(document.getElementById('huella-obj').value) || 250;
  let alturaTotal = 0; let numeroPeldanos = 0; let contrahuellaCalculada = 0; let angulo = 0; let longitudMedia = 0;
  try {
    if (tipo === 'tipo1') {
      const ta1 = parseFloat(document.getElementById('t1-ta1').value) || 0;
      const esp1 = parseFloat(document.getElementById('t1-esp1').value) || 0;
      const ta2 = parseFloat(document.getElementById('t1-ta2').value) || 0;
      const esp2 = parseFloat(document.getElementById('t1-esp2').value) || 0;
      alturaTotal = ((ta1 + (esp1 * 0.001)) - (ta2 + (esp2 * 0.001))) * 1000;
      numeroPeldanos = Math.round(alturaTotal / targetContrahuella);
      contrahuellaCalculada = numeroPeldanos > 0 ? alturaTotal / numeroPeldanos : 0;
      longitudMedia = huella * numeroPeldanos;
    } else if (tipo === 'tipo2') {
      const tcSup = parseFloat(document.getElementById('t2-tc-sup').value) || 0;
      const tcInf = parseFloat(document.getElementById('t2-tc-inf').value) || 0;
      const hc1 = parseFloat(document.getElementById('t2-hc1').value) || 0;
      alturaTotal = (tcSup - tcInf) * 1000;
      numeroPeldanos = Math.round(alturaTotal / targetContrahuella);
      const alturaRestante = alturaTotal - hc1;
      const peldanosRestantes = numeroPeldanos - 1;
      contrahuellaCalculada = peldanosRestantes > 0 ? alturaRestante / peldanosRestantes : 0;
      longitudMedia = huella * peldanosRestantes;
    } else if (tipo === 'tipo3') {
      const ta = parseFloat(document.getElementById('t3-ta').value) || 0;
      const esp = parseFloat(document.getElementById('t3-esp').value) || 0;
      const tc = parseFloat(document.getElementById('t3-tc').value) || 0;
      const hHormigon = parseFloat(document.getElementById('t3-h-hormigon').value) || 0;
      const hc1 = parseFloat(document.getElementById('t3-hc1').value) || 0;
      alturaTotal = ((ta + (esp * 0.001)) - tc) * 1000;
      numeroPeldanos = Math.round((alturaTotal - hHormigon) / targetContrahuella);
      const alturaRestante = alturaTotal - hHormigon - hc1;
      const peldanosRestantes = numeroPeldanos - 1;
      contrahuellaCalculada = peldanosRestantes > 0 ? alturaRestante / peldanosRestantes : 0;
      longitudMedia = huella * peldanosRestantes;
    }
    if (isNaN(alturaTotal) || isNaN(contrahuellaCalculada)) return;
    angulo = huella > 0 ? (Math.atan(contrahuellaCalculada / huella) * (180 / Math.PI)) : 0;
    const resAltura = document.getElementById('res-altura');
    const resPeldanos = document.getElementById('res-peldanos');
    const resContra = document.getElementById('res-contrahuella');
    const resAngulo = document.getElementById('res-angulo');
    const resLong = document.getElementById('res-longitud');
    if (resAltura) resAltura.textContent = Math.abs(alturaTotal).toFixed(0);
    if (resPeldanos) resPeldanos.textContent = numeroPeldanos;
    if (resContra) resContra.textContent = Math.abs(contrahuellaCalculada).toFixed(1);
    if (resAngulo) resAngulo.textContent = angulo.toFixed(1);
    if (resLong) resLong.textContent = Math.abs(longitudMedia).toFixed(0);
    // Checks
    const chVal = Math.abs(contrahuellaCalculada);
    const comod = (2 * chVal) + huella;
    const segur = chVal + huella;
    const valComod = document.getElementById('valor-comodidad');
    if (valComod) valComod.textContent = comod.toFixed(1);
    const bgComod = document.getElementById('caja-comodidad');
    const bdgComod = document.getElementById('badge-comodidad');
    if (bgComod && bdgComod) {
      if (comod > 610 && comod < 650) {
        bgComod.className = "flex justify-between items-center bg-emerald-900/20 border border-emerald-800 p-3 rounded-lg transition-colors";
        bdgComod.className = "text-[10px] font-bold px-2 py-[2px] rounded-full bg-emerald-800/50 text-emerald-400";
        bdgComod.textContent = "Excelente";
      } else {
        bgComod.className = "flex justify-between items-center bg-rose-900/20 border border-rose-800 p-3 rounded-lg transition-colors";
        bdgComod.className = "text-[10px] font-bold px-2 py-[2px] rounded-full bg-rose-800/50 text-rose-400";
        bdgComod.textContent = "Alerta";
      }
    }
    const valSegur = document.getElementById('valor-seguridad');
    if (valSegur) valSegur.textContent = segur.toFixed(1);
    const bgSegur = document.getElementById('caja-seguridad');
    const bdgSegur = document.getElementById('badge-seguridad');
    if (bgSegur && bdgSegur) {
      if (segur <= 460) {
        bgSegur.className = "flex justify-between items-center bg-emerald-900/20 border border-emerald-800 p-3 rounded-lg transition-colors";
        bdgSegur.className = "text-[10px] font-bold px-2 py-[2px] rounded-full bg-emerald-800/50 text-emerald-400";
        bdgSegur.textContent = "Seguro";
      } else {
        bgSegur.className = "flex justify-between items-center bg-rose-900/20 border border-rose-800 p-3 rounded-lg transition-colors";
        bdgSegur.className = "text-[10px] font-bold px-2 py-[2px] rounded-full bg-rose-800/50 text-rose-400";
        bdgSegur.textContent = "Inseguro";
      }
    }
    const state = {
      ta1: parseFloat(document.getElementById(tipo === 'tipo1' ? 't1-ta1' : 't3-ta')?.value) || 0,
      ta2: parseFloat(document.getElementById(tipo === 'tipo1' ? 't1-ta2' : 't3-tc')?.value) || 0,
      tcSup: parseFloat(document.getElementById('t2-tc-sup')?.value) || 0,
      tcInf: parseFloat(document.getElementById('t2-tc-inf')?.value) || 0,
      hHormigon: parseFloat(document.getElementById('t3-h-hormigon')?.value) || 0,
      hc1: parseFloat(document.getElementById(tipo === 'tipo2' ? 't2-hc1' : 't3-hc1')?.value) || 0,
      huella: huella,
      contrahuella: contrahuellaCalculada,
      alturaTotal: Math.abs(alturaTotal),
      numPeldanos: numeroPeldanos,
      longitudMedia: longitudMedia
    };
    drawAutoDiagram(tipo, state);
  } catch (e) { console.error(e); }
}
// Global hook for inputs
window.runCalc = runCalc;
// Initial Calc
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(runCalc, 100);
});