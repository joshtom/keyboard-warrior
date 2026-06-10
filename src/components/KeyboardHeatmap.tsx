import { getHeatmapColorVariable } from "@/utils/heatmap";

type KeyboardHeatmapProps = {
  averageReactionMs: number;
  perKeyAverageMs: Record<string, number>;
};

type HeatmapKey = {
  label: string;
};

const keyRows: Array<Array<HeatmapKey>> = [
  "1234567890".split("").map((label) => ({ label })),
  "qwertyuiop".split("").map((label) => ({ label })),
  "asdfghjkl".split("").map((label) => ({ label })),
  "zxcvbnm".split("").map((label) => ({ label })),
];

function getKeyAverage(label: string, perKeyAverageMs: Record<string, number>) {
  return perKeyAverageMs[label] ?? perKeyAverageMs[label.toUpperCase()];
}

export function KeyboardHeatmap({
  averageReactionMs,
  perKeyAverageMs,
}: KeyboardHeatmapProps) {
  return (
    <div className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) p-2.5 sm:p-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-black text-(--color-text-primary)">
            Keyboard Heatmap
          </h2>
          <p className="mt-1 text-xs leading-5 text-(--color-text-secondary)">
            Green is faster than your average, red is slower.
          </p>
        </div>
        <span className="text-xs font-bold text-(--color-accent)">
          {averageReactionMs}ms avg
        </span>
      </div>

      <div className="mt-2 space-y-1 overflow-x-auto pb-1 sm:mt-3 sm:space-y-1.5">
        {keyRows.map((row, rowIndex) => (
          <div
            className="grid min-w-[320px] gap-1 sm:min-w-[440px] sm:gap-1.5"
            key={row.map((item) => item.label).join("")}
            style={{
              gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
              paddingLeft: `${rowIndex * 10}px`,
            }}
          >
            {row.map((keyItem) => {
              const reactionMs = getKeyAverage(
                keyItem.label,
                perKeyAverageMs,
              );

              return (
                <div
                  aria-label={`${keyItem.label} ${
                    reactionMs ? `${reactionMs}ms` : "not encountered"
                  }`}
                  className="flex h-6 items-center justify-center rounded-(--radius) border border-(--color-border-subtle) text-[0.58rem] font-black text-(--color-text-inverse) shadow-[0_10px_24px_var(--color-shadow)] sm:h-8 sm:text-[0.68rem]"
                  key={keyItem.label}
                  style={{
                    backgroundColor: getHeatmapColorVariable(
                      reactionMs,
                      averageReactionMs,
                    ),
                  }}
                  title={
                    reactionMs
                      ? `${keyItem.label}: ${reactionMs}ms`
                      : `${keyItem.label}: not encountered`
                  }
                >
                  {keyItem.label.toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-2 text-xs text-(--color-text-secondary) sm:mt-3 sm:gap-3">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-(--color-heatmap-fast)" />
          Fast
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-(--color-heatmap-avg)" />
          Average
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-(--color-heatmap-slow)" />
          Slow
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-(--color-heatmap-empty)" />
          Empty
        </span>
      </div>
    </div>
  );
}
