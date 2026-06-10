import type { GameResult } from "@/types";

const latestGameResultKey = "keyboard-warrior:latest-result";

type StoredResult = Partial<GameResult> & {
  perKeyAverageMs?: unknown;
};

function isStoredResult(value: unknown): value is StoredResult {
  return typeof value === "object" && value !== null;
}

function normalizeStoredResult(value: unknown): GameResult | null {
  if (!isStoredResult(value)) {
    return null;
  }

  return {
    score: value.score ?? 0,
    hits: value.hits ?? 0,
    misses: value.misses ?? 0,
    combo: value.combo ?? 0,
    longestCombo: value.longestCombo ?? 0,
    mode: value.mode === "word" ? "word" : "letter",
    difficulty:
      value.difficulty === "medium" || value.difficulty === "hard"
        ? value.difficulty
        : "easy",
    durationSeconds: value.durationSeconds ?? 60,
    accuracy: value.accuracy ?? 0,
    averageReactionMs: value.averageReactionMs ?? 0,
    perKeyAverageMs:
      typeof value.perKeyAverageMs === "object" && value.perKeyAverageMs !== null
        ? (value.perKeyAverageMs as Record<string, number>)
        : {},
    endedAt: value.endedAt ?? new Date().toISOString(),
  };
}

export function saveLatestGameResult(result: GameResult) {
  window.sessionStorage.setItem(latestGameResultKey, JSON.stringify(result));
}

export function readLatestGameResult() {
  const storedResult = window.sessionStorage.getItem(latestGameResultKey);

  if (!storedResult) {
    return null;
  }

  try {
    return normalizeStoredResult(JSON.parse(storedResult));
  } catch {
    return null;
  }
}
