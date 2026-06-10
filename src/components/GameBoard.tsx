import { Tile } from "@/components/Tile";
import type { TileState } from "@/types";

type GameBoardProps = {
  isTouchMode?: boolean;
  tiles: Array<TileState>;
  missFlashKey: number;
  onHitTile: (tileId: string) => void;
  typedText?: string;
};

export function GameBoard({
  isTouchMode = false,
  tiles,
  missFlashKey,
  onHitTile,
  typedText,
}: GameBoardProps) {
  return (
    <section
      className="relative min-h-[560px] flex-1 overflow-hidden rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) shadow-[0_22px_90px_var(--color-shadow)] data-[touch=true]:min-h-[520px]"
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
    </section>
  );
}
