export function getComboMultiplier(combo: number) {
  if (combo >= 15) {
    return 3;
  }

  if (combo >= 10) {
    return 2;
  }

  if (combo >= 5) {
    return 1.5;
  }

  return 1;
}

export function calculateHitScore(combo: number) {
  return Math.round(10 * getComboMultiplier(combo));
}

export function calculateMissScore(score: number) {
  return Math.max(0, score - 5);
}

export function calculateAccuracy(hits: number, misses: number) {
  const attempts = hits + misses;

  if (attempts === 0) {
    return 0;
  }

  return Math.round((hits / attempts) * 100);
}
