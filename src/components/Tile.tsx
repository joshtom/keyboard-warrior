import type { TileState } from "@/types";

type TileProps = {
  tile: TileState;
  onHit: (tileId: string) => void;
  typedText?: string;
};

export function Tile({ tile, onHit, typedText = "" }: TileProps) {
  const matchedLength =
    typedText && tile.value.startsWith(typedText) ? typedText.length : 0;
  const matchedText = tile.value.slice(0, matchedLength);
  const remainingText = tile.value.slice(matchedLength);

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
      {matchedLength > 0 ? (
        <span>
          <span className="text-(--color-accent)">{matchedText}</span>
          <span>{remainingText}</span>
        </span>
      ) : (
        tile.value
      )}
    </button>
  );
}
