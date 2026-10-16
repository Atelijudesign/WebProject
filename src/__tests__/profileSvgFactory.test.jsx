import { describe, it, expect } from "vitest";
import {
  buildHSvg,
  buildTSvg,
  buildCSvg,
  buildCASvg,
  buildICASvg,
  buildICSvg,
  buildLSvg,
  buildTLSvg,
  buildXLSvg,
  buildTubeSvg,
  buildPipeSvg,
  buildPlateSvg,
  buildRBSvg,
  buildIchaProfileSvg,
  buildAiscProfileSvg,
  dimLine,
} from "../components/svg/ProfileSvgFactory";

describe("ProfileSvgFactory - Generación Unificada de Secciones Estructurales (Fase 1)", () => {
  it("debe generar líneas de cota con formato SVG y etiquetas legibles", () => {
    const svgDim = dimLine(0, 0, 100, 0, "b=100", 15);
    expect(svgDim).toContain("<line");
    expect(svgDim).toContain("b=100");
    expect(svgDim).toContain('stroke="#60a5fa"');
  });

  it("debe generar geometría SVG para perfiles H / W con y sin gramil", () => {
    const svgH = buildHSvg({ h: 200, b: 100, s: 6, t1: 10, gramil: 55 });
    expect(svgH).toContain("<svg");
    expect(svgH).toContain("<polygon");
    expect(svgH).toContain("h=200");
    expect(svgH).toContain("b=100");
    expect(svgH).toContain("g=55");
  });

  it("debe despachar correctamente perfiles del catálogo chileno ICHA", () => {
    const perfilHn = { H_mm: 300, B_mm: 150, e_mm: 12, t_mm: 8, gramil_mm: 80 };
    const svgIcha = buildIchaProfileSvg(perfilHn, "HN");
    expect(svgIcha).toContain("<svg");
    expect(svgIcha).toContain("h=300");
    expect(svgIcha).toContain("b=150");

    const perfilL = { H_mm: 100, B_mm: 100, e_mm: 8 };
    const svgL = buildIchaProfileSvg(perfilL, "L");
    expect(svgL).toContain("<svg");
    expect(svgL).toContain("h=100");

    const perfilCajon = { H_mm: 150, B_mm: 100, e_mm: 5 };
    const svgCajon = buildIchaProfileSvg(perfilCajon, "CAJON");
    expect(svgCajon).toContain("<rect");
  });

  it("debe despachar perfiles del catálogo norteamericano AISC en sistema métrico e imperial", () => {
    const perfilWMetric = {
      type: "W",
      AISC_Manual_Label: "W14X90",
      d_mm: 356,
      bf_mm: 368,
      tw_mm: 11.2,
      tf_mm: 18.0,
    };
    const svgMetric = buildAiscProfileSvg(perfilWMetric, "metric");
    expect(svgMetric).toContain("d=356 mm");
    expect(svgMetric).toContain("bf=368 mm");

    const perfilWImperial = {
      type: "W",
      AISC_Manual_Label: "W14X90",
      d_in: 14.0,
      bf_in: 14.5,
      tw_in: 0.44,
      tf_in: 0.71,
    };
    const svgImperial = buildAiscProfileSvg(perfilWImperial, "imperial");
    expect(svgImperial).toContain('d=14"');
    expect(svgImperial).toContain('bf=14.5"');
  });

  it("debe generar geometrías especializadas: tubulares, cañerías y dobles canales", () => {
    const svgPipe = buildPipeSvg({ dia: 114.3, thick: 6.02 });
    expect(svgPipe).toContain("<circle");
    expect(svgPipe).toContain("Ø=114.3");

    const svgDoubleChannel = buildICSvg({ h: 250, b: 100, t: 6 });
    expect(svgDoubleChannel).toContain("<polygon");

    const svgStarAngle = buildXLSvg({ h: 200, b: 150, t: 4 });
    expect(svgStarAngle).toContain("<polygon");
  });
});
