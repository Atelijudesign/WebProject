import { beforeEach, describe, expect, it } from "vitest";
import {
  CV_ANALYTICS_CONSENT_KEY, CV_ANALYTICS_KEY, clearLocalAnalytics, readAnalyticsConsent,
  readLocalAnalytics, setAnalyticsConsent, trackLocalEvent,
} from "../utils/cvTelemetry";

describe("CV local analytics", () => {
  beforeEach(() => window.localStorage.clear());

  it("no registra eventos sin consentimiento", () => {
    expect(trackLocalEvent("pdf_exported")).toBe(false);
    expect(window.localStorage.getItem(CV_ANALYTICS_KEY)).toBeNull();
  });

  it("cuenta solo nombres de eventos cuando existe consentimiento", () => {
    setAnalyticsConsent("accepted");
    expect(trackLocalEvent("cv_started")).toBe(true);
    expect(trackLocalEvent("cv_started")).toBe(true);
    expect(readLocalAnalytics().events.cv_started.count).toBe(2);
  });

  it("elimina métricas y consentimiento local", () => {
    setAnalyticsConsent("accepted");
    trackLocalEvent("cv_completed");
    clearLocalAnalytics();
    expect(readAnalyticsConsent()).toBe("unknown");
    expect(window.localStorage.getItem(CV_ANALYTICS_CONSENT_KEY)).toBeNull();
    expect(window.localStorage.getItem(CV_ANALYTICS_KEY)).toBeNull();
  });
});
