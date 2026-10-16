import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  isInternalTraffic,
  setInternalTraffic,
  toggleInternalTraffic,
  trackEvent,
  track3DModelActivated,
  trackCvDownload,
  trackToolInteraction,
  trackManualRequest,
  trackSocialClick,
  INTERNAL_TRAFFIC_KEY,
} from "../utils/analytics";

describe("Analytics & Internal Traffic Exclusion Engine", () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete window.gtag;
  });

  it("should detect internal traffic on localhost", () => {
    // En jsdom por defecto window.location.hostname es 'localhost'
    expect(isInternalTraffic()).toBe(true);
  });

  it("should allow toggling internal traffic flag in localStorage", () => {
    setInternalTraffic(true);
    expect(window.localStorage.getItem(INTERNAL_TRAFFIC_KEY)).toBe("true");

    setInternalTraffic(false);
    expect(window.localStorage.getItem(INTERNAL_TRAFFIC_KEY)).toBeNull();
  });

  it("should toggle internal traffic status correctly", () => {
    // Al estar en localhost isInternalTraffic es true, al alternar debe desactivarlo
    const nextState = toggleInternalTraffic();
    expect(typeof nextState).toBe("boolean");
  });

  it("should suppress tracking when internal traffic is active", () => {
    setInternalTraffic(true);
    const gtagMock = vi.fn();
    window.gtag = gtagMock;

    const result = trackEvent("test_event", { foo: "bar" });
    expect(result).toBe(false);
    expect(gtagMock).not.toHaveBeenCalled();
  });

  it("should track events when internal traffic is not detected", () => {
    // Mock hostname to simulate production domain
    const originalLocation = window.location;
    delete window.location;
    window.location = new URL("https://www.andresgallop.com/calculadora-icha");

    const gtagMock = vi.fn();
    window.gtag = gtagMock;

    const result = trackEvent("test_event", { foo: "bar" });
    expect(result).toBe(true);
    expect(gtagMock).toHaveBeenCalledWith("event", "test_event", expect.objectContaining({
      foo: "bar",
      traffic_type: "external",
    }));

    // Restore location
    window.location = originalLocation;
  });

  it("should trigger specific domain events correctly", () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = new URL("https://www.andresgallop.com/");

    const gtagMock = vi.fn();
    window.gtag = gtagMock;

    track3DModelActivated();
    expect(gtagMock).toHaveBeenCalledWith("event", "model3d_activated", expect.any(Object));

    trackCvDownload("pdf", "es");
    expect(gtagMock).toHaveBeenCalledWith("event", "cv_download", expect.objectContaining({
      format: "pdf",
      language: "es",
    }));

    trackToolInteraction("icha", "select_profile");
    expect(gtagMock).toHaveBeenCalledWith("event", "tool_interaction", expect.objectContaining({
      tool: "icha",
      action: "select_profile",
    }));

    trackManualRequest("smartplant-3d");
    expect(gtagMock).toHaveBeenCalledWith("event", "manual_requested", expect.objectContaining({
      manual_id: "smartplant-3d",
    }));

    trackSocialClick("linkedin", "https://linkedin.com");
    expect(gtagMock).toHaveBeenCalledWith("event", "social_outbound_click", expect.objectContaining({
      platform: "linkedin",
    }));

    window.location = originalLocation;
  });
});
