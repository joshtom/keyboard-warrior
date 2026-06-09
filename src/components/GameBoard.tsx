import { Tile } from "@/components/Tile";
import type { TileState } from "@/types";

type GameBoardProps = {
  tiles: Array<TileState>;
  missFlashKey: number;
  onHitTile: (tileId: string) => void;
};

export function GameBoard({ tiles, missFlashKey, onHitTile }: GameBoardProps) {
  return (
    <section className="relative min-h-[560px] flex-1 overflow-hidden rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) shadow-[0_22px_90px_var(--color-shadow)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-(--color-bg-overlay) to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 border-t border-(--color-border-subtle) bg-linear-to-t from-(--color-bg-overlay) to-transparent" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 data-[flash=true]:animate-[kw-miss-flash_220ms_ease-out]"
        data-flash={missFlashKey > 0 ? "true" : "false"}
        key={missFlashKey}
      />
      {tiles.map((tile) => (
        <Tile key={tile.id} onHit={onHitTile} tile={tile} />
      ))}
      {tiles.length === 0 ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-(--color-text-muted)">
          Get ready. The next key is dropping.
        </div>
      ) : null}
    </section>
  );
}
