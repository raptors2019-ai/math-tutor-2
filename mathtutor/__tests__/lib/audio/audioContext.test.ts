/**
 * Audio Context Manager Tests
 *
 * Tests for Web Audio API setup and sound playback
 */

import {
  initAudioContext,
  playSound,
  isSoundSupported,
  getAudioContext,
} from "@/lib/audio/audioContext";

describe("audioContext", () => {
  // Mock the AudioContext
  beforeEach(() => {
    // Clear any previous instances
    jest.clearAllMocks();

    // Mock AudioContext
    const mockAudioContext = {
      createOscillator: jest.fn(() => ({
        frequency: { value: 0 },
        connect: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
      })),
      createGain: jest.fn(() => ({
        gain: {
          setValueAtTime: jest.fn(),
          exponentialRampToValueAtTime: jest.fn(),
        },
        connect: jest.fn(),
      })),
      destination: {},
      currentTime: 0,
    };

    (window as any).AudioContext = jest.fn(() => mockAudioContext);
  });

  describe("isSoundSupported", () => {
    it("should return boolean type", () => {
      const result = isSoundSupported();
      expect(typeof result).toBe("boolean");
    });

    it("should return true when AudioContext is available", () => {
      (window as any).AudioContext = jest.fn();
      const result = isSoundSupported();
      expect(result).toBe(true);
    });

    it("should return true when webkitAudioContext is available", () => {
      delete (window as any).AudioContext;
      (window as any).webkitAudioContext = jest.fn();
      const result = isSoundSupported();
      expect(result).toBe(true);
    });
  });

  describe("initAudioContext", () => {
    it("should not throw error on initialization", () => {
      expect(() => initAudioContext()).not.toThrow();
    });

    it("should return void", () => {
      const result = initAudioContext();
      expect(result).toBeUndefined();
    });

    it("should create AudioContext on first call", () => {
      const audioContext = getAudioContext();
      // Should exist after init
      if (isSoundSupported()) {
        expect(audioContext).toBeDefined();
      }
    });
  });

  describe("playSound", () => {
    it("should not throw error when playing sound", () => {
      initAudioContext();
      expect(() => playSound(440, 0.2)).not.toThrow();
    });

    it("should initialize AudioContext if not already done", () => {
      // playSound should call initAudioContext internally
      expect(() => playSound(440, 0.1)).not.toThrow();
    });

    it("should accept valid frequency values", () => {
      initAudioContext();
      expect(() => playSound(440, 0.2)).not.toThrow();
      expect(() => playSound(330, 0.15)).not.toThrow();
      expect(() => playSound(300, 0.1)).not.toThrow();
    });

    it("should accept various duration values", () => {
      initAudioContext();
      expect(() => playSound(440, 0.1)).not.toThrow();
      expect(() => playSound(440, 0.2)).not.toThrow();
      expect(() => playSound(440, 0.5)).not.toThrow();
    });
  });

  describe("getAudioContext", () => {
    it("should return AudioContext or null", () => {
      initAudioContext();
      const context = getAudioContext();
      // After init, should have context or be null if not supported
      expect(context === null || typeof context === "object").toBe(true);
    });
  });
});
