import type {
  Difficulty,
  GameMode,
  GameResult,
  PlayerBest,
  PlayerProgressUpdate,
} from "@/types";

const playerProgressStorageKey = "keyboard-warrior:player-progress";

type PlayerProgressMap = Record<string, PlayerBest>;

type StoredPlayerBest = Partial<PlayerBest>;

function getProgressKey(mode: GameMode, difficulty: Difficulty) {
  return `${mode}:${difficulty}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeBest(value: unknown): PlayerBest | null {
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

function readPlayerProgressMap(): PlayerProgressMap {
  if (typeof window === "undefined") {
    return {};
  }

  const storedProgress = window.localStorage.getItem(playerProgressStorageKey);

  if (!storedProgress) {
    return {};
  }

  try {
    const parsedProgress: unknown = JSON.parse(storedProgress);

    if (!isRecord(parsedProgress)) {
      return {};
    }

    return Object.entries(parsedProgress).reduce<PlayerProgressMap>(
      (progressMap, [key, value]) => {
        const best = normalizeBest(value as StoredPlayerBest);

        if (best) {
          progressMap[key] = best;
        }

        return progressMap;
      },
      {},
    );
  } catch {
    return {};
  }
}

function writePlayerProgressMap(progressMap: PlayerProgressMap) {
  window.localStorage.setItem(
    playerProgressStorageKey,
    JSON.stringify(progressMap),
  );
}

function getCurrentBest(result: GameResult): PlayerBest {
  return {
    score: result.score,
    accuracy: result.accuracy,
    averageReactionMs: result.averageReactionMs,
    hits: result.hits,
    longestCombo: result.longestCombo,
    playedAt: result.endedAt,
  };
}

function isFasterReaction(currentMs: number, previousMs: number) {
  if (currentMs <= 0) {
    return false;
  }

  return previousMs <= 0 || currentMs < previousMs;
}

export function readPlayerBest(mode: GameMode, difficulty: Difficulty) {
  return readPlayerProgressMap()[getProgressKey(mode, difficulty)] ?? null;
}

export function updatePlayerProgress(result: GameResult): PlayerProgressUpdate {
  const progressMap = readPlayerProgressMap();
  const key = getProgressKey(result.mode, result.difficulty);
  const previous = progressMap[key] ?? null;
  const current = getCurrentBest(result);
  const newBests = {
    score: !previous || current.score > previous.score,
    accuracy: !previous || current.accuracy > previous.accuracy,
    averageReactionMs:
      !previous
        ? current.averageReactionMs > 0
        : isFasterReaction(
            current.averageReactionMs,
            previous.averageReactionMs,
          ),
    hits: !previous || current.hits > previous.hits,
    longestCombo: !previous || current.longestCombo > previous.longestCombo,
  };
  const nextBest = previous
    ? {
        score: Math.max(previous.score, current.score),
        accuracy: Math.max(previous.accuracy, current.accuracy),
        averageReactionMs: newBests.averageReactionMs
          ? current.averageReactionMs
          : previous.averageReactionMs,
        hits: Math.max(previous.hits, current.hits),
        longestCombo: Math.max(previous.longestCombo, current.longestCombo),
        playedAt: Object.values(newBests).some(Boolean)
          ? current.playedAt
          : previous.playedAt,
      }
    : current;

  progressMap[key] = nextBest;
  writePlayerProgressMap(progressMap);

  return {
    key,
    current,
    previous,
    isFirstRun: !previous,
    newBests,
  };
}
