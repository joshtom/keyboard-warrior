type CountdownTimerProps = {
  timeLeft: number;
};

export function CountdownTimer({ timeLeft }: CountdownTimerProps) {
  return (
    <div className="min-w-24 rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) px-4 py-3 text-center">
      <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-(--color-text-muted) uppercase">
        Time
      </p>
      <p className="mt-1 text-2xl font-black tabular-nums text-(--color-text-primary)">
        {timeLeft}
      </p>
    </div>
  );
}
