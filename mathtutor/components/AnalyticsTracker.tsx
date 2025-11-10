"use client";

import { usePageTracking } from "@/lib/hooks/usePageTracking";

/**
 * AnalyticsTracker - Client-side component for tracking page views
 *
 * This is a simple wrapper component that initializes page view tracking
 * for all authenticated users in the application.
 *
 * @returns null (invisible component, just for side effects)
 */
export function AnalyticsTracker() {
  usePageTracking();
  return null;
}
