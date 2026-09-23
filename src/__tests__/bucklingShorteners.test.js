import { describe, it, expect } from "vitest";

function calculateBucklingShorteners({ activeB, activeE, activeR = 10, d = 0, L = 3000 }) {
  const AL = (activeE * (2 * activeB - activeE) + 0.2146 * (Math.pow(activeR, 2) - 2 * Math.pow(activeR / 2, 2))) / 100;
  const xL = (6 * activeE * (activeB * (activeB + activeE) - Math.pow(activeE, 2)) + Math.pow(activeR / 2, 2) * (1.1504 * (activeR / 2) - 2.5752 * (activeB + activeE)) + Math.pow(activeR, 2) * (2.5752 * activeE + 0.5752 * activeR)) / (12 * AL * 1000);
  const ivL = (0.197 * activeB) / 10;
  const IvL = Math.pow(ivL, 2) * AL;

  const AXL = 2 * AL;
  const IuXL = 2 * (IvL + AL * Math.pow(1.414 * (xL + d / 20), 2));
  const iuXL = Math.sqrt(IuXL / AXL);

  if (!iuXL || !isFinite(iuXL)) {
    return { AL, xL, ivL, IvL, IuXL, iuXL: 0, lmax: 0, nmin: 0 };
  }

  const lmax = (0.75 * ivL * L) / iuXL;
  const innerTerm = 1 + Math.ceil((L - 1200) / lmax);
  let nmin = innerTerm;
  if (nmin < 2) nmin = 2;
  if (nmin % 2 === 0) nmin += 1;

  return { AL, xL, ivL, IvL, IuXL, iuXL, lmax, nmin };
}

describe("Buckling Shorteners Calculations", () => {
  it("should calculate correct cross-section area for L 80x80x6", () => {
    const res = calculateBucklingShorteners({ activeB: 80, activeE: 6, activeR: 10, d: 0, L: 3000 });

    expect(res.AL).toBeGreaterThan(9); // ~9.38 cm2
    expect(res.ivL).toBeCloseTo(1.576, 1);
    expect(res.iuXL).toBeGreaterThan(0);
    expect(res.nmin).toBeGreaterThanOrEqual(2);
    expect(res.nmin % 2).toBe(1); // Must be odd
  });

  it("should return odd number of minimum shorteners for any length", () => {
    const resShort = calculateBucklingShorteners({ activeB: 80, activeE: 6, activeR: 10, d: 10, L: 1500 });
    const resLong = calculateBucklingShorteners({ activeB: 100, activeE: 10, activeR: 12, d: 20, L: 6000 });

    expect(resShort.nmin % 2).toBe(1);
    expect(resLong.nmin % 2).toBe(1);
    expect(resLong.nmin).toBeGreaterThanOrEqual(resShort.nmin);
  });
});
