/**
 * Audio Context Manager
 *
 * Manages a single AudioContext instance for the app.
 * Browser requires user interaction (click/keydown) before first play (autoplay policy).
 * This module handles initialization and provides simple tone playback.
 */

let audioContext: AudioContext | null = null;

/**
 * Initialize AudioContext on first user interaction
 * CRITICAL: Browser autoplay policy requires this to be called from a user event handler
 *
 * @returns void
 */
export function initAudioContext(): void {
  if (!audioContext && typeof window !== "undefined") {
    try {
      const AudioContextClass =
        (window as unknown as {
          AudioContext?: typeof AudioContext;
          webkitAudioContext?: typeof AudioContext;
        }).AudioContext ||
        (window as unknown as {
          AudioContext?: typeof AudioContext;
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      if (AudioContextClass) {
        audioContext = new AudioContextClass();
      }
    } catch (error) {
      console.warn("AudioContext initialization failed:", error);
    }
  }
}

/**
 * Play a simple tone using Web Audio API
 * Creates an oscillator with specified frequency and duration
 * Uses exponential volume ramp for smooth fade-out
 *
 * @param frequency - Frequency in Hz (e.g., 440 for A4 note)
 * @param duration - Duration in seconds (e.g., 0.2 for 200ms)
 * @returns void
 */
export function playSound(frequency: number, duration: number): void {
  // CRITICAL: Check audioContext exists before playing
  if (!audioContext) {
    initAudioContext();
  }

  if (!audioContext) {
    console.warn("AudioContext not available");
    return;
  }

  try {
    const now = audioContext.currentTime;

    // Create oscillator node (sine wave)
    const osc = audioContext.createOscillator();

    // Create gain node for volume control
    const gain = audioContext.createGain();

    // Set oscillator frequency
    osc.frequency.value = frequency;

    // Connect nodes: oscillator → gain → speakers
    osc.connect(gain);
    gain.connect(audioContext.destination);

    // Volume envelope: start at 0.1, fade to 0.01
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // Start and stop the oscillator
    osc.start(now);
    osc.stop(now + duration);
  } catch (error) {
    console.warn("Sound playback failed:", error);
  }
}

/**
 * Check if Web Audio API is supported in the browser
 *
 * @returns boolean - true if AudioContext or webkitAudioContext is available
 */
export function isSoundSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    ("AudioContext" in window || "webkitAudioContext" in window)
  );
}

/**
 * Get the current AudioContext instance
 * Returns null if not initialized
 *
 * @returns AudioContext | null
 */
export function getAudioContext(): AudioContext | null {
  return audioContext;
}
