import { describe, it, expect } from "vitest";
import { ICHA_CATALOG } from "../data/icha_data";

describe("ICHA Chilean Steel Profiles Database", () => {
  it("should contain a valid ICHA catalog object", () => {
    expect(ICHA_CATALOG).toBeDefined();
    expect(typeof ICHA_CATALOG).toBe("object");
  });

  it("should contain standard profile families (L, H, C, etc.)", () => {
    const families = Object.keys(ICHA_CATALOG);
    expect(families.length).toBeGreaterThan(0);

    // Every family should have a name and a non-empty profiles array
    families.forEach((key) => {
      const family = ICHA_CATALOG[key];
      expect(family).toHaveProperty("name");
      expect(family).toHaveProperty("profiles");
      expect(Array.isArray(family.profiles)).toBe(true);
      expect(family.profiles.length).toBeGreaterThan(0);
    });
  });

  it("should verify profile objects have valid structural engineering attributes", () => {
    const firstFamilyKey = Object.keys(ICHA_CATALOG)[0];
    const sampleProfile = ICHA_CATALOG[firstFamilyKey].profiles[0];

    expect(sampleProfile).toHaveProperty("designation");
    expect(sampleProfile).toHaveProperty("weight");
    expect(sampleProfile.weight).toBeGreaterThan(0);
  });
});
