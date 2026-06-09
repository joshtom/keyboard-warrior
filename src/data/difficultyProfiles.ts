import type { Difficulty } from "@/types";

export type DifficultyProfile = {
  label: string;
  detail: string;
  metric: string;
  characterSummary: string;
  pressureSummary: string;
  fallDurationMs: number;
  spawnEveryMs: number;
  maxActiveTiles: number;
};

export const difficultyProfiles: Record<Difficulty, DifficultyProfile> = {
  easy: {
    label: "Easy",
    detail: "Lowercase letters and short words",
    metric: "steady rain",
    characterSummary: "a-z / 3-4 letters",
    pressureSummary: "760ms spawn / 7 active",
    fallDurationMs: 6400,
    spawnEveryMs: 760,
    maxActiveTiles: 7,
  },
  medium: {
    label: "Medium",
    detail: "Letters, numbers, and everyday words",
    metric: "heavy rain",
    characterSummary: "A-z + 0-9 / 5-7 letters",
    pressureSummary: "560ms spawn / 10 active",
    fallDurationMs: 5400,
    spawnEveryMs: 560,
    maxActiveTiles: 10,
  },
  hard: {
    label: "Hard",
    detail: "Symbols, mixed case, and longer words",
    metric: "storm",
    characterSummary: "A-z + 0-9 + symbols",
    pressureSummary: "420ms spawn / 13 active",
    fallDurationMs: 4600,
    spawnEveryMs: 420,
    maxActiveTiles: 13,
  },
};
