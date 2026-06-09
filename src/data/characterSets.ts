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
    fallDurationMs: 6400,
    spawnEveryMs: 760,
    maxActiveTiles: 7,
  },
  medium: {
    fallDurationMs: 5400,
    spawnEveryMs: 560,
    maxActiveTiles: 10,
  },
  hard: {
    fallDurationMs: 4600,
    spawnEveryMs: 420,
    maxActiveTiles: 13,
  },
};
