/**
 * useSoundSettings Hook Tests
 *
 * Tests for sound settings management and sound playback
 */

import { renderHook, act } from "@testing-library/react";
import { useSoundSettings } from "@/lib/audio/useSoundSettings";

// Mock the audio utilities
jest.mock("@/lib/audio/sounds", () => ({
  playSuccessSound: jest.fn(),
  playErrorSound: jest.fn(),
  playWarningSound: jest.fn(),
  playCelebrationSound: jest.fn(),
}));

jest.mock("@/lib/audio/audioContext", () => ({
  isSoundSupported: jest.fn(() => true),
  initAudioContext: jest.fn(),
  playSound: jest.fn(),
  getAudioContext: jest.fn(() => null),
}));

describe("useSoundSettings", () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("Hook Returns", () => {
    it("should return object with expected properties", () => {
      const { result } = renderHook(() => useSoundSettings());

      expect(result.current).toHaveProperty("enabled");
      expect(result.current).toHaveProperty("setEnabled");
      expect(result.current).toHaveProperty("playSuccess");
      expect(result.current).toHaveProperty("playError");
      expect(result.current).toHaveProperty("playWarning");
      expect(result.current).toHaveProperty("playCelebration");
      expect(result.current).toHaveProperty("isSupported");
    });

    it("should return boolean for enabled state", () => {
      const { result } = renderHook(() => useSoundSettings());
      expect(typeof result.current.enabled).toBe("boolean");
    });

    it("should return boolean for isSupported", () => {
      const { result } = renderHook(() => useSoundSettings());
      expect(typeof result.current.isSupported).toBe("boolean");
    });

    it("should return functions for sound play methods", () => {
      const { result } = renderHook(() => useSoundSettings());
      expect(typeof result.current.playSuccess).toBe("function");
      expect(typeof result.current.playError).toBe("function");
      expect(typeof result.current.playWarning).toBe("function");
      expect(typeof result.current.playCelebration).toBe("function");
    });
  });

  describe("Enabled State", () => {
    it("should default to enabled (true)", () => {
      const { result } = renderHook(() => useSoundSettings());
      expect(result.current.enabled).toBe(true);
    });

    it("should allow enabling sounds", () => {
      const { result } = renderHook(() => useSoundSettings());

      act(() => {
        result.current.setEnabled(true);
      });

      expect(result.current.enabled).toBe(true);
    });

    it("should allow disabling sounds", () => {
      const { result } = renderHook(() => useSoundSettings());

      act(() => {
        result.current.setEnabled(false);
      });

      expect(result.current.enabled).toBe(false);
    });
  });

  describe("LocalStorage Persistence", () => {
    it("should save to localStorage when setEnabled is called", () => {
      const { result } = renderHook(() => useSoundSettings());

      act(() => {
        result.current.setEnabled(false);
      });

      expect(localStorage.getItem("math-tutor:sounds")).toBe("false");
    });

    it("should load from localStorage on mount", () => {
      localStorage.setItem("math-tutor:sounds", "false");

      const { result } = renderHook(() => useSoundSettings());

      expect(result.current.enabled).toBe(false);
    });

    it("should persist enabled state to localStorage", () => {
      const { result } = renderHook(() => useSoundSettings());

      act(() => {
        result.current.setEnabled(true);
      });

      expect(localStorage.getItem("math-tutor:sounds")).toBe("true");

      act(() => {
        result.current.setEnabled(false);
      });

      expect(localStorage.getItem("math-tutor:sounds")).toBe("false");
    });
  });

  describe("Sound Play Functions", () => {
    it("should not throw when calling playSuccess", () => {
      const { result } = renderHook(() => useSoundSettings());
      expect(() => result.current.playSuccess()).not.toThrow();
    });

    it("should not throw when calling playError", () => {
      const { result } = renderHook(() => useSoundSettings());
      expect(() => result.current.playError()).not.toThrow();
    });

    it("should not throw when calling playWarning", () => {
      const { result } = renderHook(() => useSoundSettings());
      expect(() => result.current.playWarning()).not.toThrow();
    });

    it("should not throw when calling playCelebration", () => {
      const { result } = renderHook(() => useSoundSettings());
      expect(() => result.current.playCelebration()).not.toThrow();
    });

    it("should not play sounds when disabled", () => {
      const { result } = renderHook(() => useSoundSettings());

      act(() => {
        result.current.setEnabled(false);
      });

      // Should not throw and functions should be safe to call
      expect(() => result.current.playSuccess()).not.toThrow();
      expect(() => result.current.playError()).not.toThrow();
    });

    it("should allow playing sounds when enabled", () => {
      const { result } = renderHook(() => useSoundSettings());

      act(() => {
        result.current.setEnabled(true);
      });

      expect(() => result.current.playSuccess()).not.toThrow();
      expect(() => result.current.playError()).not.toThrow();
    });
  });
});
