export const CV_ANALYTICS_KEY = "cvats.builder.analytics.v2";
export const CV_ANALYTICS_CONSENT_KEY = "cvats.builder.analytics-consent.v2";

export function readAnalyticsConsent() {
  if (typeof window === "undefined") return "unknown";
  return window.localStorage.getItem(CV_ANALYTICS_CONSENT_KEY) || "unknown";
}

export function setAnalyticsConsent(value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CV_ANALYTICS_CONSENT_KEY, value);
  if (value !== "accepted") window.localStorage.removeItem(CV_ANALYTICS_KEY);
}

export function readLocalAnalytics() {
  if (typeof window === "undefined") return { version: 1, events: {} };
  try {
    const saved = JSON.parse(window.localStorage.getItem(CV_ANALYTICS_KEY) || "null");
    return saved?.events ? saved : { version: 1, events: {} };
  } catch {
    return { version: 1, events: {} };
  }
}

export function trackLocalEvent(name) {
  if (typeof window === "undefined" || readAnalyticsConsent() !== "accepted") return false;
  const analytics = readLocalAnalytics();
  analytics.events[name] = { count: (analytics.events[name]?.count || 0) + 1, lastAt: new Date().toISOString() };
  window.localStorage.setItem(CV_ANALYTICS_KEY, JSON.stringify(analytics));
  return true;
}

export function clearLocalAnalytics() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CV_ANALYTICS_KEY);
  window.localStorage.removeItem(CV_ANALYTICS_CONSENT_KEY);
}
