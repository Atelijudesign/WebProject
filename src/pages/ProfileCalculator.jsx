import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { PROFILE_CALCULATORS } from "../utils/profileCalculations";
import { ICHA_CATALOG } from "../data/icha_data.js";
import { useTranslation } from "../context/LanguageContext";
import { ExportService, ExcelTakeoffStrategy, PdfTakeoffStrategy } from "../core/export";

import {
  dimLine,
  buildHSvg,
  buildTSvg,
  buildCASvg,
  buildICASvg,
  buildCSvg,
  buildICSvg,
  buildLSvg,
  buildTLSvg,
  buildXLSvg,
  buildPlateSvg,
  buildPipeSvg,
  buildTubeSvg,
  buildRBSvg,
} from "../components/svg/ProfileSvgFactory";
import { ProfileSectionViewer } from "../components/svg/ProfileSectionViewer";

// ==================== PROFILE DEFINITIONS & ICHA MAPPING ====================
const ICHA_SERIES_MAP = {
  H: ["HN", "IN", "IP", "PH"],
  CA: ["CA"],
  ICA: ["ICA"],
  C: ["C"],
  IC: ["IC"],
  L: ["L", "L_desig"],
  TL: ["TL"],
  XL: ["XL"],
  PROF: ["CAJON"],
};

const PROFILES = {
  H: {
    name: "H / Viga Soldada", label: "H / W", icon: "fa-solid fa-h", subtitle: "HN · IN · IP · PH",
    inputs: [
      { id: "h", label: "h (altura total)", unit: "mm", default: 200 },
      { id: "b", label: "b (ancho ala)", unit: "mm", default: 100 },
      { id: "s", label: "s / t (alma)", unit: "mm", default: 6 },
      { id: "t", label: "t / e (ala)", unit: "mm", default: 12 },
    ],
    calc(v) { return PROFILE_CALCULATORS.H(v); },
    svg(v, g) { return buildHSvg(v.h, v.b, v.s, v.t, v.t, false, null, null, g); },
  },
  HE: {
    name: "HE Profile", label: "HE", icon: "fa-solid fa-h", subtitle: "Alas Desiguales",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 250 },
      { id: "b1", label: "b1 (ala sup.)", unit: "mm", default: 200 },
      { id: "b2", label: "b2 (ala inf.)", unit: "mm", default: 200 },
      { id: "t1", label: "t1 (ala sup.)", unit: "mm", default: 14 },
      { id: "t2", label: "t2 (ala inf.)", unit: "mm", default: 14 },
      { id: "s", label: "s (alma)", unit: "mm", default: 6 },
    ],
    calc(v) { return PROFILE_CALCULATORS.HE(v); },
    svg(v) { return buildHSvg(v.h, Math.max(v.b1, v.b2), v.s, v.t1, v.t2, true, v.b1, v.b2); },
  },
  T: {
    name: "T Profile", label: "T", icon: "fa-solid fa-t", subtitle: "Perfil T",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 175 },
      { id: "b", label: "b (ancho ala)", unit: "mm", default: 250 },
      { id: "t", label: "t (ala)", unit: "mm", default: 18 },
      { id: "s", label: "s (alma)", unit: "mm", default: 12 },
    ],
    calc(v) { return PROFILE_CALCULATORS.T(v); },
    svg(v) { return buildTSvg(v); },
  },
  CA: {
    name: "CA Profile", label: "CA", icon: "fa-solid fa-c", subtitle: "Canal Atiesado ICHA",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 280 },
      { id: "b", label: "b (ancho ala)", unit: "mm", default: 100 },
      { id: "c", label: "c (labio / pestaña)", unit: "mm", default: 35 },
      { id: "t", label: "t / e (espesor)", unit: "mm", default: 5 },
    ],
    calc(v) { return PROFILE_CALCULATORS.CA(v); },
    svg(v, g) { return buildCASvg(v, g); },
  },
  ICA: {
    name: "ICA Profile", label: "ICA", icon: "fa-solid fa-arrows-left-right-to-line", subtitle: "Doble Canal Atiesada",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 280 },
      { id: "b", label: "b (ancho total 2 alas)", unit: "mm", default: 200 },
      { id: "c", label: "c (labio)", unit: "mm", default: 35 },
      { id: "t", label: "t / e (espesor)", unit: "mm", default: 5 },
    ],
    calc(v) { return PROFILE_CALCULATORS.ICA(v); },
    svg(v, g) { return buildICASvg(v, g); },
  },
  C: {
    name: "C Profile", label: "C", icon: "fa-solid fa-c", subtitle: "Canal Estándar ICHA",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 250 },
      { id: "b", label: "b (ancho ala)", unit: "mm", default: 50 },
      { id: "t", label: "t / e (espesor)", unit: "mm", default: 6 },
    ],
    calc(v) { return PROFILE_CALCULATORS.C(v); },
    svg(v, g) { return buildCSvg(v, false, g); },
  },
  IC: {
    name: "IC Profile", label: "IC", icon: "fa-solid fa-arrows-left-right", subtitle: "Doble Canal ICHA",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 250 },
      { id: "b", label: "b (ancho total 2 alas)", unit: "mm", default: 100 },
      { id: "t", label: "t / e (espesor)", unit: "mm", default: 6 },
    ],
    calc(v) { return PROFILE_CALCULATORS.IC(v); },
    svg(v, g) { return buildICSvg(v, g); },
  },
  CE: {
    name: "CE Profile", label: "CE", icon: "fa-solid fa-c", subtitle: "Alas Desiguales",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 200 },
      { id: "b1", label: "b1 (ala sup.)", unit: "mm", default: 75 },
      { id: "b2", label: "b2 (ala inf.)", unit: "mm", default: 75 },
      { id: "t", label: "t (espesor)", unit: "mm", default: 6 },
    ],
    calc(v) { return PROFILE_CALCULATORS.CE(v); },
    svg(v) { return buildCSvg(v, true); },
  },
  L: {
    name: "L Profile", label: "L", icon: "fa-solid fa-l", subtitle: "Ángulo ICHA",
    inputs: [
      { id: "h", label: "h (ala mayor)", unit: "mm", default: 80 },
      { id: "b", label: "b (ala menor)", unit: "mm", default: 80 },
      { id: "t", label: "t / e (espesor)", unit: "mm", default: 6 },
    ],
    calc(v) { return PROFILE_CALCULATORS.L(v); },
    svg(v, g) { return buildLSvg(v, g); },
  },
  TL: {
    name: "TL Profile", label: "TL", icon: "fa-solid fa-cubes", subtitle: "Doble Ángulo T",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 100 },
      { id: "b", label: "b (ancho total 2 alas)", unit: "mm", default: 200 },
      { id: "t", label: "t / e (espesor)", unit: "mm", default: 8 },
    ],
    calc(v) { return PROFILE_CALCULATORS.TL(v); },
    svg(v, g) { return buildTLSvg(v, g); },
  },
  XL: {
    name: "XL Profile", label: "XL", icon: "fa-solid fa-xmark", subtitle: "Ángulo en Cruz",
    inputs: [
      { id: "h", label: "h (ala mayor)", unit: "mm", default: 200 },
      { id: "b", label: "b (ala menor)", unit: "mm", default: 150 },
      { id: "t", label: "t / e (espesor)", unit: "mm", default: 4 },
    ],
    calc(v) { return PROFILE_CALCULATORS.XL(v); },
    svg(v, g) { return buildXLSvg(v, g); },
  },
  PROF: {
    name: "Cajón / Tubo", label: "TUBULAR", icon: "fa-regular fa-square", subtitle: "Cajón ICHA",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 100 },
      { id: "b", label: "b (ancho)", unit: "mm", default: 100 },
      { id: "t", label: "t / e (espesor)", unit: "mm", default: 5 },
    ],
    calc(v) { return PROFILE_CALCULATORS.PROF(v); },
    svg(v) { return buildTubeSvg(v); },
  },
  PL: {
    name: "Plate", label: "PL", icon: "fa-solid fa-square", subtitle: "Plancha / Placa",
    inputs: [
      { id: "h", label: "h (largo placa)", unit: "mm", default: 100 },
      { id: "b", label: "b (ancho)", unit: "mm", default: 100 },
      { id: "t", label: "t (espesor)", unit: "mm", default: 10 },
    ],
    calc(v) { return PROFILE_CALCULATORS.PL(v); },
    svg(v) { return buildPlateSvg(v); },
  },
  PIPE: {
    name: "Piping", label: "PIPE", icon: "fa-solid fa-circle-notch", subtitle: "Tubo Circular",
    inputs: [
      { id: "dia", label: "Diámetro Ext.", unit: "mm", default: 152.4 },
      { id: "thick", label: "Espesor", unit: "mm", default: 7.11 },
    ],
    calc(v) { return PROFILE_CALCULATORS.PIPE(v); },
    svg(v) { return buildPipeSvg(v); },
  },
  RB: {
    name: "Round Bar", label: "RB", icon: "fa-solid fa-circle", subtitle: "Barra Redonda",
    inputs: [{ id: "dia", label: "Diámetro", unit: "mm", default: 40 }],
    calc(v) { return PROFILE_CALCULATORS.RB(v); },
    svg(v) { return buildRBSvg(v); },
  },
};

export default function ProfileCalculator() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [currentProfile, setCurrentProfile] = useState("H");
  const [inputValues, setInputValues] = useState({});
  const [list, setList] = useState([]);
  
  // ICHA Catalog Selection State
  const [selectedIchaKey, setSelectedIchaKey] = useState("");
  const [selectedIchaProfile, setSelectedIchaProfile] = useState(null);
  const [isCustomized, setIsCustomized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Quick adds
  const [quickMark, setQuickMark] = useState("");
  const [quickLen, setQuickLen] = useState(6);
  const [quickQty, setQuickQty] = useState(1);

  // Flattened ICHA profiles list for search
  const allIchaProfiles = useMemo(() => {
    const arr = [];
    Object.entries(ICHA_CATALOG).forEach(([sKey, sVal]) => {
      if (sVal.profiles) {
        sVal.profiles.forEach((p) => {
          arr.push({
            ...p,
            seriesKey: sKey,
            seriesName: sVal.name,
            fullLabel: `${p.designation} (${sVal.name})`
          });
        });
      }
    });
    return arr;
  }, []);

  // Filtered profiles for global quick search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase().trim();
    return allIchaProfiles
      .filter((p) => p.designation.toLowerCase().includes(q) || p.seriesKey.toLowerCase().includes(q) || p.seriesName.toLowerCase().includes(q))
      .slice(0, 10);
  }, [searchQuery, allIchaProfiles]);

  // ICHA series associated with the current profile
  const currentIchaSeriesKeys = useMemo(() => {
    return ICHA_SERIES_MAP[currentProfile] || [];
  }, [currentProfile]);

  // Available ICHA profiles for current profile family
  const availableIchaProfiles = useMemo(() => {
    const list = [];
    currentIchaSeriesKeys.forEach((sKey) => {
      const s = ICHA_CATALOG[sKey];
      if (s && s.profiles) {
        s.profiles.forEach((p) => {
          list.push({ ...p, seriesKey: sKey, seriesName: s.name });
        });
      }
    });
    return list;
  }, [currentIchaSeriesKeys]);

  // Initialize defaults on profile load
  useEffect(() => {
    const prof = PROFILES[currentProfile];
    if (prof) {
      const defaults = {};
      prof.inputs.forEach((inp) => {
        defaults[inp.id] = inp.default;
      });
      setInputValues(defaults);
      setSelectedIchaKey("");
      setSelectedIchaProfile(null);
      setIsCustomized(false);
    }
  }, [currentProfile]);

  // Sincronizar el largo predeterminado en metros (quickLen) cuando el perfil es PL
  useEffect(() => {
    if (currentProfile === "PL" && inputValues.h !== undefined) {
      setQuickLen(inputValues.h / 1000);
    } else if (currentProfile !== "PL") {
      setQuickLen(6);
    }
  }, [currentProfile, inputValues.h]);

  const handleInputChange = (id, val) => {
    setInputValues((prev) => ({ ...prev, [id]: parseFloat(val) || 0 }));
    if (selectedIchaProfile) {
      setIsCustomized(true);
    }
  };

  // Carga de perfil estándar ICHA
  const handleSelectIchaProfile = (designation) => {
    if (!designation) {
      setSelectedIchaKey("");
      setSelectedIchaProfile(null);
      setIsCustomized(false);
      return;
    }

    const p = availableIchaProfiles.find((item) => item.designation === designation) ||
              allIchaProfiles.find((item) => item.designation === designation);

    if (!p) return;

    setSelectedIchaKey(p.designation);
    setSelectedIchaProfile(p);
    setIsCustomized(false);

    // Mapear dimensiones según la serie
    const newVals = {};
    if (["HN", "IN", "IP", "PH"].includes(p.seriesKey)) {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.s = p.t_mm || 0; // alma
      newVals.t = p.e_mm || 0; // ala
    } else if (["L", "L_desig"].includes(p.seriesKey)) {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.t = p.e_mm || 0;
    } else if (p.seriesKey === "TL") {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.t = p.e_mm || 0;
    } else if (p.seriesKey === "XL") {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.t = p.e_mm || 0;
    } else if (p.seriesKey === "C") {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.t = p.e_mm || 0;
    } else if (p.seriesKey === "IC") {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.t = p.e_mm || 0;
    } else if (p.seriesKey === "CA") {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.c = p.C_mm || 0;
      newVals.t = p.e_mm || 0;
    } else if (p.seriesKey === "ICA") {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.c = p.C_mm || 0;
      newVals.t = p.e_mm || 0;
    } else if (p.seriesKey === "CAJON") {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.t = p.e_mm || 0;
    }

    setInputValues(newVals);
  };

  // Carga directa desde búsqueda global
  const handleSelectFromGlobalSearch = (p) => {
    let targetCategory = "H";
    if (["HN", "IN", "IP", "PH"].includes(p.seriesKey)) targetCategory = "H";
    else if (["L", "L_desig"].includes(p.seriesKey)) targetCategory = "L";
    else if (p.seriesKey === "TL") targetCategory = "TL";
    else if (p.seriesKey === "XL") targetCategory = "XL";
    else if (p.seriesKey === "C") targetCategory = "C";
    else if (p.seriesKey === "IC") targetCategory = "IC";
    else if (p.seriesKey === "CA") targetCategory = "CA";
    else if (p.seriesKey === "ICA") targetCategory = "ICA";
    else if (p.seriesKey === "CAJON") targetCategory = "PROF";

    setCurrentProfile(targetCategory);
    setSearchQuery("");
    setShowSearchResults(false);

    // Seleccionar el perfil en el siguiente tick
    setTimeout(() => {
      handleSelectIchaProfile(p.designation);
    }, 50);
  };

  const results = useMemo(() => {
    const p = PROFILES[currentProfile];
    if (!p) return null;
    try {
      const hasZero = Object.values(inputValues).some((v) => isNaN(v) || v < 0);
      if (hasZero) return { error: true };
      
      const r = p.calc(inputValues);
      const gramilVal = selectedIchaProfile?.gramil_mm || null;
      const svgHTML = p.svg(inputValues, gramilVal);

      let finalDesig = r.desig;
      if (selectedIchaProfile) {
        finalDesig = isCustomized ? `${selectedIchaProfile.designation} (Modificado)` : `${selectedIchaProfile.designation}`;
      }

      return { ...r, desig: finalDesig, svgHTML, error: false };
    } catch {
      return { error: true };
    }
  }, [currentProfile, inputValues, selectedIchaProfile, isCustomized]);

  // Perfil ICHA igual o similar detectado según dimensiones y propiedades calculadas
  const ichaMatch = useMemo(() => {
    if (!results || results.error) return null;

    const seriesKeys = ICHA_SERIES_MAP[currentProfile];
    if (!seriesKeys || seriesKeys.length === 0) return null;

    const candidates = [];
    seriesKeys.forEach((sKey) => {
      const s = ICHA_CATALOG[sKey];
      if (s && s.profiles) {
        s.profiles.forEach((p) => {
          candidates.push({ ...p, seriesKey: sKey, seriesName: s.name });
        });
      }
    });

    if (candidates.length === 0) return null;

    // Helper para extraer dimensiones homogéneas del perfil ICHA
    const getDims = (p) => ({
      h: p.H_mm || 0,
      b: p.B_mm || 0,
      t: p.e_mm || 0,
      s: p.t_mm !== undefined ? p.t_mm : (p.e_mm || 0),
      c: p.C_mm || 0,
    });

    let exact = null;
    const scored = [];

    const curH = inputValues.h || 0;
    const curB = inputValues.b !== undefined ? inputValues.b : (inputValues.b1 || 0);
    const curS = inputValues.s !== undefined ? inputValues.s : (inputValues.t || 0);
    const curT = inputValues.t !== undefined ? inputValues.t : (inputValues.t1 || 0);
    const curC = inputValues.c || 0;

    for (const p of candidates) {
      const d = getDims(p);
      let isExact = false;

      if (currentProfile === "H") {
        const matchH = Math.abs(d.h - curH) < 0.2;
        const matchB = Math.abs(d.b - curB) < 0.2;
        const matchS = Math.abs(d.s - curS) < 0.2;
        const matchT = Math.abs(d.t - curT) < 0.2;
        if (matchH && matchB && matchS && matchT) isExact = true;
      } else if (["C", "IC", "L", "TL", "XL", "PROF"].includes(currentProfile)) {
        const matchH = Math.abs(d.h - curH) < 0.2;
        const matchB = Math.abs(d.b - curB) < 0.2;
        const matchT = Math.abs(d.t - curT) < 0.2;
        if (matchH && matchB && matchT) isExact = true;
      } else if (["CA", "ICA"].includes(currentProfile)) {
        const matchH = Math.abs(d.h - curH) < 0.2;
        const matchB = Math.abs(d.b - curB) < 0.2;
        const matchC = Math.abs(d.c - curC) < 0.2;
        const matchT = Math.abs(d.t - curT) < 0.2;
        if (matchH && matchB && matchC && matchT) isExact = true;
      }

      if (isExact) {
        exact = p;
        break;
      }

      // Cálculo de discrepancia ponderada (dimensiones + peso + inercia + área)
      const diffH = Math.abs(d.h - curH) / Math.max(d.h, curH, 1);
      const diffB = Math.abs(d.b - curB) / Math.max(d.b, curB, 1);
      const diffT = Math.abs(d.t - curT) / Math.max(d.t, curT, 1);
      const diffS = currentProfile === "H" ? Math.abs(d.s - curS) / Math.max(d.s, curS, 1) : 0;
      const diffC = ["CA", "ICA"].includes(currentProfile) ? Math.abs(d.c - curC) / Math.max(d.c, curC, 1) : 0;

      const pWeight = p.weight || 1;
      const rWeight = results.weight || 1;
      const diffWeight = Math.abs(pWeight - rWeight) / Math.max(pWeight, rWeight, 1);

      const pArea = p["A_cm²"] || 1;
      const rArea = results.area || 1;
      const diffArea = Math.abs(pArea - rArea) / Math.max(pArea, rArea, 1);

      const pIx = p["Ix_cm⁴"] || 0;
      const rIx = results.Ix || 0;
      const diffIx = rIx > 0 && pIx > 0 ? Math.abs(pIx - rIx) / Math.max(pIx, rIx, 1) : 0;

      // Ponderación total
      const totalScore = (
        diffH * 30 +
        diffB * 25 +
        diffT * 15 +
        diffS * 10 +
        diffC * 10 +
        diffWeight * 15 +
        diffArea * 5 +
        diffIx * 10
      );

      // Similaridad estimada en %
      const similarityPct = Math.max(0, Math.min(100, Math.round((1 - (totalScore / 100)) * 100)));

      scored.push({
        profile: p,
        score: totalScore,
        similarityPct,
        dims: d,
      });
    }

    if (exact) {
      return {
        isExact: true,
        profile: exact,
        similarityPct: 100,
        dims: getDims(exact),
      };
    }

    scored.sort((a, b) => a.score - b.score);
    const best = scored[0];

    return {
      isExact: false,
      profile: best?.profile || null,
      similarityPct: best?.similarityPct || 0,
      dims: best?.dims || null,
      alternatives: scored.slice(1, 3).map((item) => ({
        profile: item.profile,
        similarityPct: item.similarityPct,
      })),
    };
  }, [currentProfile, inputValues, results]);

  const addToList = () => {
    if (!results || results.error) return;
    
    const isIcha = selectedIchaProfile && !isCustomized;
    const profileLabel = isIcha ? `${selectedIchaProfile.designation} [ICHA]` : results.desig;

    const newItem = {
      id: Date.now(),
      mark: quickMark || "-",
      qty: quickQty,
      profile: profileLabel,
      length: quickLen,
      weightUnit: results.weight,
      weightTotal: results.weight * quickLen * quickQty,
      isIcha: !!isIcha,
      ichaData: isIcha ? selectedIchaProfile : null
    };
    
    setList([...list, newItem]);
    setQuickMark("");
  };

  const deleteFromList = (id) => {
    setList(list.filter(item => item.id !== id));
  };

  const clearList = () => {
    setList([]);
  };

  const [extraPct, setExtraPct] = useState(5);

  const subtotalWeight = useMemo(() => list.reduce((acc, item) => acc + item.weightTotal, 0), [list]);
  const extraWeight = useMemo(() => subtotalWeight * (extraPct / 100), [subtotalWeight, extraPct]);
  const grandTotal = useMemo(() => subtotalWeight + extraWeight, [subtotalWeight, extraWeight]);

  // Export functions
  const exportToExcel = async () => {
    if (!list.length) return alert(isEn ? "No profiles in takeoff list." : "No hay perfiles en la lista de cubicación.");

    await ExportService.executeExport(new ExcelTakeoffStrategy(), {
      sheetName: isEn ? "Profiles Takeoff" : "Cubicación Perfiles",
      title: isEn ? "Steel Profiles Takeoff Summary" : "Resumen de Cubicación de Perfiles de Acero",
      subtitle: isEn ? "Structural Profiles Calculator & Official ICHA Catalog" : "Calculadora de Perfiles Estructurales & Catálogo ICHA Oficial",
      standardTag: isEn ? "STRUCTURAL CALCULATION · ICHA" : "CÁLCULO ESTRUCTURAL · ICHA",
      columns: [
        { header: isEn ? "Mark" : "Marca", key: "mark", width: 14, align: "center" },
        { header: isEn ? "Quantity" : "Cantidad", key: "qty", width: 12, align: "center", numFmt: '#,##0' },
        { header: isEn ? "Profile" : "Perfil", key: "profile", width: 28, align: "left" },
        { header: isEn ? "Length (m)" : "Largo (m)", key: "length", width: 15, align: "right", numFmt: '#,##0.00' },
        { header: isEn ? "Unit Weight (kg/m)" : "Peso Unit. (kg/m)", key: "weightUnit", width: 18, align: "right", numFmt: '#,##0.00' },
        { header: isEn ? "Total Weight (kg)" : "Peso Total (kg)", key: "weightTotal", width: 20, align: "right", numFmt: '#,##0.00' },
        { header: isEn ? "Standard / Source" : "Norma / Origen", key: "norm", width: 18, align: "center" },
      ],
      data: list.map((item) => ({
        mark: item.mark,
        qty: item.qty,
        profile: item.profile,
        length: item.length,
        weightUnit: item.weightUnit,
        weightTotal: item.weightTotal,
        norm: item.isIcha ? (isEn ? "Official ICHA" : "ICHA Oficial") : (isEn ? "Custom" : "Personalizado"),
      })),
      summary: {
        subtotal: subtotalWeight,
        extraPct: extraPct,
        extraWeight: extraWeight,
        grandTotal: grandTotal,
        tonTotal: grandTotal / 1000,
        unitLabel: "kg",
        tonUnitLabel: "Ton",
      },
      filename: isEn ? "steel_profiles_takeoff.xlsx" : "cubicacion_perfiles_acero.xlsx",
    });
  };

  const exportToPDF = async () => {
    if (!list.length) return alert(isEn ? "No profiles in takeoff list." : "No hay perfiles en la lista de cubicación.");

    await ExportService.executeExport(new PdfTakeoffStrategy(), {
      title: isEn ? "Steel Profiles Takeoff Summary" : "Resumen de Cubicación de Perfiles de Acero",
      subtitle: isEn ? "Structural Profiles Calculator & Official ICHA Catalog" : "Calculadora de Perfiles Estructurales & Catálogo ICHA Oficial",
      standardTag: isEn ? "STRUCTURAL CALCULATION · ICHA" : "CÁLCULO ESTRUCTURAL · ICHA",
      headers: [
        isEn ? "Mark" : "Marca",
        isEn ? "Qty" : "Cant.",
        isEn ? "Profile" : "Perfil",
        isEn ? "Length (m)" : "Largo (m)",
        isEn ? "Unit Wt (kg/m)" : "Peso Unit. (kg/m)",
        isEn ? "Total Wt (kg)" : "Peso Total (kg)",
        isEn ? "Standard" : "Norma"
      ],
      rows: list.map((item) => [
        item.mark,
        item.qty,
        item.profile,
        item.length.toFixed(2),
        item.weightUnit.toFixed(2),
        item.weightTotal.toFixed(2),
        item.isIcha ? "ICHA" : (isEn ? "Custom" : "Personalizado"),
      ]),
      summary: {
        subtotal: subtotalWeight,
        extraPct: extraPct,
        extraWeight: extraWeight,
        grandTotal: grandTotal,
        tonTotal: grandTotal / 1000,
        unitLabel: "kg",
        tonUnitLabel: "Ton",
      },
      columnAlignments: {
        0: "center",
        1: "center",
        2: "left",
        3: "right",
        4: "right",
        5: "right",
        6: "center",
      },
      filename: isEn ? "steel_profiles_takeoff.pdf" : "cubicacion_perfiles_acero.pdf",
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-bim-dark text-gray-900 dark:text-gray-300 font-sans min-h-screen pt-24 pb-12 transition-colors duration-300">
      <SEOHead
        title={
          isEn
            ? "Steel Profiles Geometric & Mechanical Properties Calculator"
            : "Calculadora de Propiedades Geométricas de Perfiles de Acero"
        }
        description={
          isEn
            ? "Calculate moment of inertia (Ix, Iy), section modulus (Wx, Wy), radius of gyration (ix, iy), and linear weight for steel I, H, Box, Pipe, and C profiles."
            : "Calcula momentos de inercia (Ix, Iy), módulos de sección (Wx, Wy), radios de giro (ix, iy) y peso lineal de perfiles paramétricos I, H, Cajón, Tubos y C de acero."
        }
        path="/herramientas/perfiles"
        keywords={
          isEn
            ? "Steel profile calculator, structural moments of inertia, section modulus, linear weight steel shapes, H beam, tubular profile"
            : "Calculadora de perfiles de acero, inercia perfiles estructurales, módulo resistente sección, peso por metro perfil metálico, perfil H, perfil tubular"
        }
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": isEn
            ? "Steel Profiles Properties Calculator"
            : "Calculadora de Propiedades Geométricas de Perfiles de Acero",
          "applicationCategory": "EngineeringApplication",
          "operatingSystem": "All",
          "url": "https://www.andresgallop.com/herramientas/perfiles",
          "description": isEn
            ? "Online engineering tool to calculate mechanical and geometric properties of parametric structural steel sections."
            : "Herramienta online para el cálculo de propiedades mecánicas y geométricas de perfiles de acero estructural paramétricos.",
          "inLanguage": isEn ? "en" : "es"
        }}
      />
      <div className="max-w-7xl mx-auto px-4 mb-6 flex items-center justify-between flex-wrap gap-3">
        <Link to="/herramientas" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm group">
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> {isEn ? "Back to Tools" : "Volver a Herramientas"}
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/herramientas/icha" className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm">
            <i className="fa-solid fa-book"></i> {isEn ? "Full ICHA Catalog" : "Catálogo ICHA Completo"}
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-700/50 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm">
            <i className="fa-solid fa-house"></i> {isEn ? "Home" : "Inicio"}
          </Link>
        </div>
      </div>

      {/* Title & Quick ICHA Search Header */}
      <div className="max-w-7xl mx-auto px-4 text-center mb-8">
        <h1 className="text-center text-4xl font-black mb-3 font-grotesk text-white">
          {isEn ? (
            <>Steel & <span className="text-transparent bg-clip-text bg-gradient-to-r from-bim-blue via-cyan-400 to-indigo-400">ICHA Profiles Calculator</span></>
          ) : (
            <>Calculadora de <span className="text-transparent bg-clip-text bg-gradient-to-r from-bim-blue via-cyan-400 to-indigo-400">Aceros & Perfiles ICHA</span></>
          )}
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto mb-6">
          {isEn
            ? "Compute parametric geometric properties or directly load any of the 660+ official Chilean ICHA steel profiles."
            : "Calcula propiedades de secciones geométricas libres o carga directamente cualquiera de los 660+ perfiles oficiales de la norma chilena ICHA."}
        </p>

        {/* Global ICHA Search Box */}
        <div className="max-w-xl mx-auto relative z-30">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"></i>
            <input
              type="text"
              placeholder="Buscar en Catálogo ICHA (ej: HN 30, IN 40x80, CA 150, L 100x10, IC 250)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full bg-slate-900/90 border border-slate-700 hover:border-cyan-500 focus:border-cyan-400 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none shadow-xl transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setShowSearchResults(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-2 py-1"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-left max-h-72 overflow-y-auto">
              <div className="p-2 text-[11px] font-bold text-cyan-400 bg-slate-950/80 border-b border-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Perfiles ICHA Encontrados</span>
                <span className="text-slate-500">{searchResults.length} resultados</span>
              </div>
              {searchResults.map((p) => (
                <button
                  key={`${p.seriesKey}-${p.designation}`}
                  onClick={() => handleSelectFromGlobalSearch(p)}
                  className="w-full px-4 py-2.5 hover:bg-cyan-950/40 border-b border-slate-800/40 flex items-center justify-between text-left transition-colors group"
                >
                  <div>
                    <span className="font-bold text-white group-hover:text-cyan-300 text-sm block">
                      {p.designation}
                    </span>
                    <span className="text-xs text-slate-400">
                      {p.seriesName} · {p.weight} kg/m · H:{p.H_mm}mm B:{p.B_mm}mm
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-slate-800 text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                    Cargar
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Category Selector Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-15 gap-2 mb-8">
          {Object.entries(PROFILES).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setCurrentProfile(key)}
              className={`rounded-xl p-2.5 flex flex-col items-center justify-center text-center transition-all bg-slate-900 border ${key === currentProfile ? 'border-bim-blue shadow-[0_0_15px_rgba(59,130,246,0.3)] bg-bim-blue/10 text-white' : 'border-slate-700/50 hover:bg-slate-800 text-slate-400'}`}
              title={p.name}
            >
              <i className={`${p.icon} text-base mb-1 ${key === currentProfile ? 'text-bim-blue' : 'text-gray-400'}`}></i>
              <span className={`text-xs font-bold ${key === currentProfile ? 'text-white' : 'text-gray-400'}`}>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Main Interface Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.75fr_1.15fr] gap-6">
          
          {/* SVG Diagram Center */}
          <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[380px] relative">
            <div className="w-full flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center">
                <i className="fa-solid fa-vector-square mr-2 text-bim-blue"></i> Sección Transversal
              </h3>
              {selectedIchaProfile && (
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${isCustomized ? 'bg-amber-950/60 text-amber-300 border-amber-800/80' : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/80'}`}>
                  <i className="fa-solid fa-certificate mr-1"></i>
                  {isCustomized ? 'Base ICHA (Modificado)' : 'Norma ICHA'}
                </span>
              )}
            </div>
            
            <div className="flex-1 flex items-center justify-center w-full drop-shadow-[0_0_8px_rgba(59,130,246,0.2)] my-2">
                <ProfileSectionViewer
                  svgHtml={results.svgHTML}
                  profileName={results.desig || "Perfil Personalizado"}
                  className="w-full h-full flex items-center justify-center"
                />
            </div>
            
            <div className="mt-2 text-center">
              <span className="text-2xl font-black text-white tracking-tight">
                {results && !results.error ? results.desig : "—"}
              </span>
              {selectedIchaProfile?.gramil_mm && (
                <div className="text-xs text-orange-400 font-semibold mt-1 flex items-center justify-center gap-1.5">
                  <i className="fa-solid fa-circle-dot text-[10px]"></i>
                  <span>Gramil estándar ICHA: <strong>g = {selectedIchaProfile.gramil_mm} mm</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Configuration Inputs & ICHA Catalog Selector */}
          <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 relative flex flex-col justify-between">
             <div>
               <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                    <i className="fa-solid fa-sliders mr-2 text-bim-blue"></i> Dimensiones
                 </h3>
                 {selectedIchaProfile && (
                   <button
                     onClick={() => handleSelectIchaProfile("")}
                     className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                     title="Volver a dimensiones por defecto"
                   >
                     <i className="fa-solid fa-rotate-left mr-1"></i> Reset
                   </button>
                 )}
               </div>

               {/* Dropdown Selector para Perfiles ICHA de esta familia */}
               {availableIchaProfiles.length > 0 && (
                 <div className="mb-5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                   <label className="text-xs font-bold text-cyan-400 mb-1.5 flex items-center justify-between">
                     <span><i className="fa-solid fa-book-bookmark mr-1"></i> Perfil Estándar ICHA ({availableIchaProfiles.length}):</span>
                   </label>
                   <select
                     value={selectedIchaKey}
                     onChange={(e) => handleSelectIchaProfile(e.target.value)}
                     className="w-full bg-slate-900 border border-slate-700 hover:border-cyan-500 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400"
                   >
                     <option value="">— Seleccionar del Catálogo ICHA —</option>
                     {availableIchaProfiles.map((p) => (
                       <option key={`${p.seriesKey}-${p.designation}`} value={p.designation}>
                         {p.designation} ({p.weight} kg/m)
                       </option>
                     ))}
                   </select>
                   {selectedIchaProfile && isCustomized && (
                     <p className="text-[11px] text-amber-400 mt-1.5">
                       <i className="fa-solid fa-triangle-exclamation mr-1"></i> Has modificado las dimensiones originales de la norma.
                     </p>
                   )}
                 </div>
               )}

               {/* Inputs de dimensiones numéricas */}
               <div className="space-y-3.5">
                  {PROFILES[currentProfile]?.inputs.map(inp => (
                    <div key={inp.id}>
                      <label className="text-xs font-semibold text-slate-400 mb-1 block">{inp.label}</label>
                      <div className="flex items-center gap-2">
                          <input 
                             type="number" step="any" min="0"
                             value={inputValues[inp.id] !== undefined ? inputValues[inp.id] : inp.default}
                             onChange={e => handleInputChange(inp.id, e.target.value)}
                             className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-base focus:outline-none focus:border-bim-blue" />
                          <span className="text-xs text-slate-500 w-8">{inp.unit}</span>
                      </div>
                    </div>
                  ))}
               </div>

               {results && results.error && (
                  <div className="mt-4 p-3 rounded-lg bg-rose-900/30 border border-rose-500/50 text-rose-400 text-sm font-medium">
                     Ingresa solo valores numéricos positivos.
                  </div>
               )}
             </div>

             <div className="text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span>Densidad acero: <strong>7,850 kg/m³</strong></span>
                <span>Unidades: <strong>SI (Métrico)</strong></span>
             </div>
          </div>

          {/* Results Panel & Technical Sheet */}
          <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                 <i className="fa-solid fa-calculator mr-2 text-bim-blue"></i> Propiedades de Sección
              </h3>
              
              <div className="space-y-3 mb-5">
                 <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 flex justify-between items-center transition-colors hover:border-bim-blue/50">
                    <span className="text-slate-400 text-sm font-bold">Área sección</span>
                    <span className="text-xl font-bold text-white">
                       {results && !results.error ? results.area.toFixed(2) : "0.00"} <span className="text-xs text-slate-500">cm²</span>
                    </span>
                 </div>
                 <div className="bg-bim-blue/10 border border-bim-blue/30 rounded-xl p-3.5 flex justify-between items-center transition-colors hover:border-bim-blue/70 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <span className="text-slate-300 text-sm font-bold">Peso Lineal</span>
                    <span className="text-xl font-bold text-bim-blue">
                       {results && !results.error ? results.weight.toFixed(2) : "0.00"} <span className="text-xs text-slate-400">kg/m</span>
                    </span>
                 </div>
                 <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 flex justify-between items-center transition-colors hover:border-bim-blue/50">
                    <span className="text-slate-400 text-sm font-bold">Área Cobertura</span>
                    <span className="text-xl font-bold text-white">
                       {results && !results.error ? results.cover.toFixed(3) : "0.000"} <span className="text-xs text-slate-500">m²/m</span>
                    </span>
                 </div>
              </div>

              {/* Ficha Técnica Oficial ICHA (si hay perfil ICHA activo) */}
              {selectedIchaProfile && (
                <div className="mb-5 p-4 rounded-xl bg-slate-950/80 border border-cyan-900/60 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-certificate"></i> Ficha Oficial: {selectedIchaProfile.designation}
                    </span>
                    <Link
                      to="/herramientas/icha"
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1"
                    >
                      Ver en catálogo <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Ix (cm⁴)</div>
                      <div className="font-bold text-white">{selectedIchaProfile["Ix_cm⁴"] || "—"}</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Iy (cm⁴)</div>
                      <div className="font-bold text-white">{selectedIchaProfile["Iy_cm⁴"] || "—"}</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Wx (cm³)</div>
                      <div className="font-bold text-white">{selectedIchaProfile["Wx_cm³"] || "—"}</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Wy (cm³)</div>
                      <div className="font-bold text-white">{selectedIchaProfile["Wy_cm³"] || "—"}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Indicador y Comparador de Perfil ICHA Igual o Similar */}
              {ichaMatch && ichaMatch.profile && (
                <div className={`mb-5 p-4 rounded-xl border transition-all ${
                  ichaMatch.isExact
                    ? "bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                    : "bg-gradient-to-br from-slate-950/90 to-blue-950/40 border-bim-blue/40 shadow-lg"
                }`}>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                        ichaMatch.isExact
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-bim-blue/20 text-bim-blue border-bim-blue/40"
                      }`}>
                        <i className={`fa-solid ${ichaMatch.isExact ? "fa-circle-check" : "fa-sliders"}`}></i>
                        {ichaMatch.isExact ? (isEn ? "Identical ICHA Profile" : "Perfil ICHA Idéntico") : (isEn ? "Closest ICHA Match" : "Perfil ICHA Más Similar")}
                      </span>
                      {!ichaMatch.isExact && (
                        <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                          ~{ichaMatch.similarityPct}% coincidencia
                        </span>
                      )}
                    </div>
                    <Link
                      to="/herramientas/icha"
                      className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                      title="Explorar en Catálogo ICHA"
                    >
                      <span>ICHA</span> <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div>
                      <div className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                        <span>{ichaMatch.profile.designation}</span>
                        <span className="text-xs font-normal text-slate-400">({ichaMatch.profile.seriesName || ichaMatch.profile.seriesKey})</span>
                      </div>
                      <div className="text-xs text-slate-300 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        <span>Peso: <strong className="text-white">{ichaMatch.profile.weight} kg/m</strong></span>
                        {ichaMatch.profile["A_cm²"] && <span>Área: <strong className="text-white">{ichaMatch.profile["A_cm²"]} cm²</strong></span>}
                        {ichaMatch.profile["Ix_cm⁴"] && <span>Ix: <strong className="text-white">{ichaMatch.profile["Ix_cm⁴"]} cm⁴</strong></span>}
                        {ichaMatch.profile.gramil_mm && <span>Gramil g: <strong className="text-orange-400">{ichaMatch.profile.gramil_mm} mm</strong></span>}
                      </div>
                    </div>

                    {selectedIchaKey !== ichaMatch.profile.designation && (
                      <button
                        type="button"
                        onClick={() => handleSelectIchaProfile(ichaMatch.profile.designation)}
                        className="shrink-0 text-xs font-bold px-3 py-2 rounded-lg bg-bim-blue hover:bg-blue-600 text-white transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-1.5"
                        title="Cargar dimensiones estándar de este perfil ICHA"
                      >
                        <i className="fa-solid fa-check-double"></i>
                        <span>{isEn ? "Apply ICHA" : "Aplicar ICHA"}</span>
                      </button>
                    )}
                  </div>

                  {/* Dimensiones comparadas del perfil ICHA */}
                  {ichaMatch.dims && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Cotas norma: <strong>h={ichaMatch.dims.h}</strong> · <strong>b={ichaMatch.dims.b}</strong> · <strong>e={ichaMatch.dims.t}</strong>{ichaMatch.dims.s !== ichaMatch.dims.t ? <> · <strong>t={ichaMatch.dims.s}</strong></> : null}{ichaMatch.dims.c ? <> · <strong>c={ichaMatch.dims.c}</strong></> : null} mm</span>
                      {ichaMatch.alternatives && ichaMatch.alternatives.length > 0 && (
                        <span className="text-[10px] text-slate-500">
                          Alt: {ichaMatch.alternatives.map(a => a.profile.designation).join(", ")}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick List Addition */}
            <div className="border-t border-slate-800 pt-4">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                 {isEn ? "Add to Takeoff" : "Agregar a Cubicación"}
               </h4>
               <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={isEn ? "Mark (e.g. B-1)" : "Marca (ej. V-1)"}
                    value={quickMark}
                    onChange={e=>setQuickMark(e.target.value)}
                    className="w-1/3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                  <div className="relative w-1/3">
                    <input
                      type="number"
                      step="0.1"
                      title={isEn ? "Length" : "Largo"}
                      value={quickLen}
                      onChange={e=>setQuickLen(parseFloat(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white text-center"
                    />
                    <span className="absolute right-2 top-2.5 text-[10px] text-slate-500">m</span>
                  </div>
                  <div className="relative w-1/3">
                    <input
                      type="number"
                      step="1"
                      title={isEn ? "Quantity" : "Cantidad"}
                      value={quickQty}
                      onChange={e=>setQuickQty(parseFloat(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white text-center"
                    />
                    <span className="absolute right-2 top-2.5 text-[10px] text-slate-500">{isEn ? "pcs" : "un"}</span>
                  </div>
               </div>
               <button 
                 onClick={addToList}
                 disabled={!results || results.error}
                 className="w-full mt-3 bg-bim-blue hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                 <i className="fa-solid fa-plus mr-2"></i> {isEn ? "Add to Takeoff Table" : "Añadir a Tabla de Cubicación"}
               </button>
            </div>
          </div>
        </div>

        {/* List Section */}
        {list.length > 0 && (
          <div className="mt-8 bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4 flex-wrap gap-3">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                 <i className="fa-solid fa-list-check mr-2 text-bim-blue"></i>
                 {isEn ? `Steel Profiles Takeoff Summary (${list.length})` : `Resumen de Cubicación de Perfiles (${list.length})`}
              </h3>
              <div className="flex gap-2">
                  <button onClick={exportToExcel} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow hover:shadow-emerald-500/20 flex items-center gap-1.5">
                     <i className="fa-solid fa-file-excel"></i> {isEn ? "Export Excel (.xlsx)" : "Exportar Excel (.xlsx)"}
                  </button>
                  <button onClick={exportToPDF} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow hover:shadow-rose-500/20 flex items-center gap-1.5">
                     <i className="fa-solid fa-file-pdf"></i> PDF
                  </button>
                  <button onClick={clearList} className="bg-slate-800 hover:bg-slate-700 text-rose-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                     {isEn ? "Clear All" : "Limpiar Todo"}
                  </button>
              </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-slate-300 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase">
                      <th className="py-3 px-4">{isEn ? "Mark" : "Marca"}</th>
                      <th className="py-3 px-4 text-center">{isEn ? "Qty" : "Cant."}</th>
                      <th className="py-3 px-4">{isEn ? "Profile" : "Perfil"}</th>
                      <th className="py-3 px-4 text-right">{isEn ? "Length" : "Largo"} <span className="normal-case">(m)</span></th>
                      <th className="py-3 px-4 text-right">{isEn ? "Unit Wt" : "Peso Unit."} <span className="normal-case">(kg/m)</span></th>
                      <th className="py-3 px-4 text-right">{isEn ? "Total Wt" : "Peso Total"} <span className="normal-case">(kg)</span></th>
                      <th className="py-3 px-4 text-center">{isEn ? "Standard" : "Norma"}</th>
                      <th className="py-3 px-4 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {list.map(item => (
                       <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-white">{item.mark}</td>
                          <td className="py-3 px-4 text-center font-mono">{item.qty}</td>
                          <td className="py-3 px-4 font-semibold text-cyan-300">{item.profile}</td>
                          <td className="py-3 px-4 text-right font-mono">{item.length.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-mono">{item.weightUnit.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-bold text-white font-mono text-base">{item.weightTotal.toFixed(2)}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.isIcha ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                              {item.isIcha ? 'ICHA' : (isEn ? 'Custom' : 'Personalizado')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                             <button
                               onClick={() => deleteFromList(item.id)}
                               className="text-slate-500 hover:text-rose-400 transition-colors"
                               title={isEn ? "Delete row" : "Eliminar fila"}
                             >
                               <i className="fa-solid fa-trash-can"></i>
                             </button>
                          </td>
                       </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-700 bg-slate-800/10">
                      <td colSpan="5" className="py-2.5 px-4 text-right font-medium text-slate-400">
                         {isEn ? "Structural Weight Subtotal" : "Subtotal Peso Estructural"}
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-white font-mono">
                         {subtotalWeight.toFixed(2)} <span className="text-xs font-normal text-slate-500">kg</span>
                      </td>
                      <td colSpan="2"></td>
                    </tr>
                    <tr className="border-t border-slate-800 bg-slate-800/20">
                      <td colSpan="5" className="py-2.5 px-4 text-right">
                         <div className="flex items-center justify-end gap-2 text-slate-400">
                            <span className="font-medium text-xs">
                              {isEn ? "Connections / Scrap Margin:" : "Margen Conexiones / Despunte:"}
                            </span>
                            <input
                              type="number"
                              min="0"
                              max="50"
                              step="0.5"
                              value={extraPct}
                              onChange={(e) => setExtraPct(parseFloat(e.target.value) || 0)}
                              className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white text-center font-mono focus:border-cyan-400 focus:outline-none"
                            />
                            <span className="text-xs font-bold text-cyan-400">%</span>
                         </div>
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-cyan-300 font-mono">
                         +{extraWeight.toFixed(2)} <span className="text-xs font-normal text-slate-500">kg</span>
                      </td>
                      <td colSpan="2"></td>
                    </tr>
                    <tr className="border-t-2 border-slate-700 bg-slate-900/80">
                      <td colSpan="5" className="py-4 px-4 text-right font-black text-emerald-400 uppercase">
                         {isEn ? "Estimated Total Weight" : "Peso Total Estimado"}
                      </td>
                      <td className="py-4 px-4 text-right font-black text-emerald-400 text-xl font-mono">
                         {grandTotal.toFixed(2)} <span className="text-xs font-normal text-slate-400">kg</span>
                         <span className="block text-xs text-slate-400 font-semibold font-mono">({(grandTotal / 1000).toFixed(3)} Ton)</span>
                      </td>
                      <td colSpan="2"></td>
                    </tr>
                  </tfoot>
               </table>
            </div>
          </div>
        )}

      </div>

      {/* Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <Link to="/herramientas" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors group">
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          {isEn ? "Back to Tools" : "Volver a Herramientas"}
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span>Instituto Chileno del Acero (ICHA)</span>
          <span>·</span>
          <span>NCh427 / ASTM</span>
        </div>
      </div>
    </div>
  );
}
