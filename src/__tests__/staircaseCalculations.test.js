import { describe, it, expect } from "vitest";
import { calculateStaircase } from "../utils/staircaseCalculations";

describe("Staircase Calculations & Ergonomics", () => {
  it("should calculate correct staircase steps and riser for 2800mm total height", () => {
    const res = calculateStaircase(2800, 280, 175);

    // 2800 / 175 = 16 steps
    expect(res.stepCount).toBe(16);
    expect(res.calculatedRiser).toBe(175);
    expect(res.totalRun).toBe(15 * 280); // (16-1)*280 = 4200mm
  });

  it("should evaluate Blondel's Ergonomic Rule (2R + T)", () => {
    // 2 * 175 + 280 = 630mm -> Compliant (600-640mm range)
    const resCompliant = calculateStaircase(2800, 280, 175);
    expect(resCompliant.blondelValue).toBe(630);
    expect(resCompliant.isBlondelCompliant).toBe(true);

    // Non-compliant case: small tread and small riser
    const resNonCompliant = calculateStaircase(3000, 200, 120);
    expect(resNonCompliant.isBlondelCompliant).toBe(false);
  });

  it("should calculate valid inclination angle", () => {
    const res = calculateStaircase(2800, 280, 175);
    // tan(angle) = 175 / 280 = 0.625 -> angle ~ 32.01 degrees
    expect(res.angleDeg).toBeGreaterThan(30);
    expect(res.angleDeg).toBeLessThan(35);
  });

  it("should throw error for invalid zero or negative inputs", () => {
    expect(() => calculateStaircase(0, 280)).toThrow();
    expect(() => calculateStaircase(2800, 0)).toThrow();
    expect(() => calculateStaircase(-1000, 280)).toThrow();
  });
});
