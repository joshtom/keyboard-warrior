export type GameMode = "letter" | "word";

export type Difficulty = "easy" | "medium" | "hard";

export type SessionConfig = {
  mode: GameMode;
  difficulty: Difficulty;
  durationSeconds: number;
};
