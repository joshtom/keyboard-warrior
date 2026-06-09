import { useCallback, useRef } from "react";

import type { ReactionSummary, TileState } from "@/types";

type ReactionSamples = Record<string, Array<number>>;

function average(values: Array<number>) {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(
    values.reduce((total, value) => total + value, 0) / values.length,
  );
}

export function useReactionTracker() {
  const reactionSamplesRef = useRef<ReactionSamples>({});

  const recordReaction = useCallback((tile: TileState) => {
    const reactionMs = Math.max(0, Math.round(performance.now() - tile.spawnedAt));
    const trackedKeys = Array.from(
      new Set(
        tile.value
          .split("")
          .map((character) => character.toLowerCase())
          .filter((character) => /^[a-z0-9]$/.test(character)),
      ),
    );

    reactionSamplesRef.current = trackedKeys.reduce<ReactionSamples>(
      (nextSamples, key) => ({
        ...nextSamples,
        [key]: [...(nextSamples[key] ?? []), reactionMs],
      }),
      reactionSamplesRef.current,
    );
  }, []);

  const getReactionSummary = useCallback((): ReactionSummary => {
    const entries = Object.entries(reactionSamplesRef.current);
    const allSamples = entries.flatMap(([, samples]) => samples);

    return {
      averageReactionMs: average(allSamples),
      perKeyAverageMs: Object.fromEntries(
        entries.map(([key, samples]) => [key, average(samples)]),
      ),
    };
  }, []);

  return {
    recordReaction,
    getReactionSummary,
  };
}
