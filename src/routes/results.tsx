import { Link, createRoute } from "@tanstack/react-router";
import { CalendarDays, Gauge, Home, RotateCcw, Trophy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
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
          detail: `${result.mode} / ${result.difficulty}`,
        },
      ]
    : [];
  const topReactionEntries = result ? getTopReactionEntries(result) : [];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-8 lg:px-10">
      <header className="flex items-center justify-between">
        <Link
          aria-label="Keyboard Warrior home"
          className="text-sm font-bold tracking-[0.18em] text-(--color-text-primary) uppercase"
          to="/"
        >
          KW
        </Link>
        <Button asChild size="sm" variant="ghost">
          <Link to="/">
            <Home aria-hidden="true" />
            Home
          </Link>
        </Button>
      </header>

      <section className="grid flex-1 items-center gap-5 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) p-5 shadow-[0_22px_90px_var(--color-shadow)]">
          <p className="text-xs font-semibold tracking-[0.22em] text-(--color-accent) uppercase">
            Results
          </p>
          <div className="mt-6 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-(--radius) border border-(--color-border-subtle) bg-(--color-bg-overlay) text-(--color-accent)">
              <Trophy aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-(--color-text-secondary)">
                Final Score
              </p>
              <h1 className="mt-1 text-6xl leading-none font-black text-(--color-text-primary) tabular-nums sm:text-7xl">
                {result ? result.score : 0}
              </h1>
            </div>
          </div>

          {result ? (
            <dl className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) p-3">
                <dt className="flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.16em] text-(--color-text-muted) uppercase">
                  <Gauge aria-hidden="true" className="h-3.5 w-3.5" />
                  Mode
                </dt>
                <dd className="mt-2 text-sm font-black text-(--color-text-primary) uppercase">
                  {result.mode}
                </dd>
              </div>
              <div className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) p-3">
                <dt className="flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.16em] text-(--color-text-muted) uppercase">
                  <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                  Played
                </dt>
                <dd className="mt-2 text-sm font-black text-(--color-text-primary)">
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

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link
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
              <Link to="/">Home</Link>
            </Button>
          </div>
        </div>

        {result ? (
          <div className="space-y-4">
            <dl className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {statCards.map((item) => (
                <div
                  className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) p-4"
                  key={item.label}
                >
                  <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-(--color-text-muted) uppercase">
                    {item.label}
                  </dt>
                  <dd className="mt-2 text-2xl font-black text-(--color-text-primary) tabular-nums">
                    {item.value}
                  </dd>
                  <p className="mt-2 text-xs leading-5 text-(--color-text-secondary)">
                    {item.detail}
                  </p>
                </div>
              ))}
            </dl>

            <div className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-black text-(--color-text-primary)">
                    Fastest Reactions
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-(--color-text-secondary)">
                    Best average timings from this session.
                  </p>
                </div>
                <span className="text-xs font-bold text-(--color-accent)">
                  {topReactionEntries.length}
                </span>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {topReactionEntries.length > 0 ? (
                  topReactionEntries.map(([key, averageMs]) => (
                    <div
                      className="flex items-center justify-between gap-3 rounded-(--radius) border border-(--color-border-subtle) bg-(--color-bg-overlay) px-3 py-2"
                      key={key}
                    >
                      <span className="max-w-36 truncate text-sm font-black text-(--color-text-primary)">
                        {key}
                      </span>
                      <span className="shrink-0 text-sm font-bold text-(--color-accent)">
                        {averageMs}ms
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-(--color-text-secondary)">
                    No successful hits were recorded.
                  </p>
                )}
              </div>
            </div>
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
