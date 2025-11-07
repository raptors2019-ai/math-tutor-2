/**
 * Sound Effects Utilities
 *
 * Provides functions to play different sound effects for quiz interactions.
 * All sounds are generated using Web Audio API (no external audio files).
 */

import { initAudioContext, playSound } from "./audioContext";

/**
 * Play success/correct answer sound
 * Frequency: 440Hz (A4 note - pleasant beep)
 * Duration: 200ms
 *
 * @returns void
 */
export function playSuccessSound(): void {
  initAudioContext();
  playSound(440, 0.2); // A4 note, 200ms
}

/**
 * Play error/incorrect answer sound
 * Frequency: 300Hz (lower tone - warning)
 * Duration: 150ms
 *
 * @returns void
 */
export function playErrorSound(): void {
  initAudioContext();
  playSound(300, 0.15); // Lower freq, 150ms
}

/**
 * Play warning/attention sound
 * Frequency: 350Hz (medium tone)
 * Duration: 100ms
 *
 * @returns void
 */
export function playWarningSound(): void {
  initAudioContext();
  playSound(350, 0.1); // Medium freq, 100ms
}

/**
 * Play completion/celebration sound (ascending pitch)
 * Uses two tones: first at 330Hz, then 440Hz
 * Duration: 300ms total
 *
 * @returns void
 */
export function playCelebrationSound(): void {
  initAudioContext();
  // First note
  playSound(330, 0.15); // E4 note, 150ms
  // Second note (offset by first duration)
  setTimeout(() => {
    playSound(440, 0.15); // A4 note, 150ms
  }, 160);
}
