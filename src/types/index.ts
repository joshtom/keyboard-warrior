export type GameMode = "letter" | "word";

export type Difficulty = "easy" | "medium" | "hard";

export type SessionConfig = {
  mode: GameMode;
  difficulty: Difficulty;
  durationSeconds: number;
};

export type TileState = {
  id: string;
  value: string;
  x: number;
  y: number;
  spawnedAt: number;
};

export type GameStats = {
  score: number;
  hits: number;
  misses: number;
  combo: number;
  longestCombo: number;
};

export type ReactionSummary = {
  averageReactionMs: number;
  perKeyAverageMs: Record<string, number>;
};

export type GameResult = GameStats & {
  mode: GameMode;
  difficulty: Difficulty;
  durationSeconds: number;
  accuracy: number;
  averageReactionMs: number;
  perKeyAverageMs: Record<string, number>;
  endedAt: string;
};
