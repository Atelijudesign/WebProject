import { describe, it, expect } from "vitest";
import {
  calcH,
  calcHE,
  calcT,
  calcCA,
  calcC,
  calcCE,
  calcXL,
  calcL,
  calcPL,
  calcPipe,
  calcTube,
  calcRB,
  PROFILE_CALCULATORS,
} from "../utils/profileCalculations";

describe("Profile Calculations Engine", () => {
  describe("H Profile Calculator", () => {
    it("should calculate correct properties for a standard H 200x100x6x12 profile", () => {
      const input = { h: 200, b: 100, s: 6, t: 12 };
      const res = calcH(input);

      // Area = (100*12 + 100*12 + (200 - 24)*6) / 100 = (1200 + 1200 + 1056) / 100 = 34.56 cm2
      expect(res.area).toBeCloseTo(34.56, 2);

      // Weight = 34.56 * 0.00785 * 100 = 27.13 kg/m
      expect(res.weight).toBeCloseTo(27.13, 1);

      // Designation string
      expect(res.desig).toContain("H 20 ×");

      // Inertia moments should be positive numbers
      expect(res.Ix).toBeGreaterThan(0);
      expect(res.Iy).toBeGreaterThan(0);
      expect(res.Wx).toBeGreaterThan(0);
      expect(res.Wy).toBeGreaterThan(0);

      // Ix should be greater than Iy for an H section oriented vertically
      expect(res.Ix).toBeGreaterThan(res.Iy);
    });
  });

  describe("HE Profile Calculator (Unequal Flanges)", () => {
    it("should calculate properties for HE section with unequal flanges", () => {
      const input = { h: 250, b1: 200, b2: 150, t1: 14, t2: 12, s: 6 };
      const res = calcHE(input);

      expect(res.area).toBeGreaterThan(0);
      expect(res.weight).toBeGreaterThan(0);
      expect(res.Ix).toBeGreaterThan(0);
      expect(res.Iy).toBeGreaterThan(0);
      expect(res.desig).toContain("HE 25 ×");
    });
  });

  describe("T Profile Calculator", () => {
    it("should calculate properties for T section", () => {
      const input = { h: 175, b: 250, t: 18, s: 12 };
      const res = calcT(input);

      expect(res.area).toBeGreaterThan(0);
      expect(res.weight).toBeGreaterThan(0);
      expect(res.Ix).toBeGreaterThan(0);
      expect(res.Iy).toBeGreaterThan(0);
      expect(res.desig).toContain("T 17.5 ×");
    });
  });

  describe("CA Profile Calculator (Stiffened Channel)", () => {
    it("should calculate properties for CA section with lip", () => {
      const input = { h: 280, b: 100, c: 35, t: 5 };
      const res = calcCA(input);

      expect(res.area).toBeGreaterThan(0);
      expect(res.weight).toBeGreaterThan(0);
      expect(res.desig).toContain("CA 28 ×");
    });
  });

  describe("C & CE Profile Calculators", () => {
    it("should calculate standard C channel properties", () => {
      const res = calcC({ h: 250, b: 50, t: 6 });
      expect(res.area).toBeGreaterThan(0);
      expect(res.desig).toContain("C 25 ×");
    });

    it("should calculate unequal flange CE channel properties", () => {
      const res = calcCE({ h: 200, b1: 75, b2: 75, t: 6 });
      expect(res.area).toBeGreaterThan(0);
      expect(res.desig).toContain("CE 20 ×");
    });
  });

  describe("Angle Profiles (L & XL)", () => {
    it("should calculate single L angle section", () => {
      const res = calcL({ h: 80, b: 80, t: 6 });
      expect(res.area).toBeGreaterThan(0);
      expect(res.desig).toContain("L 8 ×");
    });

    it("should calculate double angle XL section", () => {
      const resXL = calcXL({ h: 200, b: 150, t: 4 });
      const resL = calcL({ h: 200, b: 150, t: 4 });

      // Double angle area should be approximately double a single angle area
      expect(resXL.area).toBeCloseTo(resL.area * 2, 1);
    });
  });

  describe("Plates, Pipes & Tubes", () => {
    it("should calculate steel plate properties", () => {
      const res = calcPL({ h: 100, b: 100, t: 10 });
      // Area = 100 * 10 / 100 = 10 cm2
      expect(res.area).toBe(10);
      expect(res.desig).toBe("PL 100 × 100 × 10");
    });

    it("should calculate circular pipe properties", () => {
      const res = calcPipe({ dia: 152.4, thick: 7.11 });
      expect(res.area).toBeGreaterThan(0);
      expect(res.desig).toContain("PIPE Ø152.4 × 7.11");
    });

    it("should calculate hollow rectangular tube properties", () => {
      const res = calcTube({ h: 100, b: 100, t: 5 });
      expect(res.area).toBeGreaterThan(0);
      expect(res.desig).toContain("CJ 10 ×");
    });

    it("should calculate round bar properties", () => {
      const res = calcRB({ dia: 40 });
      expect(res.area).toBeGreaterThan(0);
      expect(res.desig).toBe("ARMADURA Ø40");
    });
  });

  describe("PROFILE_CALCULATORS Map Integrity", () => {
    it("should contain all 12 profile calculator types", () => {
      const keys = ["H", "HE", "T", "CA", "C", "CE", "XL", "L", "PL", "PIPE", "PROF", "RB"];
      keys.forEach((key) => {
        expect(PROFILE_CALCULATORS).toHaveProperty(key);
        expect(typeof PROFILE_CALCULATORS[key]).toBe("function");
      });
    });
  });
});
