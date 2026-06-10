import type { TileState } from "@/types";

type TileProps = {
  tile: TileState;
  onHit: (tileId: string) => void;
  isTouchMode?: boolean;
  typedText?: string;
};

export function Tile({
  tile,
  onHit,
  isTouchMode = false,
  typedText = "",
}: TileProps) {
  const matchedLength =
    typedText && tile.value.startsWith(typedText) ? typedText.length : 0;
  const matchedText = tile.value.slice(0, matchedLength);
  const remainingText = tile.value.slice(matchedLength);

  return (
    <button
      aria-label={`Hit ${tile.value}`}
      className="absolute flex h-20 min-w-20 -translate-x-1/2 touch-manipulation items-center justify-center rounded-(--radius) border border-(--color-tile-border) bg-(--color-tile-bg) px-4 text-3xl font-black text-(--color-tile-text) shadow-[0_12px_34px_var(--color-shadow)] transition-[border-color,background,transform] duration-150 ease-out hover:border-(--color-accent) active:scale-95 sm:h-16 sm:min-w-16 sm:text-2xl data-[touch=true]:h-20 data-[touch=true]:min-w-20 data-[touch=true]:text-3xl"
      data-touch={isTouchMode ? "true" : "false"}
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
