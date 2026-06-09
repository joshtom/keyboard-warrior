import type { GameResult } from "@/types";

const latestGameResultKey = "keyboard-warrior:latest-result";

export function saveLatestGameResult(result: GameResult) {
  window.sessionStorage.setItem(latestGameResultKey, JSON.stringify(result));
}

export function readLatestGameResult() {
  const storedResult = window.sessionStorage.getItem(latestGameResultKey);

  if (!storedResult) {
    return null;
  }

  try {
    return JSON.parse(storedResult) as GameResult;
  } catch {
    return null;
  }
}
