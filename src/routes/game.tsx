import { createRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { CountdownTimer } from "@/components/CountdownTimer";
import { GameBoard } from "@/components/GameBoard";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { Button } from "@/components/ui/button";
import { difficultyProfiles } from "@/data/difficultyProfiles";
import { useIsCoarsePointer } from "@/hooks/useIsCoarsePointer";
import { useSoundEngine } from "@/hooks/useSoundEngine";
import { useSettings } from "@/hooks/useSettings";
import { rootRoute } from "@/routes/root";
import { saveLatestGameResult } from "@/utils/gameResultStorage";
import { useGameEngine } from "@/hooks/useGameEngine";
import type { Difficulty, GameMode } from "@/types";

type GameSearch = {
  mode?: GameMode;
  difficulty?: Difficulty;
};

function GameRoute() {
  const search = useSearch({ from: "/game" }) as GameSearch;
  const navigate = useNavigate();
  const isCoarsePointer = useIsCoarsePointer();
  const sound = useSoundEngine();
  const { settings } = useSettings();
  const requestedMode = search.mode ?? "letter";
  const wordModeFallback = isCoarsePointer && requestedMode === "word";
  const mode: GameMode =
    wordModeFallback ? "letter" : requestedMode;
  const difficulty = search.difficulty ?? "easy";
  const difficultyProfile = difficultyProfiles[difficulty];
  const durationSeconds = settings.sessionDurationSeconds;
  const game = useGameEngine({
    mode,
    difficulty,
    durationSeconds,
    isTouchMode: isCoarsePointer,
    onComboBreak: sound.playComboBreak,
    onComplete: (result) => {
      saveLatestGameResult(result);
      navigate({ to: "/results" });
    },
    onHit: (streakCount) => {
      sound.playHit();

      if (streakCount >= 5) {
        sound.playCombo(streakCount);
      }
    },
    onMiss: sound.playMiss,
    onSessionEnd: sound.playSessionEnd,
  });
  const lastTimeLeftRef = useRef(game.timeLeft);

  useEffect(() => {
    if (
      game.timeLeft !== lastTimeLeftRef.current &&
      game.timeLeft > 0 &&
      game.timeLeft <= 3
    ) {
      sound.playCountdownTick();
    }

    lastTimeLeftRef.current = game.timeLeft;
  }, [game.timeLeft, sound]);
  const wordMatches =
    mode === "word" && game.typedText
      ? game.tiles.filter((tile) => tile.value.startsWith(game.typedText)).length
      : 0;

  return (
    <main className="flex min-h-screen flex-col gap-4 px-4 py-4 sm:px-6">
      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-(--color-accent) uppercase">
            {mode} / {difficultyProfile.label}
          </p>
          <h1 className="mt-1 text-2xl font-black text-(--color-text-primary)">
            Game Session
          </h1>
          <p className="mt-1 text-xs text-(--color-text-secondary)">
            {difficultyProfile.characterSummary} ·{" "}
            {isCoarsePointer
              ? "faster tap stream"
              : difficultyProfile.pressureSummary}
          </p>
          {isCoarsePointer ? (
            <p className="mt-1 text-xs font-semibold text-(--color-accent)">
              Tap tiles directly.
              {wordModeFallback ? " Word Mode is desktop-only." : ""}
            </p>
          ) : null}
        </div>
        <Button
          onClick={() => {
            sound.playButtonClick();
            navigate({ to: "/" });
          }}
          size="sm"
          variant="ghost"
        >
          Home
        </Button>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-4 sm:grid-cols-[1fr_auto]">
        <ScoreDisplay
          comboMultiplier={game.comboMultiplier}
          stats={game.stats}
        />
        <CountdownTimer timeLeft={game.timeLeft} />
      </section>

      {mode === "word" ? (
        <section className="mx-auto grid w-full max-w-6xl gap-3 rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) px-4 py-3 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-(--color-text-muted) uppercase">
              Typed
            </p>
            <p className="mt-1 min-h-7 text-xl font-black text-(--color-accent)">
              {game.typedText || ""}
            </p>
          </div>
          <div className="rounded-(--radius) border border-(--color-border-subtle) bg-(--color-bg-overlay) px-3 py-2">
            <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-(--color-text-muted) uppercase">
              Matches
            </p>
            <p className="mt-1 text-lg font-black text-(--color-text-primary)">
              {wordMatches}
            </p>
          </div>
        </section>
      ) : null}

      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <GameBoard
          isTouchMode={isCoarsePointer}
          missFlashKey={game.missFlashKey}
          onHitTile={game.hitTile}
          typedText={mode === "word" ? game.typedText : ""}
          tiles={game.tiles}
        />
      </div>
    </main>
  );
}

export const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/game",
  validateSearch: (search: Record<string, unknown>): GameSearch => ({
    mode: search.mode === "word" ? "word" : "letter",
    difficulty:
      search.difficulty === "medium" || search.difficulty === "hard"
        ? search.difficulty
        : "easy",
  }),
  component: GameRoute,
});
