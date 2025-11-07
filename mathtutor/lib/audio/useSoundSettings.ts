"use client";

/**
 * useSoundSettings Hook
 *
 * React hook for managing sound preferences.
 * Persists setting to localStorage under key 'math-tutor:sounds'
 * Default: sounds enabled
 */

import { useState, useEffect } from "react";
import {
  playSuccessSound,
  playErrorSound,
  playWarningSound,
  playCelebrationSound,
} from "./sounds";
import { isSoundSupported } from "./audioContext";

interface UseSoundSettingsReturn {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  playSuccess: () => void;
  playError: () => void;
  playWarning: () => void;
  playCelebration: () => void;
  isSupported: boolean;
}

/**
 * Hook for managing sound settings and playing sounds
 *
 * @returns Object with enabled state and sound play functions
 */
export function useSoundSettings(): UseSoundSettingsReturn {
  const [enabled, setEnabledState] = useState<boolean>(() => {
    // Initialize from localStorage (only runs once)
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("math-tutor:sounds");
      return stored !== "false";
    }
    return true;
  });

  const setEnabled = (value: boolean) => {
    setEnabledState(value);
    if (typeof window !== "undefined") {
      localStorage.setItem("math-tutor:sounds", String(value));
    }
  };

  // Wrap sound functions to check enabled flag
  const playSuccessIfEnabled = () => {
    if (enabled && isSoundSupported()) {
      playSuccessSound();
    }
  };

  const playErrorIfEnabled = () => {
    if (enabled && isSoundSupported()) {
      playErrorSound();
    }
  };

  const playWarningIfEnabled = () => {
    if (enabled && isSoundSupported()) {
      playWarningSound();
    }
  };

  const playCelebrationIfEnabled = () => {
    if (enabled && isSoundSupported()) {
      playCelebrationSound();
    }
  };

  return {
    enabled,
    setEnabled,
    playSuccess: playSuccessIfEnabled,
    playError: playErrorIfEnabled,
    playWarning: playWarningIfEnabled,
    playCelebration: playCelebrationIfEnabled,
    isSupported: isSoundSupported(),
  };
}
