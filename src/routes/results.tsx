import { Link, createRoute } from "@tanstack/react-router";
import { CalendarDays, Gauge, Home, RotateCcw, Settings } from "lucide-react";
import { useState } from "react";

import { KeyboardHeatmap } from "@/components/KeyboardHeatmap";
import { Button } from "@/components/ui/button";
import { difficultyProfiles } from "@/data/difficultyProfiles";
import { useSoundEngine } from "@/hooks/useSoundEngine";
import { useSettings } from "@/hooks/useSettings";
import { rootRoute } from "@/routes/root";
import type { GameResult } from "@/types";
import { readLatestGameResult } from "@/utils/gameResultStorage";

type StatCard = {
  label: string;
  value: string;
  detail: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function getTopReactionEntries(result: GameResult) {
  return Object.entries(result.perKeyAverageMs)
    .sort(([, firstMs], [, secondMs]) => firstMs - secondMs)
    .slice(0, 6);
}

function ResultsRoute() {
  const [result] = useState<GameResult | null>(() => readLatestGameResult());
  const sound = useSoundEngine();
  const { openSettings } = useSettings();
  const difficultyProfile = result ? difficultyProfiles[result.difficulty] : null;
  const statCards: Array<StatCard> = result
    ? [
        {
          label: "Accuracy",
          value: `${result.accuracy}%`,
          detail: `${result.hits} hits / ${result.misses} misses`,
        },
        {
          label: "Avg Speed",
          value: `${result.averageReactionMs}ms`,
          detail: "Mean successful reaction",
        },
        {
          label: "Longest Streak",
          value: `${result.longestCombo}`,
          detail: "Best unbroken combo",
        },
        {
          label: "Total Hits",
          value: `${result.hits}`,
          detail: "Tiles cleared",
        },
        {
          label: "Misses",
          value: `${result.misses}`,
          detail: "Tiles escaped",
        },
        {
          label: "Duration",
          value: `${result.durationSeconds}s`,
          detail: `${result.mode} / ${difficultyProfile?.label ?? result.difficulty}`,
        },
      ]
    : [];
  const topReactionEntries = result ? getTopReactionEntries(result) : [];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-3 sm:px-8 sm:py-4 lg:px-10">
      <header className="flex items-center justify-between">
        <Link
          aria-label="Keyboard Warrior home"
          className="text-sm font-bold tracking-[0.18em] text-(--color-text-primary) uppercase"
          to="/"
        >
          KW
        </Link>
        <div className="flex items-center gap-2">
          <Button
            aria-label="Open settings"
            onClick={() => {
              sound.playButtonClick();
              openSettings();
            }}
            size="icon"
            variant="ghost"
          >
            <Settings aria-hidden="true" />
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link onClick={sound.playButtonClick} to="/">
              <Home aria-hidden="true" />
              Home
            </Link>
          </Button>
        </div>
      </header>

      <section className="grid flex-1 gap-3 py-3 sm:gap-4 sm:py-4 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) p-3 shadow-[0_22px_90px_var(--color-shadow)] sm:p-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-(--color-accent) uppercase">
              Results
            </p>
            <div className="mt-4">
              <p className="text-sm text-(--color-text-secondary)">
                Final Score
              </p>
              <h1 className="mt-1 text-4xl leading-none font-black text-(--color-text-primary) tabular-nums sm:text-6xl">
                {result ? result.score : 0}
              </h1>
            </div>
          </div>

          {result ? (
            <dl className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) p-2.5">
                <dt className="flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.16em] text-(--color-text-muted) uppercase">
                  <Gauge aria-hidden="true" className="h-3.5 w-3.5" />
                  Mode
                </dt>
                <dd className="mt-1.5 text-sm font-black text-(--color-text-primary) uppercase">
                  {result.mode} / {difficultyProfile?.label}
                </dd>
              </div>
              <div className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) p-2.5">
                <dt className="flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.16em] text-(--color-text-muted) uppercase">
                  <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                  Played
                </dt>
                <dd className="mt-1.5 text-sm font-black text-(--color-text-primary)">
                  {formatDate(result.endedAt)}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-6 text-sm leading-6 text-(--color-text-secondary)">
              Finish a session to see score, reaction timing, accuracy, and
              streak data here.
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
            <Button asChild>
              <Link
                onClick={sound.playButtonClick}
                to="/game"
                search={{
                  mode: result?.mode ?? "letter",
                  difficulty: result?.difficulty ?? "easy",
                }}
              >
                <RotateCcw aria-hidden="true" />
                Play Again
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link onClick={sound.playButtonClick} to="/">Home</Link>
            </Button>
          </div>
        </div>

        {result ? (
          <div className="grid gap-2 sm:gap-3 lg:grid-rows-[auto_auto_1fr]">
            <dl className="grid grid-cols-3 gap-2">
              {statCards.map((item) => (
                <div
                  className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) p-2 sm:p-3"
                  key={item.label}
                >
                  <dt className="text-[0.58rem] font-semibold tracking-[0.16em] text-(--color-text-muted) uppercase sm:text-[0.65rem]">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm font-black text-(--color-text-primary) tabular-nums sm:mt-1.5 sm:text-xl">
                    {item.value}
                  </dd>
                  <p className="mt-1 hidden text-xs leading-4 text-(--color-text-secondary) sm:block">
                    {item.detail}
                  </p>
                </div>
              ))}
            </dl>

            <div className="flex flex-col flex-wrap items-start gap-2 rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) p-3 sm:flex-row sm:items-center">
              <h2 className="shrink-0 text-sm font-black text-(--color-text-primary)">
                Fastest
              </h2>
              <div className="flex min-w-0 flex-1 flex-wrap gap-2 overflow-hidden">
                {topReactionEntries.length > 0 ? (
                  topReactionEntries.slice(0, 4).map(([key, averageMs]) => (
                    <div
                      className="flex min-w-0 items-center gap-2 rounded-(--radius) border border-(--color-border-subtle) bg-(--color-bg-overlay) px-2.5 py-1.5"
                      key={key}
                    >
                      <span className="max-w-16 truncate text-xs font-black text-(--color-text-primary)">
                        {key}
                      </span>
                      <span className="shrink-0 text-xs font-bold text-(--color-accent)">
                        {averageMs}ms
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-(--color-text-secondary)">
                    No successful hits recorded.
                  </p>
                )}
              </div>
              <div className="shrink-0">
                <span className="text-xs font-bold text-(--color-accent)">
                  {topReactionEntries.length}
                </span>
              </div>
            </div>

            <KeyboardHeatmap
              averageReactionMs={result.averageReactionMs}
              perKeyAverageMs={result.perKeyAverageMs}
            />
          </div>
        ) : (
          <div className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) p-5">
            <h2 className="text-lg font-black text-(--color-text-primary)">
              No Result Yet
            </h2>
            <p className="mt-2 text-sm leading-6 text-(--color-text-secondary)">
              Play a session first, then this page becomes your post-run
              breakdown.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: ResultsRoute,
});
