import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { difficultySettings, letterCharacters } from "@/data/characterSets";
import {
  calculateAccuracy,
  calculateHitScore,
  calculateMissScore,
  getComboMultiplier,
} from "@/utils/scoring";
import type { Difficulty, GameMode, GameResult, GameStats, TileState } from "@/types";

type UseGameEngineOptions = {
  mode: GameMode;
  difficulty: Difficulty;
  durationSeconds: number;
  onComplete: (result: GameResult) => void;
};

type GamePhase = "playing" | "complete";

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
  characters: Array<string>,
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
    value: getRandomItem(characters),
    x: nextX,
    y: 0,
    spawnedAt,
  };
}

export function useGameEngine({
  mode,
  difficulty,
  durationSeconds,
  onComplete,
}: UseGameEngineOptions) {
  const settings = difficultySettings[difficulty];
  const characters = useMemo(
    () => letterCharacters[difficulty],
    [difficulty],
  );
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [tiles, setTiles] = useState<Array<TileState>>([]);
  const [stats, setStats] = useState<GameStats>(initialStats);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [missFlashKey, setMissFlashKey] = useState(0);
  const statsRef = useRef(stats);
  const tilesRef = useRef(tiles);
  const phaseRef = useRef<GamePhase>("playing");
  const completedRef = useRef(false);
  const startedAtRef = useRef<number | null>(null);
  const lastSpawnedAtRef = useRef(0);
  const lastTileXRef = useRef<number | null>(null);

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    tilesRef.current = tiles;
  }, [tiles]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const registerMiss = useCallback((missedCount = 1) => {
    if (missedCount <= 0) {
      return;
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
  }, []);

  const completeSession = useCallback(() => {
    if (completedRef.current) {
      return;
    }

    completedRef.current = true;
    setPhase("complete");

    const finalStats = statsRef.current;
    onComplete({
      ...finalStats,
      mode,
      difficulty,
      durationSeconds,
      accuracy: calculateAccuracy(finalStats.hits, finalStats.misses),
      endedAt: new Date().toISOString(),
    });
  }, [difficulty, durationSeconds, mode, onComplete]);

  const hitTile = useCallback((tileId: string) => {
    if (phaseRef.current !== "playing") {
      return;
    }

    const targetTile = tilesRef.current.find((tile) => tile.id === tileId);

    if (!targetTile) {
      return;
    }

    setTiles((current) => current.filter((tile) => tile.id !== tileId));
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
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (phaseRef.current !== "playing" || mode !== "letter") {
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
  }, [hitTile, mode]);

  useEffect(() => {
    let animationFrameId = 0;

    const tick = (now: number) => {
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

      setTiles((currentTiles) => {
        let nextTiles = currentTiles
          .map((tile) => ({
            ...tile,
            y: ((now - tile.spawnedAt) / settings.fallDurationMs) * 100,
          }))
          .filter((tile) => tile.y < 100);

        const missedCount = currentTiles.length - nextTiles.length;

        if (missedCount > 0) {
          registerMiss(missedCount);
        }

        if (
          now - lastSpawnedAtRef.current >= settings.spawnEveryMs &&
          nextTiles.length < settings.maxActiveTiles
        ) {
          const nextTile = createTile(characters, now, lastTileXRef.current);
          lastTileXRef.current = nextTile.x;
          lastSpawnedAtRef.current = now;
          nextTiles = [...nextTiles, nextTile];
        }

        return nextTiles;
      });

      animationFrameId = window.requestAnimationFrame(tick);
    };

    animationFrameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [characters, completeSession, durationSeconds, registerMiss, settings]);

  return {
    phase,
    tiles,
    stats,
    timeLeft,
    missFlashKey,
    comboMultiplier: getComboMultiplier(stats.combo),
    hitTile,
  };
}
