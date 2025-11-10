import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

/**
 * usePageTracking - Track page views for analytics
 *
 * Tracks when users visit different pages and sends analytics data to the backend.
 * Only tracks authenticated users (Clerk).
 *
 * @returns void
 */
export function usePageTracking() {
  const pathname = usePathname();
  const { userId, isLoaded } = useAuth();
  const pageStartTimeRef = useRef<number>(Date.now());
  const lastPathnameRef = useRef<string>("");

  useEffect(() => {
    if (!isLoaded || !userId) {
      return;
    }

    // Skip tracking if pathname hasn't changed
    if (lastPathnameRef.current === pathname) {
      return;
    }

    // Track previous page duration if it exists
    if (lastPathnameRef.current) {
      const sessionDuration = Date.now() - pageStartTimeRef.current;
      trackPageView(lastPathnameRef.current, sessionDuration);
    }

    // Reset timer for new page
    pageStartTimeRef.current = Date.now();
    lastPathnameRef.current = pathname;
  }, [pathname, userId, isLoaded]);

  // Track page when component unmounts or user logs out
  useEffect(() => {
    return () => {
      if (userId && lastPathnameRef.current) {
        const sessionDuration = Date.now() - pageStartTimeRef.current;
        trackPageView(lastPathnameRef.current, sessionDuration);
      }
    };
  }, [userId]);
}

/**
 * Track a single page view
 *
 * @param page - The page pathname
 * @param sessionDuration - How long the user spent on the page (ms)
 */
async function trackPageView(page: string, sessionDuration: number) {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page,
        sessionDuration,
      }),
    });
  } catch (error) {
    // Silently fail - don't disrupt user experience
    console.debug("[Analytics] Failed to track page view:", error);
  }
}
