import type { GameStats } from "@/types";

type ScoreDisplayProps = {
  stats: GameStats;
  comboMultiplier: number;
  pulseKey?: number;
};

export function ScoreDisplay({
  comboMultiplier,
  pulseKey = 0,
  stats,
}: ScoreDisplayProps) {
  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated)">
      <div className="border-r border-(--color-border-subtle) px-4 py-3">
        <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-(--color-text-muted) uppercase">
          Score
        </p>
        <p className="mt-1 text-xl font-black tabular-nums text-(--color-text-primary)">
          {stats.score}
        </p>
      </div>
      <div className="border-r border-(--color-border-subtle) px-4 py-3">
        <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-(--color-text-muted) uppercase">
          Combo
        </p>
        <p
          className="mt-1 text-xl font-black tabular-nums text-(--color-accent) data-[pulse=true]:animate-[kw-combo-pop_240ms_ease-out]"
          data-pulse={pulseKey > 0 ? "true" : "false"}
          key={pulseKey}
        >
          {stats.combo}
        </p>
      </div>
      <div className="px-4 py-3">
        <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-(--color-text-muted) uppercase">
          Mult
        </p>
        <p className="mt-1 text-xl font-black tabular-nums text-(--color-text-primary)">
          {comboMultiplier}x
        </p>
      </div>
    </div>
  );
}
