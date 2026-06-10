import { forwardRef } from "react";

import { KeyboardHeatmap } from "@/components/KeyboardHeatmap";
import type { GameResult } from "@/types";

type ResultsCardProps = {
  difficultyLabel: string;
  result: GameResult;
};

function formatCardDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export const ResultsCard = forwardRef<HTMLDivElement, ResultsCardProps>(
  ({ difficultyLabel, result }, ref) => (
    <article
      className="overflow-hidden border border-(--color-border) bg-(--color-bg) p-10 font-mono text-(--color-text-primary)"
      ref={ref}
      style={{
        height: 630,
        width: 1200,
      }}
    >
      <div className="flex h-full flex-col">
        <header className="flex items-start justify-between gap-8">
          <div>
            <p className="text-sm font-bold tracking-[0.24em] text-(--color-accent) uppercase">
              Keyboard Warrior
            </p>
            <h2 className="mt-3 text-5xl leading-none font-black">
              How well do you know your keyboard?
            </h2>
          </div>
          <div className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) px-4 py-3 text-right">
            <p className="text-xs font-semibold tracking-[0.18em] text-(--color-text-muted) uppercase">
              Played
            </p>
            <p className="mt-1 text-lg font-black">
              {formatCardDate(result.endedAt)}
            </p>
          </div>
        </header>

        <div className="mt-8 grid min-h-0 flex-1 grid-cols-[0.8fr_1.2fr] gap-8">
          <section className="flex flex-col justify-between rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) p-6">
            <div>
              <p className="text-sm font-bold tracking-[0.2em] text-(--color-text-secondary) uppercase">
                Final Score
              </p>
              <p className="mt-3 text-8xl leading-none font-black tabular-nums text-(--color-accent)">
                {result.score}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) px-3 py-2 text-sm font-black uppercase">
                  {result.mode} mode
                </span>
                <span className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) px-3 py-2 text-sm font-black uppercase">
                  {difficultyLabel}
                </span>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-xs font-bold tracking-[0.16em] text-(--color-text-muted) uppercase">
                  Accuracy
                </dt>
                <dd className="mt-1 text-3xl font-black tabular-nums">
                  {result.accuracy}%
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold tracking-[0.16em] text-(--color-text-muted) uppercase">
                  Avg Speed
                </dt>
                <dd className="mt-1 text-3xl font-black tabular-nums">
                  {result.averageReactionMs}ms
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold tracking-[0.16em] text-(--color-text-muted) uppercase">
                  Hits
                </dt>
                <dd className="mt-1 text-3xl font-black tabular-nums">
                  {result.hits}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold tracking-[0.16em] text-(--color-text-muted) uppercase">
                  Longest Combo
                </dt>
                <dd className="mt-1 text-3xl font-black tabular-nums">
                  {result.longestCombo}
                </dd>
              </div>
            </dl>
          </section>

          <section className="min-w-0">
            <KeyboardHeatmap
              averageReactionMs={result.averageReactionMs}
              perKeyAverageMs={result.perKeyAverageMs}
            />
            <div className="mt-4 rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) px-4 py-3">
              <p className="text-sm leading-6 text-(--color-text-secondary)">
                Green keys were faster than the session average. Red keys need
                a rematch.
              </p>
            </div>
          </section>
        </div>
      </div>
    </article>
  ),
);

ResultsCard.displayName = "ResultsCard";
