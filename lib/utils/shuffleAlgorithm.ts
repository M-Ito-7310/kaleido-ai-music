/**
 * Fisher-Yates shuffle algorithm
 *
 * Randomly shuffles an array in-place with uniform distribution.
 * Time complexity: O(n)
 *
 * @param array - Array to shuffle
 * @returns A new shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
