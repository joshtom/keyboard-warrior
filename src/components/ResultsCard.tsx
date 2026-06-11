import { forwardRef, type CSSProperties } from "react";

import type { GameResult } from "@/types";

type ResultsCardProps = {
  difficultyLabel: string;
  result: GameResult;
};

const scoreTextStyle: CSSProperties = {
  fontSize: 190,
  textShadow: "0 10px 0 var(--color-shadow)",
};

const statTextStyle: CSSProperties = {
  fontSize: 72,
  textShadow: "0 7px 0 var(--color-shadow)",
};

export const ResultsCard = forwardRef<HTMLDivElement, ResultsCardProps>(
  ({ difficultyLabel, result }, ref) => (
    <article
      className="overflow-hidden border border-(--color-border) bg-(--color-bg-elevated) p-16 font-mono text-(--color-text-primary) shadow-[0_28px_120px_var(--color-shadow)]"
      ref={ref}
      style={{
        borderRadius: 32,
        height: 1080,
        width: 1080,
      }}
    >
      <div className="flex h-full flex-col justify-between">
        <section>
          <p className="text-4xl font-black tracking-[0.24em] text-(--color-text-secondary) uppercase">
            Final Score
          </p>
          <p
            className="mt-12 leading-none font-black tabular-nums text-(--color-accent)"
            style={scoreTextStyle}
          >
            {result.score}
          </p>

          <div className="mt-16 flex flex-wrap gap-5">
            <span className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) px-8 py-6 text-3xl font-black text-(--color-text-primary) uppercase shadow-[0_12px_0_var(--color-shadow)]">
              {result.mode} mode
            </span>
            <span className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) px-8 py-6 text-3xl font-black text-(--color-text-primary) uppercase shadow-[0_12px_0_var(--color-shadow)]">
              {difficultyLabel}
            </span>
          </div>
        </section>

        <dl className="grid grid-cols-2 gap-x-20 gap-y-12">
          <div>
            <dt className="text-3xl font-black tracking-[0.22em] text-(--color-text-muted) uppercase">
              Accuracy
            </dt>
            <dd
              className="mt-5 leading-none font-black tabular-nums"
              style={statTextStyle}
            >
              {result.accuracy}%
            </dd>
          </div>
          <div>
            <dt className="text-3xl font-black tracking-[0.22em] text-(--color-text-muted) uppercase">
              Avg Speed
            </dt>
            <dd
              className="mt-5 leading-none font-black tabular-nums"
              style={statTextStyle}
            >
              {result.averageReactionMs}ms
            </dd>
          </div>
          <div>
            <dt className="text-3xl font-black tracking-[0.22em] text-(--color-text-muted) uppercase">
              Hits
            </dt>
            <dd
              className="mt-5 leading-none font-black tabular-nums"
              style={statTextStyle}
            >
              {result.hits}
            </dd>
          </div>
          <div>
            <dt className="text-3xl font-black tracking-[0.22em] text-(--color-text-muted) uppercase">
              Longest Combo
            </dt>
            <dd
              className="mt-5 leading-none font-black tabular-nums"
              style={statTextStyle}
            >
              {result.longestCombo}
            </dd>
          </div>
        </dl>

        <p className="text-right text-2xl font-black tracking-[0.2em] text-(--color-text-muted) uppercase">
          Keyboard Warrior
        </p>
      </div>
    </article>
  ),
);

ResultsCard.displayName = "ResultsCard";
