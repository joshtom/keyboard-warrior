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
