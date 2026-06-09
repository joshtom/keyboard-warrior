import type { Difficulty } from "@/types";

export const letterCharacters: Record<Difficulty, Array<string>> = {
  easy: "abcdefghijklmnopqrstuvwxyz".split(""),
  medium: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(
    "",
  ),
  hard: [
    ..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(
      "",
    ),
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "-",
    "=",
    "+",
    "[",
    "]",
    ";",
    "'",
    ",",
    ".",
    "/",
  ],
};

export const difficultySettings: Record<
  Difficulty,
  {
    fallDurationMs: number;
    spawnEveryMs: number;
    maxActiveTiles: number;
  }
> = {
  easy: {
    fallDurationMs: 6200,
    spawnEveryMs: 1200,
    maxActiveTiles: 1,
  },
  medium: {
    fallDurationMs: 5200,
    spawnEveryMs: 900,
    maxActiveTiles: 3,
  },
  hard: {
    fallDurationMs: 4300,
    spawnEveryMs: 680,
    maxActiveTiles: 5,
  },
};
