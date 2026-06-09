import { Link, createRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { rootRoute } from "@/routes/root";
import type { GameResult } from "@/types";
import { readLatestGameResult } from "@/utils/gameResultStorage";

function ResultsRoute() {
  const [result] = useState<GameResult | null>(() => readLatestGameResult());

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <section className="w-full max-w-3xl rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) p-6 text-center shadow-[0_22px_90px_var(--color-shadow)]">
        <p className="text-xs font-semibold tracking-[0.22em] text-(--color-accent) uppercase">
          Results
        </p>
        <h1 className="mt-4 text-3xl font-black text-(--color-text-primary)">
          {result ? result.score : "Scorecard Slot Reserved"}
        </h1>
        {result ? (
          <dl className="mt-6 grid grid-cols-2 gap-3 text-left sm:grid-cols-3">
            <div className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) p-3">
              <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-(--color-text-muted) uppercase">
                Accuracy
              </dt>
              <dd className="mt-2 text-lg font-black text-(--color-text-primary)">
                {result.accuracy}%
              </dd>
            </div>
            <div className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) p-3">
              <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-(--color-text-muted) uppercase">
                Hits
              </dt>
              <dd className="mt-2 text-lg font-black text-(--color-text-primary)">
                {result.hits}
              </dd>
            </div>
            <div className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) p-3">
              <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-(--color-text-muted) uppercase">
                Avg Speed
              </dt>
              <dd className="mt-2 text-lg font-black text-(--color-text-primary)">
                {result.averageReactionMs}ms
              </dd>
            </div>
            <div className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) p-3">
              <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-(--color-text-muted) uppercase">
                Misses
              </dt>
              <dd className="mt-2 text-lg font-black text-(--color-text-primary)">
                {result.misses}
              </dd>
            </div>
            <div className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) p-3">
              <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-(--color-text-muted) uppercase">
                Streak
              </dt>
              <dd className="mt-2 text-lg font-black text-(--color-text-primary)">
                {result.longestCombo}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-(--color-text-secondary)">
            Finish a session to see score, hits, misses, and accuracy here.
          </p>
        )}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/game" search={{ mode: "letter", difficulty: "easy" }}>
              Play Again
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/">Home</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

export const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: ResultsRoute,
});
