// ==================== STATE ====================
let currentSeries = null;
let selectedProfile = null;
const profileList = [];
let highlightedIndex = -1;
function parseLocaleNumber(value, fallback = 0) {
  if (value === null || value === undefined) return fallback;
  const normalized = String(value).trim().replace(/\s+/g, "").replace(",", ".");
  if (!normalized) return fallback;
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}
// ==================== PROPERTY LABELS ====================
const PROP_LABELS = {
  weight: { i18n: "prop_weight", unit: "kg/m", icon: "fa-weight-hanging" },
  A_cm2: { i18n: "prop_area", unit: "cm²", icon: "fa-vector-square" },
  H_mm: { i18n: "prop_h", unit: "mm", icon: "fa-arrows-up-down" },
  B_mm: { i18n: "prop_b", unit: "mm", icon: "fa-arrows-left-right" },
  e_mm: { i18n: "prop_e", unit: "mm", icon: "fa-ruler" },
  t_mm: { i18n: "prop_t", unit: "mm", icon: "fa-ruler" },
  C_mm: { i18n: "prop_c", unit: "mm", icon: "fa-ruler" },
  Ix_cm4: { i18n: "prop_ix", unit: "cm⁴", icon: "fa-rotate" },
  Wx_cm3: { i18n: "prop_wx", unit: "cm³", icon: "fa-cube" },
  ix_cm: { i18n: "prop_ix_rad", unit: "cm", icon: "fa-circle-dot" },
  Iy_cm4: { i18n: "prop_iy", unit: "cm⁴", icon: "fa-rotate" },
  Wy_cm3: { i18n: "prop_wy", unit: "cm³", icon: "fa-cube" },
  iy_cm: { i18n: "prop_iy_rad", unit: "cm", icon: "fa-circle-dot" },
  xy_cm: { i18n: "prop_xy", unit: "cm", icon: "fa-crosshairs" },
  x_cm: { i18n: "prop_x", unit: "cm", icon: "fa-crosshairs" },
  y_cm: { i18n: "prop_y", unit: "cm", icon: "fa-crosshairs" },
  X_cm: { i18n: "prop_X", unit: "cm", icon: "fa-crosshairs" },
  iu_cm: { i18n: "prop_iu", unit: "cm", icon: "fa-circle-dot" },
  iv_cm: { i18n: "prop_iv", unit: "cm", icon: "fa-circle-dot" },
};
// ==================== SERIES SELECTOR ====================
function renderSeriesSelector() {
  const container = document.getElementById("series-selector");
  if (!container) return;
  container.innerHTML = "";
  for (const [key, series] of Object.entries(ICHA_CATALOG)) {
    const btn = document.createElement("button");
    btn.className = "profile-btn glass-card rounded-xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer border border-transparent";
    btn.innerHTML = `
      <i class="${series.icon} profile-icon text-gray-400 text-lg"></i>
      <span class="text-xs font-bold text-gray-400 leading-tight text-center">${key.replace("_desig", "")}</span>
      <span class="text-[10px] text-gray-600 leading-tight text-center truncate w-full">${series.name.split("(")[0].trim()}</span>
    `;
    btn.addEventListener("click", () => selectSeries(key));
    container.appendChild(btn);
  }
}
function selectSeries(key) {
  currentSeries = key;
  selectedProfile = null;
  highlightedIndex = -1;
  document.querySelectorAll("#series-selector .profile-btn").forEach((btn, i) => {
    const seriesKey = Object.keys(ICHA_CATALOG)[i];
    btn.classList.toggle("active", seriesKey === key);
  });
  const searchInput = document.getElementById("profile-search");
  if (searchInput) {
    searchInput.value = "";
    searchInput.placeholder = `${t("search_placeholder_prefix")} ${ICHA_CATALOG[key].name}...`;
    searchInput.focus();
  }
  showSearchResults("");
  document.getElementById("selected-profile-display")?.classList.add("hidden");
  const addControls = document.getElementById("add-controls");
  if (addControls) addControls.style.display = "none";
  const propGrid = document.getElementById("properties-grid");
  if (propGrid) {
    propGrid.innerHTML = `
      <div class="prop-card col-span-full text-center py-8 text-gray-600">
        <i class="fa-solid fa-search text-2xl mb-2 block"></i>
        <p class="text-sm">${ICHA_CATALOG[key].profiles.length} ${t("msg_profiles_available")}</p>
      </div>
    `;
  }
}
// ==================== SEARCH ====================
function showSearchResults(query) {
  if (!currentSeries) return;
  const container = document.getElementById("search-results");
  if (!container) return;
  const profiles = ICHA_CATALOG[currentSeries].profiles;
  const q = query.toLowerCase().replace(/\s+/g, "");
  const minIx = parseLocaleNumber(document.getElementById("filter-ix")?.value, 0);
  const minW = parseLocaleNumber(document.getElementById("filter-weight-min")?.value, 0);
  const maxW = parseLocaleNumber(document.getElementById("filter-weight")?.value, Infinity);
  const maxH = parseLocaleNumber(document.getElementById("filter-h")?.value, Infinity);
  const filtered = profiles.filter((p) => {
    const desig = p.designation.toLowerCase().replace(/\s+/g, "");
    const matchesSearch = desig.includes(q);
    const profileH = p.H_mm || getHeightFromDesig(p.designation) || 0;
    const matchesIx = (p.Ix_cm4 || 0) >= minIx;
    const matchesWeight = p.weight >= minW && p.weight <= maxW;
    const matchesH = profileH <= maxH;
    return matchesSearch && matchesIx && matchesWeight && matchesH;
  });
  if (filtered.length === 0) {
    container.innerHTML = `<div class="p-4 text-center text-gray-500 text-sm">${t("msg_no_results")}</div>`;
    container.classList.remove("hidden");
    return;
  }
  container.innerHTML = filtered.map((p, i) => `
    <div class="dropdown-item px-4 py-2.5 cursor-pointer text-sm flex items-center justify-between border-b border-gray-800/50 last:border-0"
         data-index="${profiles.indexOf(p)}" data-filtered-index="${i}">
      <div class="flex flex-col">
        <span class="font-semibold text-white whitespace-nowrap">${p.designation}</span>
        ${p.Ix_cm4 ? `<span class="text-[10px] text-bim-blue">Ix: ${p.Ix_cm4} cm⁴</span>` : ""}
      </div>
      <span class="text-xs text-gray-500 font-medium">${p.weight} kg/m</span>
    </div>`).join("");
  container.classList.remove("hidden");
  highlightedIndex = -1;
  container.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", () => {
      const idx = parseInt(item.dataset.index);
      selectProfile(profiles[idx]);
      container.classList.add("hidden");
    });
  });
}
// ==================== SELECT PROFILE ====================
function selectProfile(profile) {
  if (profile.H_mm === undefined) profile.H_mm = getHeightFromDesig(profile.designation);
  if (profile.B_mm === undefined) {
    const w = getWidthFromDesig(profile.designation);
    if (w !== null) {
      profile.B_mm = w;
    } else if (currentSeries === "L" || profile.designation.trim().startsWith("L ")) {
      profile.B_mm = profile.H_mm;
    }
  }
  selectedProfile = profile;
  const searchInput = document.getElementById("profile-search");
  if (searchInput) searchInput.value = profile.designation;
  const display = document.getElementById("selected-profile-display");
  if (display) {
    display.classList.remove("hidden");
    document.getElementById("selected-profile-name").textContent = profile.designation;
    document.getElementById("selected-weight").textContent = profile.weight.toFixed(1);
    document.getElementById("selected-area").textContent = (profile.A_cm2 || 0).toFixed(1);
  }
  const addControls = document.getElementById("add-controls");
  if (addControls) addControls.style.display = "block";
  renderProperties(profile);
  renderSvgDiagram(profile);
}
function renderProperties(profile) {
  const grid = document.getElementById("properties-grid");
  if (!grid) return;
  let html = "";
  const order = ["weight", "A_cm2", "H_mm", "B_mm", "t_mm", "e_mm", "Ix_cm4", "Iy_cm4", "Wx_cm3", "Wy_cm3", "ix_cm", "iy_cm", "C_mm", "xy_cm", "x_cm", "y_cm", "X_cm", "iu_cm", "iv_cm"];
  for (const key of order) {
    if (profile[key] === undefined || profile[key] === null) continue;
    const meta = PROP_LABELS[key];
    if (!meta) continue;
    const isWeight = key === "weight";
    html += `
      <div class="prop-card ${isWeight ? "border-blue-500/30 bg-blue-500/5" : ""}">
        <div class="flex items-center gap-2 mb-1">
          <i class="fa-solid ${meta.icon} text-[10px] ${isWeight ? "text-bim-blue" : "text-gray-600"}"></i>
          <span class="text-xs text-gray-500 font-medium">${t(meta.i18n)}</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-lg font-extrabold ${isWeight ? "text-bim-blue" : "text-white"}">${formatNumber(profile[key])}</span>
          <span class="text-[10px] text-gray-500">${meta.unit}</span>
        </div>
      </div>`;
  }
  grid.innerHTML = html || `<div class="col-span-full text-center py-8 text-gray-500">Sin propiedades disponibles</div>`;
}
function formatNumber(n) {
  if (n === null || n === undefined) return "�”";
  if (Math.abs(n) >= 10000) return n.toLocaleString("es-CL");
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(n < 10 ? 2 : 1);
}
// ==================== SVG CROSS-SECTION ====================
const SZ = 240, CX = SZ / 2, CY = SZ / 2, PAD = 45;
function dimLine(x1, y1, x2, y2, label, offset = 0, color = "#60a5fa") {
  const isV = Math.abs(x1 - x2) < 2;
  const ox = isV ? offset : 0, oy = isV ? 0 : offset;
  const mx = (x1 + x2) / 2 + ox, my = (y1 + y2) / 2 + oy;
  const tox = isV ? (offset > 0 ? 8 : -8) : 0;
  const toy = isV ? 0 : offset > 0 ? 12 : -6;
  const tx = Math.max(24, Math.min(SZ - 24, mx + tox));
  const ty = Math.max(10, Math.min(SZ - 4, my + toy));
  return `<line x1="${x1 + ox}" y1="${y1 + oy}" x2="${x2 + ox}" y2="${y2 + oy}" stroke="${color}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.7"/>
          <text x="${tx}" y="${ty}" fill="${color}" font-size="10" font-family="Inter" font-weight="600" text-anchor="middle">${label}</text>`;
}
function getHeightFromDesig(designation) {
  const clean = designation.replace(/,/, ".").trim();
  const m = clean.match(/(\d+(\.\d+)?)/);
  if (m) {
    const val = parseFloat(m[1]);
    const cmSeries = /^(IN|HN|IP|PH|IE|C|CA|IC|ICA|L|TL|XL|Cuad|Rect|Box)\b/i;
    if (cmSeries.test(clean)) return val * 10;
    return val < 100 ? val * 10 : val;
  }
  return 300;
}
function getWidthFromDesig(designation) {
  if (!designation.trim().startsWith("L")) return null;
  const clean = designation.replace(/,/, ".");
  const m = clean.match(/(\d+(\.\d+)?)\*(\d+(\.\d+)?)/);
  if (m) {
    const val = parseFloat(m[3]);
    return val < 100 ? val * 10 : val;
  }
  return null;
}
function buildICHAHSvg(h, b, s, t) {
  const sc = Math.min((SZ - 2 * PAD) / h, (SZ - 2 * PAD) / b);
  const H = h * sc, B = b * sc, S = Math.max(s * sc, 4), T = Math.max(t * sc, 4);
  const x = CX, y = CY;
  const shape = `<polygon points="${x - B / 2},${y - H / 2} ${x + B / 2},${y - H / 2} ${x + B / 2},${y - H / 2 + T} ${x + S / 2},${y - H / 2 + T} ${x + S / 2},${y + H / 2 - T} ${x + B / 2},${y + H / 2 - T} ${x + B / 2},${y + H / 2} ${x - B / 2},${y + H / 2} ${x - B / 2},${y + H / 2 - T} ${x - S / 2},${y + H / 2 - T} ${x - S / 2},${y - H / 2 + T} ${x - B / 2},${y - H / 2 + T}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;
  let dims = dimLine(x - B / 2, y - H / 2, x - B / 2, y + H / 2, `h=${h}`, -22);
  dims += dimLine(x - B / 2, y + H / 2, x + B / 2, y + H / 2, `b=${b}`, 18);
  dims += `<text x="${x + S / 2 + 6}" y="${y + 4}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">t=${s}</text>`;
  dims += `<text x="${x + B / 2 + 6}" y="${y - H / 2 + T / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">e=${t}</text>`;
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Sección transversal del perfil">${shape}${dims}</svg>`;
}
function buildICHACSvg(h, b, e, t) {
  const bVal = b || 80;
  const sc = Math.min((SZ - 2 * PAD) / h, (SZ - 2 * PAD) / (bVal * 2));
  const H = h * sc, B = bVal * sc, T = Math.max((t || e) * sc, 3);
  const x = CX, top = CY - H / 2;
  const pts = `${x - B},${top} ${x},${top} ${x},${top + T} ${x - B + T},${top + T} ${x - B + T},${top + H - T} ${x},${top + H - T} ${x},${top + H} ${x - B},${top + H}`;
  const shape = `<polygon points="${pts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;
  let dims = dimLine(x + 4, top, x + 4, top + H, `h=${h}`, 14);
  dims += dimLine(x - B, top + H, x, top + H, `b=${bVal}`, 16);
  dims += `<text x="${x + 6}" y="${top + T + 12}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">e=${e || t}</text>`;
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Sección transversal del perfil">${shape}${dims}</svg>`;
}
function buildICHACASvg(h, b, e, t, c) {
  const sc = Math.min((SZ - 2 * PAD) / h, (SZ - 2 * PAD) / ((b || 80) * 2));
  const H = h * sc, B = Math.max((b || 50) * sc, 8), T = Math.max((t || e) * sc, 3);
  const C = c ? Math.max(c * sc, 6) : 0;
  const left = CX - B / 2, top = CY - H / 2;
  let pts = C > 0 ? `${left},${top} ${left + B},${top} ${left + B},${top + C} ${left + B - T},${top + C} ${left + B - T},${top + T} ${left + T},${top + T} ${left + T},${top + H - T} ${left + B - T},${top + H - T} ${left + B - T},${top + H - C} ${left + B},${top + H - C} ${left + B},${top + H} ${left},${top + H}` : `${left},${top} ${left + B},${top} ${left + B},${top + T} ${left + T},${top + T} ${left + T},${top + H - T} ${left + B},${top + H - T} ${left + B},${top + H} ${left},${top + H}`;
  const shape = `<polygon points="${pts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;
  let dims = dimLine(left + B + 4, top, left + B + 4, top + H, `h=${h}`, 16);
  dims += dimLine(left, top + H, left + B, top + H, `b=${b || 50}`, 16);
  dims += `<text x="${left + B + 6}" y="${top + T / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">e=${e || t}</text>`;
  if (C > 0) dims += `<text x="${left + B + 6}" y="${top + H - C / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">c=${c}</text>`;
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Sección transversal del perfil">${shape}${dims}</svg>`;
}
function buildICHALSvg(h, b, e) {
  const bVal = b || h;
  const maxD = Math.max(h, bVal);
  const sc = (SZ - 2 * PAD) / maxD;
  const H = h * sc, B = bVal * sc, T = Math.max(e * sc, 3);
  const x = CX - B / 2, top = CY - H / 2;
  const pts = `${x},${top} ${x + T},${top} ${x + T},${top + H - T} ${x + B},${top + H - T} ${x + B},${top + H} ${x},${top + H}`;
  const shape = `<polygon points="${pts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;
  let dims = dimLine(x, top, x, top + H, `h=${h}`, -20);
  dims += dimLine(x, top + H, x + B, top + H, `b=${bVal}`, 16);
  dims += `<text x="${x + T + 6}" y="${top + 20}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">e=${e}</text>`;
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Sección transversal del perfil">${shape}${dims}</svg>`;
}
function buildICHATLSvg(h, b, e) {
  const bVal = b || h;
  const sc = Math.min((SZ - 2 * PAD) / h, (SZ - 2 * PAD) / (bVal * 2)) * 0.85;
  const H = h * sc, B = bVal * sc, T = Math.max(e * sc, 3);
  const gap = 6;
  const lx = CX - gap / 2, top = CY - H / 2, rx = CX + gap / 2;
  const lPts = `${lx},${top} ${lx - T},${top} ${lx - T},${top + H - T} ${lx - B},${top + H - T} ${lx - B},${top + H} ${lx},${top + H}`;
  const rPts = `${rx},${top} ${rx + T},${top} ${rx + T},${top + H - T} ${rx + B},${top + H - T} ${rx + B},${top + H} ${rx},${top + H}`;
  const shape = `<polygon points="${lPts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/><polygon points="${rPts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;
  let dims = dimLine(lx - B, top, lx - B, top + H, `h=${h}`, -18);
  dims += dimLine(rx, top + H, rx + B, top + H, `b=${bVal}`, 16);
  dims += `<text x="${rx + T + 6}" y="${top + 14}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">e=${e}</text>`;
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Sección transversal del perfil">${shape}${dims}</svg>`;
}
function buildICHAXLSvg(h, b, e) {
  const bVal = b || h;
  const sc = ((SZ - 2 * PAD) / Math.max(h, bVal)) * 0.7;
  const H = h * sc, B = bVal * sc, T = Math.max(e * sc, 3), gap = 6;
  const ax = CX - gap / 2, ay = CY - gap / 2, bx = CX + gap / 2, by = CY + gap / 2;
  const aPts = `${ax},${ay} ${ax},${ay - H} ${ax - T},${ay - H} ${ax - T},${ay - T} ${ax - B},${ay - T} ${ax - B},${ay}`;
  const bPts = `${bx},${by} ${bx},${by + H} ${bx + T},${by + H} ${bx + T},${by + T} ${bx + B},${by + T} ${bx + B},${by}`;
  const shape = `<polygon points="${aPts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2" stroke-linejoin="round"/><polygon points="${bPts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2" stroke-linejoin="round"/>`;
  let dims = dimLine(ax - T, ay - H, ax - T, ay, `h=${h}`, -18);
  dims += dimLine(ax - B, ay, ax, ay, `b=${bVal}`, 16);
  dims += `<text x="${ax + 8}" y="${ay - H + 14}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">e=${e}</text>`;
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Sección transversal del perfil">${shape}${dims}</svg>`;
}
function buildICHAICSvg(h, b, e, t) {
  const bVal = b || 80;
  const sc = Math.min((SZ - 2 * PAD) / h, (SZ - 2 * PAD) / (bVal * 2)) * 0.9;
  const H = h * sc, B = bVal * sc, T = Math.max((t || e) * sc, 3), gap = 4, top = CY - H / 2;
  const lx = CX - gap / 2, rx = CX + gap / 2;
  const lPts = `${lx},${top} ${lx - B},${top} ${lx - B},${top + T} ${lx - T},${top + T} ${lx - T},${top + H - T} ${lx - B},${top + H - T} ${lx - B},${top + H} ${lx},${top + H}`;
  const rPts = `${rx},${top} ${rx + B},${top} ${rx + B},${top + T} ${rx + T},${top + T} ${rx + T},${top + H - T} ${rx + B},${top + H - T} ${rx + B},${top + H} ${rx},${top + H}`;
  const shape = `<polygon points="${lPts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/><polygon points="${rPts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;
  let dims = dimLine(rx + B + 4, top, rx + B + 4, top + H, `h=${h}`, 16);
  dims += dimLine(rx, top + H, rx + B, top + H, `b=${bVal}`, 16);
  dims += `<text x="${rx + T + 6}" y="${top + T + 12}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">e=${e || t}</text>`;
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}</svg>`;
}
function buildICHAICASvg(h, b, e, t, c) {
  const bVal = b || 80;
  const sc = Math.min((SZ - 2 * PAD) / h, (SZ - 2 * PAD) / (bVal * 2)) * 0.9;
  const H = h * sc, B = Math.max(bVal * sc, 8), T = Math.max((t || e) * sc, 3), C = c ? Math.max(c * sc, 6) : 0, gap = 4, top = CY - H / 2;
  const lx = CX - gap / 2, rx = CX + gap / 2;
  let lPts = C > 0 ? `${lx},${top} ${lx - B},${top} ${lx - B},${top + C} ${lx - B + T},${top + C} ${lx - B + T},${top + T} ${lx - T},${top + T} ${lx - T},${top + H - T} ${lx - B + T},${top + H - T} ${lx - B + T},${top + H - C} ${lx - B},${top + H - C} ${lx - B},${top + H} ${lx},${top + H}` : `${lx},${top} ${lx - B},${top} ${lx - B},${top + T} ${lx - T},${top + T} ${lx - T},${top + H - T} ${lx - B},${top + H - T} ${lx - B},${top + H} ${lx},${top + H}`;
  let rPts = C > 0 ? `${rx},${top} ${rx + B},${top} ${rx + B},${top + C} ${rx + B - T},${top + C} ${rx + B - T},${top + T} ${rx + T},${top + T} ${rx + T},${top + H - T} ${rx + B - T},${top + H - T} ${rx + B - T},${top + H - C} ${rx + B},${top + H - C} ${rx + B},${top + H} ${rx},${top + H}` : `${rx},${top} ${rx + B},${top} ${rx + B},${top + T} ${rx + T},${top + T} ${rx + T},${top + H - T} ${rx + B},${top + H - T} ${rx + B},${top + H} ${rx},${top + H}`;
  const shape = `<polygon points="${lPts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/><polygon points="${rPts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;
  let dims = dimLine(rx + B + 4, top, rx + B + 4, top + H, `h=${h}`, 16);
  dims += dimLine(rx, top + H, rx + B, top + H, `b=${bVal}`, 16);
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}</svg>`;
}
function buildICHABoxSvg(h, b, e) {
  const sc = Math.min((SZ - 2 * PAD) / h, (SZ - 2 * PAD) / b);
  const H = h * sc, B = b * sc, T = Math.max(e * sc, 3), x = CX - B / 2, y = CY - H / 2;
  const outer = `<rect x="${x}" y="${y}" width="${B}" height="${H}" fill="none" stroke="#3b82f6" stroke-width="2" rx="3"/>`;
  const inner = `<rect x="${x + T}" y="${y + T}" width="${B - 2 * T}" height="${H - 2 * T}" fill="rgba(11,18,32,0.9)" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,2" rx="1"/>`;
  const fill = `<rect x="${x}" y="${y}" width="${B}" height="${H}" fill="rgba(59,130,246,0.12)" rx="3"/>`;
  const innerClear = `<rect x="${x + T}" y="${y + T}" width="${B - 2 * T}" height="${H - 2 * T}" fill="rgba(11,18,32,0.85)" rx="1"/>`;
  let dims = dimLine(x, y, x, y + H, `h=${h}`, -22);
  dims += dimLine(x, y + H, x + B, y + H, `b=${b}`, 16);
  dims += `<text x="${CX}" y="${CY + 4}" fill="#60a5fa" font-size="10" font-family="Inter" font-weight="600" text-anchor="middle">e=${e}</text>`;
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Sección transversal del perfil">${fill}${innerClear}${outer}${inner}${dims}</svg>`;
}
function renderSvgDiagram(profile) {
  const container = document.getElementById("svg-container");
  if (!container) return;
  document.getElementById("designation-text").textContent = profile.designation;
  const h = parseLocaleNumber(profile.H_mm, 0) || getHeightFromDesig(profile.designation) || 200;
  let b = parseLocaleNumber(profile.B_mm, 0) || getWidthFromDesig(profile.designation);
  if (!b) b = ["IN", "IP", "HN", "PH"].includes(currentSeries) ? h * 0.5 : h;
  const e = parseLocaleNumber(profile.e_mm, 0) || 8, t = parseLocaleNumber(profile.t_mm, 0) || e, c = parseLocaleNumber(profile.C_mm, 0) || 0;
  const s = currentSeries;
  const svg =
    (["IN", "IP", "HN", "PH"].includes(s) && buildICHAHSvg(h, b, t, e)) ||
    (s === "C" && buildICHACSvg(h, b, t, e)) ||
    (s === "CA" && buildICHACASvg(h, b, t, e, c)) ||
    (s === "IC" && buildICHAICSvg(h, b, t, e)) ||
    (s === "ICA" && buildICHAICASvg(h, b, t, e, c)) ||
    ((s === "L" || s === "L_desig") && buildICHALSvg(h, b, e)) ||
    (s === "TL" && buildICHATLSvg(h, b, e)) ||
    (s === "XL" && buildICHAXLSvg(h, b, e)) ||
    (s === "CAJON" && buildICHABoxSvg(h, b, e)) ||
    buildICHAHSvg(h, b, t, e);
  if (window.update3DView) window.update3DView(profile);
  container.innerHTML = svg;
}
function addToList() {
  if (!selectedProfile) return;
  const mark = document.getElementById("list-mark")?.value || "�”";
  const len = parseLocaleNumber(document.getElementById("list-len")?.value, 6);
  const qty = parseInt(document.getElementById("list-qty")?.value) || 1;
  profileList.push({ ...selectedProfile, mark, qty, length: len, unitWeight: selectedProfile.weight, totalWeight: qty * len * selectedProfile.weight });
  renderProfileList();
  const listMark = document.getElementById("list-mark");
  if (listMark) listMark.value = "";
}
function removeFromList(index) {
  profileList.splice(index, 1);
  renderProfileList();
}
function clearList() {
  if (confirm(t("msg_confirm_clear"))) {
    profileList.length = 0;
    renderProfileList();
    localStorage.removeItem("bim-catalogo-icha-list");
  }
}
function renderProfileList() {
  const tbody = document.getElementById("profile-list-body");
  if (!tbody) return;
  const section = document.getElementById("summary-section");
  const classSection = document.getElementById("classification-section");
  if (profileList.length === 0) {
    section?.classList.add("hidden");
    classSection?.classList.add("hidden");
    return;
  }
  section?.classList.remove("hidden");
  classSection?.classList.remove("hidden");
  let totalWeight = 0;
  tbody.innerHTML = profileList.map((item, i) => {
    totalWeight += item.totalWeight;
    const bgClass = i % 2 === 0 ? "" : "bg-gray-800/20";
    return `<tr class="${bgClass} hover:bg-gray-700/30 transition-colors"><td class="py-3 px-4 font-semibold text-white">${item.mark}</td><td class="py-3 px-4 text-center font-bold">${item.qty}</td><td class="py-3 px-4 text-bim-blue font-semibold">${item.designation}</td><td class="py-3 px-4 text-right">${item.length.toFixed(1)}</td><td class="py-3 px-4 text-right">${item.unitWeight.toFixed(2)}</td><td class="py-3 px-4 text-right font-bold text-white">${item.totalWeight.toFixed(2)}</td><td class="py-3 px-4 text-center"><button onclick="removeFromList(${i})" class="text-red-500 hover:text-red-400 transition-colors"><i class="fa-solid fa-xmark"></i></button></td></tr>`;
  }).join("");
  const gtw = document.getElementById("grand-total-weight");
  if (gtw) gtw.innerHTML = `${totalWeight.toFixed(2)} <span class="text-xs text-gray-500 font-medium ml-1">kg</span>`;
  updateClassification();
}
function updateClassification() {
  const categories = [ { name: t("cat_light"), min: 0, max: 25 }, { name: t("cat_medium"), min: 25, max: 50 }, { name: t("cat_heavy"), min: 50, max: 100 }, { name: t("cat_extra"), min: 100, max: Infinity } ];
  const catWeights = categories.map(() => 0);
  profileList.forEach((item) => {
    for (let i = 0; i < categories.length; i++) {
      if (item.unitWeight >= categories[i].min && item.unitWeight < categories[i].max) {
        catWeights[i] += item.totalWeight;
        break;
      }
    }
  });
  const tbody = document.getElementById("classification-body");
  if (!tbody) return;
  const totalWeight = catWeights.reduce((a, b) => a + b, 0);
  const connPct = parseLocaleNumber(document.getElementById("conn-pct")?.value, 10);
  const connection = totalWeight * (connPct / 100);
  const grandTotal = totalWeight + connection;
  tbody.innerHTML = categories.map((cat, i) => {
    const bgClass = i % 2 === 0 ? "" : "bg-gray-800/20";
    return `<tr class="${bgClass} border-b border-gray-800"><td class="py-3 px-4">${cat.name}</td><td class="py-3 px-4 text-right text-gray-500">kg</td><td class="py-3 px-4 text-right font-bold text-white">${catWeights[i].toFixed(2)}</td></tr>`;
  }).join("") + `<tr class="border-b border-gray-800 bg-gray-800/20"><td class="py-3 px-4 font-semibold text-yellow-400">+ ${connPct}% ${t("chart_conns")}</td><td class="py-3 px-4 text-right text-gray-500">kg</td><td class="py-3 px-4 text-right font-bold text-yellow-400">${connection.toFixed(2)}</td></tr>`;
  const ct = document.getElementById("classification-total");
  if (ct) ct.innerHTML = `${grandTotal.toFixed(2)} <span class="text-xs text-gray-500">kg</span>`;
  renderDonutChart(categories, catWeights, connection);
}
let donutChart = null;
function renderDonutChart(categories, catWeights, connection) {
  const ctx = document.getElementById("weight-donut-chart");
  if (!ctx) return;
  if (donutChart) donutChart.destroy();
  const labels = categories.map((c) => c.name.split("≤")[0].trim()).concat([t("chart_conns")]);
  const data = [...catWeights, connection];
  const total = data.reduce((a, b) => a + b, 0);
  const labelsWithPct = labels.map((l, i) => {
    const pct = total > 0 ? ((data[i] / total) * 100).toFixed(1) : "0.0";
    return `${l} (${pct}%)`;
  });
  const colors = ["#3b82f6", "#06b6d4", "#f59e0b", "#ef4444", "#8b5cf6"];
  donutChart = new Chart(ctx, {
    type: "doughnut",
    data: { labels: labelsWithPct, datasets: [{ data: data, backgroundColor: colors, borderColor: "#111827", borderWidth: 2 }] },
    options: { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 10, bottom: 10, left: 10, right: 30 } }, plugins: { legend: { position: "bottom", labels: { color: "#9ca3af", font: { size: 10 }, padding: 15, usePointStyle: true, pointStyleWidth: 8 } }, tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed.toFixed(1)} kg (${((ctx.parsed / ctx.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)` } } }, cutout: "55%" }
  });
}
let comparatorList = [];
function addToComparator() {
  if (!selectedProfile) {
    showToast(t("msg_select_profile"), "fa-triangle-exclamation", "amber");
    return;
  }
  const p = selectedProfile;
  const item = { name: p.designation, weight: p.weight, area: p.A_cm2, ix: p.Ix_cm4 || 0, iy: p.Iy_cm4 || 0, wx: p.Wx_cm3 || 0, wy: p.Wy_cm3 || 0 };
  if (comparatorList.length >= 4) comparatorList.shift();
  comparatorList.push(item);
  renderComparator();
  showToast(`${t("msg_added_comp")}: ${item.name}`, "fa-code-compare", "purple");
  setTimeout(() => {
    const section = document.getElementById("comparator-section");
    section?.classList.remove("hidden");
    section?.scrollIntoView({ behavior: "smooth" });
  }, 500);
}
function clearComparator() {
  comparatorList = [];
  renderComparator();
  showToast(t("msg_cleared"), "fa-trash-can", "gray");
}
function renderComparator() {
  const section = document.getElementById("comparator-section");
  if (!section) return;
  if (comparatorList.length === 0) {
    section.classList.add("hidden");
    return;
  }
  section.classList.remove("hidden");
  const tbody = document.getElementById("comparator-body");
  if (!tbody) return;
  for (let i = 0; i < 4; i++) {
    const el = document.getElementById(`comp-name-${i}`);
    if (el) {
      if (comparatorList[i]) {
        el.textContent = comparatorList[i].name;
        el.classList.remove("text-gray-600");
        el.classList.add("text-bim-blue");
      } else {
        el.textContent = "�”";
        el.classList.remove("text-bim-blue");
        el.classList.add("text-gray-600");
      }
    }
  }
  const props = [ { id: "weight", label: t("res_weight"), unit: "kg/m" }, { id: "area", label: t("res_area"), unit: "cm²" }, { id: "ix", label: "Ix", unit: "cm⁴" }, { id: "iy", label: "Iy", unit: "cm⁴" }, { id: "wx", label: "Wx", unit: "cm³" }, { id: "wy", label: "Wy", unit: "cm³" } ];
  tbody.innerHTML = props.map((p) => {
    let rowHtml = `<td class="py-3 px-4 text-gray-400 font-medium">${p.label} <span class="text-[10px] text-gray-600 block">${p.unit}</span></td>`;
    for (let i = 0; i < 4; i++) {
      const val = comparatorList[i] ? comparatorList[i][p.id] : null;
      rowHtml += `<td class="py-3 px-4 text-center font-mono ${val !== null ? "text-white" : "text-gray-700"}">${val !== null ? val.toFixed(2) : "�”"}</td>`;
    }
    return `<tr class="border-b border-gray-800/50 hover:bg-gray-800/20">${rowHtml}</tr>`;
  }).join("");
}
function copyTableToClipboard() {
  if (profileList.length === 0) return;
  let text = `${t("th_mark")}\t${t("th_qty")}\t${t("th_profile")}\t${t("th_len")} (m)\t${t("th_unit_weight")} (kg/m)\t${t("th_total_weight")} (kg)\n`;
  profileList.forEach((item) => { text += `${item.mark}\t${item.qty}\t${item.designation}\t${item.length.toFixed(2)}\t${item.unitWeight.toFixed(2)}\t${item.totalWeight.toFixed(2)}\n`; });
  const total = profileList.reduce((s, i) => s + i.totalWeight, 0);
  text += `${t("total_label")}\t\t\t\t\t${total.toFixed(2)}\n`;
  navigator.clipboard.writeText(text).then(() => { showToast(t("msg_copied"), "fa-clipboard", "green"); });
}
function showToast(message, icon, color) {
  const existing = document.getElementById("bim-toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.id = "bim-toast";
  toast.className = `fixed bottom-20 right-8 bg-${color}-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-bold z-50 transition-all transform translate-y-2 opacity-0`;
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => { toast.style.transform = "translateY(0)"; toast.style.opacity = "1"; });
  setTimeout(() => { toast.style.transform = "translateY(10px)"; toast.style.opacity = "0"; setTimeout(() => toast.remove(), 300); }, 2500);
}
function exportToPDF() {
  if (profileList.length === 0) { showToast(t("msg_no_data"), "fa-triangle-exclamation", "amber"); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFillColor(11, 18, 32); doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.setFont("helvetica", "bold"); doc.text(t("excel_title_catalog"), 15, 25);
  doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.text("Andrés Gallo P. �” BIM Developer", 15, 33); doc.text(new Date().toLocaleDateString(), 180, 33);
  const head = [[t("th_profile"), t("prop_weight"), t("prop_area"), "Ix (cm4)", "Iy (cm4)", "Wx (cm3)", "Wy (cm3)"]];
  const body = profileList.map((p) => [p.designation, p.unitWeight.toFixed(2), p.A_cm2 ? p.A_cm2.toFixed(2) : "�”", p.Ix_cm4 ? p.Ix_cm4.toFixed(2) : "�”", p.Iy_cm4 ? p.Iy_cm4.toFixed(2) : "�”", p.Wx_cm3 ? p.Wx_cm3.toFixed(2) : "�”", p.Wy_cm3 ? p.Wy_cm3.toFixed(2) : "�”"]);
  doc.autoTable({ head, body, startY: 50, theme: "grid", headStyles: { fillColor: [59, 130, 246], halign: "center" }, styles: { fontSize: 8 }, columnStyles: { 0: { cellWidth: 40 } } });
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setTextColor(0, 0, 0); doc.setFontSize(14); doc.text(t("sect_classification"), 15, finalY);
  const classTable = document.getElementById("classification-table");
  if (classTable) doc.autoTable({ html: "#classification-table", startY: finalY + 5, theme: "striped", headStyles: { fillColor: [31, 41, 55] }, styles: { fontSize: 9 } });
  const chartCanvas = document.getElementById("weight-donut-chart");
  if (chartCanvas) {
    try {
      const chartImg = chartCanvas.toDataURL("image/png", 1.0);
      const chartY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : finalY) + 10;
      const pdfW = 80, pdfH = (chartCanvas.height / chartCanvas.width) * pdfW;
      doc.addImage(chartImg, "PNG", (210 - pdfW) / 2, chartY, pdfW, pdfH);
    } catch (e) { console.error("Error capturing chart:", e); }
  }
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) { doc.setPage(i); doc.setFontSize(8); doc.setTextColor(150); doc.text(`Página ${i} de ${pageCount}`, 180, doc.internal.pageSize.height - 10); }
  doc.save(`Catalogo_ICHA_${new Date().getTime()}.pdf`);
}
function exportToExcel() {
  if (profileList.length === 0) return;
  const n = profileList.length;
  const bd = { top: { style: "thin", color: { rgb: "BDD7EE" } }, bottom: { style: "thin", color: { rgb: "BDD7EE" } }, left: { style: "thin", color: { rgb: "BDD7EE" } }, right: { style: "thin", color: { rgb: "BDD7EE" } } };
  const S = {
    title: { font: { bold: true, sz: 13, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "1F4E79" } }, alignment: { horizontal: "center", vertical: "center" }, border: bd },
    head: { font: { bold: true, sz: 10, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "2E75B6" } }, alignment: { horizontal: "center", vertical: "center" }, border: bd },
    l: { font: { sz: 10 }, border: bd, alignment: { vertical: "center" } },
    c: { font: { sz: 10 }, border: bd, alignment: { horizontal: "center", vertical: "center" } },
    r: { font: { sz: 10 }, border: bd, alignment: { horizontal: "right", vertical: "center" }, numFmt: "#,##0.00" },
    al: { font: { sz: 10 }, fill: { fgColor: { rgb: "F2F7FB" } }, border: bd, alignment: { vertical: "center" } },
    ac: { font: { sz: 10 }, fill: { fgColor: { rgb: "F2F7FB" } }, border: bd, alignment: { horizontal: "center", vertical: "center" } },
    ar: { font: { sz: 10 }, fill: { fgColor: { rgb: "F2F7FB" } }, border: bd, alignment: { horizontal: "right", vertical: "center" }, numFmt: "#,##0.00" },
    tl: { font: { bold: true, sz: 11, color: { rgb: "1F4E79" } }, fill: { fgColor: { rgb: "D6E4F0" } }, border: bd, alignment: { vertical: "center" } },
    tc: { font: { bold: true, sz: 11, color: { rgb: "1F4E79" } }, fill: { fgColor: { rgb: "D6E4F0" } }, border: bd, alignment: { horizontal: "center", vertical: "center" } },
    tr: { font: { bold: true, sz: 11, color: { rgb: "1F4E79" } }, fill: { fgColor: { rgb: "D6E4F0" } }, border: bd, alignment: { horizontal: "right", vertical: "center" }, numFmt: "#,##0.00" },
  };
  const a = [[t("excel_title_catalog"), "", "", "", "", ""], [""], [t("th_mark"), t("th_qty"), t("th_profile"), `${t("th_len")} (m)`, `${t("th_unit_weight")} (kg/m)`, `${t("th_total_weight")} (kg)`]];
  profileList.forEach((i) => a.push([i.mark, i.qty, i.designation, i.length, i.unitWeight, i.totalWeight]));
  const tw = profileList.reduce((s, i) => s + i.totalWeight, 0);
  a.push([t("total_label"), "", "", "", "", tw], [""], [""], [t("excel_class_title"), "", "", "", "", ""], [""], [t("cls_desc"), t("cls_unit"), t("cls_qty")]);
  const categories = [{ name: t("cat_light"), min: 0, max: 25 }, { name: t("cat_medium"), min: 25, max: 50 }, { name: t("cat_heavy"), min: 50, max: 100 }, { name: t("cat_extra"), min: 100, max: Infinity }];
  const catWeights = categories.map(() => 0);
  profileList.forEach((item) => { for (let i = 0; i < categories.length; i++) { if (item.unitWeight >= categories[i].min && item.unitWeight < categories[i].max) { catWeights[i] += item.totalWeight; break; } } });
  const tb = catWeights.reduce((s, v) => s + v, 0), connPct = parseLocaleNumber(document.getElementById("conn-pct")?.value, 10), cn = tb * (connPct / 100), tf = tb + cn;
  categories.forEach((cat, i) => a.push([cat.name.split("≤")[0].trim(), "kg", catWeights[i]]));
  a.push([`${t("excel_conns")} (+${connPct}%)`, "kg", cn], [""], [t("excel_total_final"), "kg", tf], ["", "ton", tf / 1000]);
  const ws = XLSX.utils.aoa_to_sheet(a); ws["!cols"] = [{ wch: 45 }, { wch: 14 }, { wch: 28 }, { wch: 14 }, { wch: 18 }, { wch: 16 }];
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, { s: { r: 6 + n, c: 0 }, e: { r: 6 + n, c: 5 } }];
  function sc(r, c, s) { const addr = XLSX.utils.encode_cell({ r, c }); if (!ws[addr]) ws[addr] = { v: "", t: "s" }; ws[addr].s = s; }
  for (let c = 0; c < 6; c++) sc(0, c, S.title);
  for (let c = 0; c < 6; c++) sc(2, c, S.head);
  for (let i = 0; i < n; i++) { const r = 3 + i, alt = i % 2 === 1; sc(r, 0, alt ? S.al : S.l); sc(r, 1, alt ? S.ac : S.c); sc(r, 2, alt ? S.al : S.l); sc(r, 3, alt ? S.ar : S.r); sc(r, 4, alt ? S.ar : S.r); sc(r, 5, alt ? S.ar : S.r); }
  for (let c = 0; c < 5; c++) sc(3 + n, c, S.tl); sc(3 + n, 5, S.tr);
  for (let c = 0; c < 6; c++) sc(6 + n, c, S.title);
  for (let c = 0; c < 3; c++) sc(8 + n, c, S.head);
  for (let i = 0; i < 4; i++) { const r = 9 + n + i, alt = i % 2 === 1; sc(r, 0, alt ? S.al : S.l); sc(r, 1, alt ? S.ac : S.c); sc(r, 2, alt ? S.ar : S.r); }
  sc(13 + n, 0, S.al); sc(13 + n, 1, S.ac); sc(13 + n, 2, S.ar);
  sc(15 + n, 0, S.tl); sc(15 + n, 1, S.tc); sc(15 + n, 2, S.tr);
  sc(16 + n, 0, S.tl); sc(16 + n, 1, S.tc); sc(16 + n, 2, S.tr);
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Catálogo ICHA");
  XLSX.writeFile(wb, `Catalogo_ICHA_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
document.getElementById("profile-search")?.addEventListener("input", function () { showSearchResults(this.value); });
document.getElementById("profile-search")?.addEventListener("focus", function () { if (currentSeries) showSearchResults(this.value); });
document.getElementById("profile-search")?.addEventListener("keydown", function (e) {
  const container = document.getElementById("search-results");
  const items = container?.querySelectorAll(".dropdown-item");
  if (!items || !items.length) return;
  if (e.key === "ArrowDown") { e.preventDefault(); highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1); updateHighlight(items); }
  else if (e.key === "ArrowUp") { e.preventDefault(); highlightedIndex = Math.max(highlightedIndex - 1, 0); updateHighlight(items); }
  else if (e.key === "Enter" && highlightedIndex >= 0) { e.preventDefault(); items[highlightedIndex].click(); }
});
function updateHighlight(items) { items.forEach((item, i) => { item.classList.toggle("highlighted", i === highlightedIndex); if (i === highlightedIndex) item.scrollIntoView({ block: "nearest" }); }); }
document.addEventListener("click", function (e) {
  const searchPanel = document.getElementById("search-panel");
  if (searchPanel && !searchPanel.contains(e.target)) document.getElementById("search-results")?.classList.add("hidden");
});
document.getElementById("btn-add-list")?.addEventListener("click", addToList);
document.getElementById("btn-clear-list")?.addEventListener("click", clearList);
["list-mark", "list-len", "list-qty"].forEach((id) => { document.getElementById(id)?.addEventListener("keydown", (e) => { if (e.key === "Enter") addToList(); }); });
function toggleAdvancedFilters() {
  const filters = document.getElementById("advanced-filters");
  const btn = document.getElementById("toggle-filters-btn");
  if (!filters || !btn) return;
  if (filters.classList.contains("hidden")) { filters.classList.remove("hidden"); filters.classList.add("fade-in-up"); btn.classList.add("text-bim-blue", "bg-gray-800"); }
  else { filters.classList.add("hidden"); btn.classList.remove("text-bim-blue", "bg-gray-800"); }
}
document.querySelectorAll("#advanced-filters input").forEach((input) => { input.addEventListener("input", () => { const query = document.getElementById("profile-search")?.value || ""; showSearchResults(query); }); });
document.addEventListener("DOMContentLoaded", () => { renderSeriesSelector(); });