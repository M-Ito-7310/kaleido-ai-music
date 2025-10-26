/**
 * Screen Reader Announcer
 *
 * Provides live region announcements for screen readers
 */

/**
 * Announce message to screen readers
 *
 * @param message - Message to announce
 * @param priority - Announcement priority ('polite' | 'assertive')
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  // Find or create the live region element
  let liveRegion = document.querySelector(`[aria-live="${priority}"][role="status"]`) as HTMLElement;

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only'; // Visually hidden but accessible to screen readers
    document.body.appendChild(liveRegion);
  }

  // Clear the previous message and set the new one
  liveRegion.textContent = '';

  // Use setTimeout to ensure screen readers pick up the change
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);
}

/**
 * Announce track change
 */
export function announceTrackChange(title: string, artist: string): void {
  announce(`Now playing: ${title} by ${artist}`, 'polite');
}

/**
 * Announce play/pause state
 */
export function announcePlayPause(isPlaying: boolean): void {
  announce(isPlaying ? 'Playback started' : 'Playback paused', 'polite');
}

/**
 * Announce repeat mode change
 */
export function announceRepeatMode(mode: 'off' | 'all' | 'one'): void {
  const messages = {
    off: 'Repeat off',
    all: 'Repeat all tracks',
    one: 'Repeat current track',
  };
  announce(messages[mode], 'polite');
}

/**
 * Announce shuffle state
 */
export function announceShuffle(enabled: boolean): void {
  announce(enabled ? 'Shuffle enabled' : 'Shuffle disabled', 'polite');
}

/**
 * Announce volume change
 */
export function announceVolume(volume: number): void {
  announce(`Volume ${Math.round(volume * 100)}%`, 'polite');
}

/**
 * Announce error
 */
export function announceError(error: string): void {
  announce(`Error: ${error}`, 'assertive');
}
