import { Tile } from "@/components/Tile";
import type { TileState } from "@/types";

type GameBoardProps = {
  isTouchMode?: boolean;
  tiles: Array<TileState>;
  countdownValue?: number;
  phase?: "countdown" | "playing" | "complete";
  missFlashKey: number;
  onHitTile: (tileId: string) => void;
  typedText?: string;
};

export function GameBoard({
  countdownValue = 0,
  isTouchMode = false,
  phase = "playing",
  tiles,
  missFlashKey,
  onHitTile,
  typedText,
}: GameBoardProps) {
  const countdownLabel = countdownValue > 0 ? countdownValue : "GO";

  return (
    <section
      className="relative min-h-140 flex-1 overflow-hidden rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) shadow-[0_22px_90px_var(--color-shadow)] data-[touch=true]:min-h-[520px]"
      data-touch={isTouchMode ? "true" : "false"}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-(--color-bg-overlay) to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 border-t border-(--color-border-subtle) bg-linear-to-t from-(--color-bg-overlay) to-transparent" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 data-[flash=true]:animate-[kw-miss-flash_220ms_ease-out]"
        data-flash={missFlashKey > 0 ? "true" : "false"}
        key={missFlashKey}
      />
      {tiles.map((tile) => (
        <Tile
          key={tile.id}
          isTouchMode={isTouchMode}
          onHit={onHitTile}
          tile={tile}
          typedText={typedText}
        />
      ))}
      {phase !== "playing" ? (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-(--color-backdrop)">
          <div className="text-center">
            <p
              className="animate-[kw-countdown-pop_520ms_ease-out_both] text-7xl leading-none font-black text-(--color-accent) tabular-nums sm:text-8xl"
              key={`${phase}-${countdownLabel}`}
            >
              {phase === "countdown" ? countdownLabel : "TIME"}
            </p>
            <p className="mt-4 text-xs font-bold tracking-[0.24em] text-(--color-text-secondary) uppercase">
              {phase === "countdown" ? "Get ready" : "Results loading"}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
