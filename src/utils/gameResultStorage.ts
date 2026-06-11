import type { GameResult, PlayerBest, PlayerProgressUpdate } from "@/types";

const latestGameResultKey = "keyboard-warrior:latest-result";

type StoredResult = Partial<GameResult> & {
  perKeyAverageMs?: unknown;
  progress?: unknown;
};

function isStoredResult(value: unknown): value is StoredResult {
  return typeof value === "object" && value !== null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeStoredBest(value: unknown): PlayerBest | null {
  if (!isRecord(value)) {
    return null;
  }

  return {
    score: typeof value.score === "number" ? value.score : 0,
    accuracy: typeof value.accuracy === "number" ? value.accuracy : 0,
    averageReactionMs:
      typeof value.averageReactionMs === "number" ? value.averageReactionMs : 0,
    hits: typeof value.hits === "number" ? value.hits : 0,
    longestCombo:
      typeof value.longestCombo === "number" ? value.longestCombo : 0,
    playedAt:
      typeof value.playedAt === "string"
        ? value.playedAt
        : new Date().toISOString(),
  };
}

function normalizeStoredProgress(value: unknown): PlayerProgressUpdate | undefined {
  if (!isRecord(value) || !isRecord(value.newBests)) {
    return undefined;
  }

  const current = normalizeStoredBest(value.current);

  if (!current) {
    return undefined;
  }

  return {
    key: typeof value.key === "string" ? value.key : "",
    current,
    previous: normalizeStoredBest(value.previous),
    isFirstRun: Boolean(value.isFirstRun),
    newBests: {
      score: Boolean(value.newBests.score),
      accuracy: Boolean(value.newBests.accuracy),
      averageReactionMs: Boolean(value.newBests.averageReactionMs),
      hits: Boolean(value.newBests.hits),
      longestCombo: Boolean(value.newBests.longestCombo),
    },
  };
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
    progress: normalizeStoredProgress(value.progress),
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
