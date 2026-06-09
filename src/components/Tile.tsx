import type { TileState } from "@/types";

type TileProps = {
  tile: TileState;
  onHit: (tileId: string) => void;
};

export function Tile({ tile, onHit }: TileProps) {
  return (
    <button
      aria-label={`Hit ${tile.value}`}
      className="absolute flex h-14 min-w-14 -translate-x-1/2 items-center justify-center rounded-(--radius) border border-(--color-tile-border) bg-(--color-tile-bg) px-4 text-xl font-black text-(--color-tile-text) shadow-[0_12px_34px_var(--color-shadow)] transition-[border-color,background,transform] duration-150 ease-out hover:border-(--color-accent) active:scale-95 sm:h-16 sm:min-w-16 sm:text-2xl"
      onClick={() => onHit(tile.id)}
      style={{
        left: `${tile.x}%`,
        top: `${tile.y}%`,
      }}
      type="button"
    >
      {tile.value}
    </button>
  );
}
