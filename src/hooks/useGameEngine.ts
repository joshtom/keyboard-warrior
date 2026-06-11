import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { letterCharacters } from "@/data/characterSets";
import { difficultyProfiles } from "@/data/difficultyProfiles";
import { wordLists } from "@/data/wordLists";
import { useReactionTracker } from "@/hooks/useReactionTracker";
import {
  calculateAccuracy,
  calculateHitScore,
  calculateMissScore,
  getComboMultiplier,
} from "@/utils/scoring";
import type {
  Difficulty,
  GameMode,
  GameResult,
  GameStats,
  TileState,
} from "@/types";

type UseGameEngineOptions = {
  mode: GameMode;
  difficulty: Difficulty;
  durationSeconds: number;
  isTouchMode?: boolean;
  onComboBreak?: () => void;
  onComplete: (result: GameResult) => void;
  onHit?: (streakCount: number) => void;
  onMiss?: () => void;
  onSessionEnd?: () => void;
};

type GamePhase = "countdown" | "playing" | "complete";

const initialStats: GameStats = {
  score: 0,
  hits: 0,
  misses: 0,
  combo: 0,
  longestCombo: 0,
};

function getRandomItem(items: Array<string>) {
  return items[Math.floor(Math.random() * items.length)];
}

function createTile(
  values: Array<string>,
  spawnedAt: number,
  lastX: number | null,
) {
  let nextX = 8 + Math.random() * 84;

  if (lastX !== null && Math.abs(nextX - lastX) < 18) {
    nextX = (nextX + 28) % 92;
    nextX = Math.max(8, nextX);
  }

  return {
    id: `${spawnedAt}-${Math.random().toString(16).slice(2)}`,
    value: getRandomItem(values),
    x: nextX,
    y: 0,
    spawnedAt,
  };
}

export function useGameEngine({
  mode,
  difficulty,
  durationSeconds,
  isTouchMode = false,
  onComboBreak,
  onComplete,
  onHit,
  onMiss,
  onSessionEnd,
}: UseGameEngineOptions) {
  const { getReactionSummary, recordReaction } = useReactionTracker();
  const settings = useMemo(() => {
    const profile = difficultyProfiles[difficulty];

    if (!isTouchMode) {
      return profile;
    }

    return {
      ...profile,
      fallDurationMs: Math.round(profile.fallDurationMs * 0.78),
      spawnEveryMs: Math.round(profile.spawnEveryMs * 0.84),
    };
  }, [difficulty, isTouchMode]);
  const tileValues = useMemo(
    () => (mode === "word" ? wordLists[difficulty] : letterCharacters[difficulty]),
    [difficulty, mode],
  );
  const [phase, setPhase] = useState<GamePhase>("countdown");
  const [countdownValue, setCountdownValue] = useState(3);
  const [tiles, setTiles] = useState<Array<TileState>>([]);
  const [stats, setStats] = useState<GameStats>(initialStats);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [typedText, setTypedText] = useState("");
  const [missFlashKey, setMissFlashKey] = useState(0);
  const statsRef = useRef(stats);
  const tilesRef = useRef(tiles);
  const phaseRef = useRef<GamePhase>("countdown");
  const completedRef = useRef(false);
  const startedAtRef = useRef<number | null>(null);
  const lastSpawnedAtRef = useRef(0);
  const lastTileXRef = useRef<number | null>(null);
  const typedTextRef = useRef("");

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    tilesRef.current = tiles;
  }, [tiles]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (phase !== "countdown") {
      return;
    }

    if (countdownValue <= 0) {
      window.setTimeout(() => setPhase("playing"), 420);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCountdownValue((current) => Math.max(0, current - 1));
    }, 820);

    return () => window.clearTimeout(timeoutId);
  }, [countdownValue, phase]);

  const registerMiss = useCallback(
    (missedCount = 1) => {
      if (missedCount <= 0) {
        return;
      }

      onMiss?.();

      if (statsRef.current.combo > 0) {
        onComboBreak?.();
      }

      setMissFlashKey((current) => current + 1);
      setStats((current) => ({
        ...current,
        score: Array.from({ length: missedCount }).reduce<number>(
          (score) => calculateMissScore(score),
          current.score,
        ),
        misses: current.misses + missedCount,
        combo: 0,
      }));
    },
    [onComboBreak, onMiss],
  );

  const completeSession = useCallback(() => {
    if (completedRef.current) {
      return;
    }

    completedRef.current = true;
    setPhase("complete");
    onSessionEnd?.();

    const finalStats = statsRef.current;
    const reactionSummary = getReactionSummary();
    onComplete({
      ...finalStats,
      mode,
      difficulty,
      durationSeconds,
      accuracy: calculateAccuracy(finalStats.hits, finalStats.misses),
      averageReactionMs: reactionSummary.averageReactionMs,
      perKeyAverageMs: reactionSummary.perKeyAverageMs,
      endedAt: new Date().toISOString(),
    });
  }, [
    difficulty,
    durationSeconds,
    getReactionSummary,
    mode,
    onComplete,
    onSessionEnd,
  ]);

  const hitTile = useCallback((tileId: string) => {
    if (phaseRef.current !== "playing") {
      return;
    }

    const targetTile = tilesRef.current.find((tile) => tile.id === tileId);

    if (!targetTile) {
      return;
    }

    recordReaction(targetTile);
    const nextTiles = tilesRef.current.filter((tile) => tile.id !== tileId);
    tilesRef.current = nextTiles;
    setTiles(nextTiles);
    onHit?.(statsRef.current.combo + 1);
    setStats((current) => {
      const nextCombo = current.combo + 1;

      return {
        score: current.score + calculateHitScore(nextCombo),
        hits: current.hits + 1,
        misses: current.misses,
        combo: nextCombo,
        longestCombo: Math.max(current.longestCombo, nextCombo),
      };
    });
  }, [onHit, recordReaction]);

  const applyTypedText = useCallback(
    (nextTypedText: string) => {
      const matchingTile = tilesRef.current.find((tile) =>
        nextTypedText.endsWith(tile.value),
      );

      if (matchingTile) {
        typedTextRef.current = "";
        setTypedText("");
        hitTile(matchingTile.id);
        return;
      }

      typedTextRef.current = nextTypedText;
      setTypedText(nextTypedText);
    },
    [hitTile],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (phaseRef.current !== "playing") {
        return;
      }

      if (mode === "word") {
        if (event.key === "Backspace") {
          event.preventDefault();
          applyTypedText(typedTextRef.current.slice(0, -1));
          return;
        }

        if (event.key === "Escape" || event.key === " ") {
          event.preventDefault();
          typedTextRef.current = "";
          setTypedText("");
          return;
        }

        if (event.key.length !== 1) {
          return;
        }

        event.preventDefault();
        applyTypedText(`${typedTextRef.current}${event.key}`.slice(-24));
        return;
      }

      const matchingTile = tilesRef.current.find(
        (tile) => tile.value === event.key,
      );

      if (matchingTile) {
        event.preventDefault();
        hitTile(matchingTile.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [applyTypedText, hitTile, mode]);

  useEffect(() => {
    let animationFrameId = 0;

    const tick = (now: number) => {
      if (phaseRef.current !== "playing") {
        animationFrameId = window.requestAnimationFrame(tick);
        return;
      }

      if (startedAtRef.current === null) {
        startedAtRef.current = now;
        lastSpawnedAtRef.current = now - settings.spawnEveryMs;
      }

      const elapsedSeconds = (now - startedAtRef.current) / 1000;
      const nextTimeLeft = Math.max(0, durationSeconds - elapsedSeconds);
      setTimeLeft(Math.ceil(nextTimeLeft));

      if (nextTimeLeft <= 0) {
        setTiles([]);
        completeSession();
        return;
      }

      let nextTiles = tilesRef.current
        .map((tile) => ({
          ...tile,
          y: ((now - tile.spawnedAt) / settings.fallDurationMs) * 100,
        }))
        .filter((tile) => tile.y < 100);

      const missedCount = tilesRef.current.length - nextTiles.length;

      if (missedCount > 0) {
        registerMiss(missedCount);
      }

      while (
        now - lastSpawnedAtRef.current >= settings.spawnEveryMs &&
        nextTiles.length < settings.maxActiveTiles
      ) {
        const spawnedAt = lastSpawnedAtRef.current + settings.spawnEveryMs;
        const nextTile = createTile(
          tileValues,
          spawnedAt,
          lastTileXRef.current,
        );
        lastTileXRef.current = nextTile.x;
        lastSpawnedAtRef.current = spawnedAt;
        nextTiles = [...nextTiles, nextTile];
      }

      tilesRef.current = nextTiles;
      setTiles(nextTiles);

      animationFrameId = window.requestAnimationFrame(tick);
    };

    animationFrameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [completeSession, durationSeconds, registerMiss, settings, tileValues]);

  return {
    phase,
    countdownValue,
    tiles,
    stats,
    timeLeft,
    missFlashKey,
    comboMultiplier: getComboMultiplier(stats.combo),
    typedText,
    hitTile,
  };
}
