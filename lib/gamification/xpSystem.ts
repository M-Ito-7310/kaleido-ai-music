/**
 * XP and Leveling System
 *
 * Manages user experience points and level progression
 */

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXP: number;
}

// XP required for each level (exponential growth)
export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Calculate current level from total XP
export function getLevelFromXP(totalXP: number): UserStats {
  let level = 1;
  let xpUsed = 0;

  while (true) {
    const xpNeeded = getXPForLevel(level);
    if (xpUsed + xpNeeded > totalXP) {
      break;
    }
    xpUsed += xpNeeded;
    level++;
  }

  const xpToNextLevel = getXPForLevel(level);
  const currentLevelXP = totalXP - xpUsed;

  return {
    level,
    xp: currentLevelXP,
    xpToNextLevel,
    totalXP,
  };
}

// Award XP and return new stats
export function awardXP(currentTotalXP: number, xpToAward: number): UserStats {
  const newTotalXP = currentTotalXP + xpToAward;
  return getLevelFromXP(newTotalXP);
}

// Get level title based on level
export function getLevelTitle(level: number): string {
  if (level < 5) return 'Novice Listener';
  if (level < 10) return 'Music Explorer';
  if (level < 20) return 'Melody Master';
  if (level < 30) return 'Harmony Hero';
  if (level < 50) return 'Audio Architect';
  if (level < 75) return 'Sound Sage';
  if (level < 100) return 'Music Legend';
  return 'Grandmaster of Sound';
}

// XP rewards for different actions
export const XP_REWARDS = {
  TRACK_PLAYED: 5,
  TRACK_COMPLETED: 10,
  FAVORITE_ADDED: 8,
  PLAYLIST_CREATED: 20,
  TRACK_SHARED: 12,
  DAILY_LOGIN: 15,
  VISUALIZER_USED: 3,
};
