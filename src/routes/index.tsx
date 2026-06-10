import { createRoute, useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  Gauge,
  Keyboard,
  Settings,
  TimerReset,
  Type,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { difficultyProfiles } from "@/data/difficultyProfiles";
import { useIsCoarsePointer } from "@/hooks/useIsCoarsePointer";
import { useSoundEngine } from "@/hooks/useSoundEngine";
import { useSettings } from "@/hooks/useSettings";
import { rootRoute } from "@/routes/root";
import type { Difficulty, GameMode } from "@/types";

type ModeOption = {
  value: GameMode;
  label: string;
  detail: string;
  icon: typeof Keyboard;
  desktopOnly?: boolean;
};

type DifficultyOption = {
  value: Difficulty;
  label: string;
  detail: string;
  metric: string;
  icon: typeof Gauge;
};

const modes: Array<ModeOption> = [
  {
    value: "letter",
    label: "Letter",
    detail: "Single-key reflex runs",
    icon: Keyboard,
  },
  {
    value: "word",
    label: "Word",
    detail: "Full-word typing trials",
    icon: Type,
    desktopOnly: true,
  },
];

const difficultyBaseOptions: Array<{
  value: Difficulty;
  icon: typeof Gauge;
}> = [
  { value: "easy", icon: TimerReset },
  { value: "medium", icon: Gauge },
  { value: "hard", icon: Zap },
];

const difficulties: Array<DifficultyOption> = difficultyBaseOptions.map((item) => ({
  ...item,
  label: difficultyProfiles[item.value].label,
  detail: difficultyProfiles[item.value].detail,
  metric: difficultyProfiles[item.value].metric,
}));

function HomeRoute() {
  const navigate = useNavigate();
  const isCoarsePointer = useIsCoarsePointer();
  const sound = useSoundEngine();
  const { openSettings, settings } = useSettings();
  const [mode, setMode] = useState<GameMode>("letter");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const playableMode: GameMode = isCoarsePointer ? "letter" : mode;

  const visibleModes = useMemo(
    () => modes.filter((item) => !isCoarsePointer || !item.desktopOnly),
    [isCoarsePointer],
  );

  const handlePlay = () => {
    sound.playButtonClick();
    navigate({
      to: "/game",
      search: { mode: playableMode, difficulty },
    });
  };

  const handleOpenSettings = () => {
    sound.playButtonClick();
    openSettings();
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-8 lg:px-10">
      <header className="flex items-center justify-between">
        <a
          aria-label="Keyboard Warrior home"
          className="text-sm font-bold tracking-[0.18em] text-(--color-text-primary) uppercase"
          href="/"
        >
          KW
        </a>
        <Button
          aria-label="Open settings"
          onClick={handleOpenSettings}
          size="icon"
          variant="ghost"
        >
          <Settings aria-hidden="true" />
        </Button>
      </header>

      <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.06fr_0.94fr] lg:py-8">
        <div className="max-w-3xl animate-[kw-fade-up_480ms_ease-out_both]">
          <p className="mb-5 text-sm font-semibold tracking-[0.22em] text-(--color-accent) uppercase">
            How well do you know your keyboard?
          </p>
          <h1 className="text-5xl leading-[0.95] font-black tracking-normal text-(--color-text-primary) sm:text-7xl lg:text-8xl">
            Keyboard Warrior
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-(--color-text-secondary) sm:text-lg">
            A focused typing sprint where falling keys test your rhythm,
            recall, and nerve.
          </p>

          <dl className="mt-9 grid max-w-2xl grid-cols-3 border-y border-(--color-border-subtle) py-4">
            <div>
              <dt className="text-[0.65rem] font-semibold tracking-[0.18em] text-(--color-text-muted) uppercase">
                Session
              </dt>
              <dd className="mt-2 text-sm font-bold text-(--color-text-primary)">
                {settings.sessionDurationSeconds}s
              </dd>
            </div>
            <div>
              <dt className="text-[0.65rem] font-semibold tracking-[0.18em] text-(--color-text-muted) uppercase">
                Input
              </dt>
              <dd className="mt-2 text-sm font-bold text-(--color-text-primary)">
                {isCoarsePointer ? "Tap tiles" : "Keyboard"}
              </dd>
            </div>
            <div>
              <dt className="text-[0.65rem] font-semibold tracking-[0.18em] text-(--color-text-muted) uppercase">
                Modes
              </dt>
              <dd className="mt-2 text-sm font-bold text-(--color-text-primary)">
                {isCoarsePointer ? "1" : "2"}
              </dd>
            </div>
          </dl>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button onClick={handlePlay} size="lg">
              Play
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="animate-[kw-fade-up_560ms_120ms_ease-out_both] rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) p-4 shadow-[0_22px_90px_var(--color-shadow)]">
          <div className="mb-5 flex items-center justify-between border-b border-(--color-border-subtle) pb-4">
            <div>
              <h2 className="text-base font-bold text-(--color-text-primary)">
                Session Setup
              </h2>
              <p className="mt-1 text-xs text-(--color-text-muted)">
                Choose the run before the countdown starts.
              </p>
            </div>
            <div className="h-2 w-2 rounded-full bg-(--color-accent) shadow-[0_0_18px_var(--color-glow)]" />
          </div>

          <fieldset className="space-y-3">
            <legend className="mb-3 text-xs font-semibold tracking-[0.16em] text-(--color-text-secondary) uppercase">
              Mode
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {visibleModes.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    aria-pressed={playableMode === item.value}
                    className="flex min-h-24 items-start gap-3 rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) p-4 text-left transition-[background,border-color,transform] duration-150 ease-out hover:border-(--color-accent) active:scale-[0.99] aria-pressed:border-(--color-accent) aria-pressed:bg-(--color-accent-muted)"
                    key={item.value}
                    onClick={() => {
                      sound.playSelectorChange();
                      setMode(item.value);
                    }}
                    type="button"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-(--radius) border border-(--color-border-subtle) bg-(--color-bg-elevated) text-(--color-accent)">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-(--color-text-primary)">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-(--color-text-secondary)">
                        {item.detail}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            {isCoarsePointer ? (
              <p className="text-xs leading-5 text-(--color-text-muted)">
                Word Mode unlocks on desktop keyboards.
              </p>
            ) : null}
          </fieldset>

          <fieldset className="mt-6 space-y-3">
            <legend className="mb-3 text-xs font-semibold tracking-[0.16em] text-(--color-text-secondary) uppercase">
              Difficulty
            </legend>
            <div className="grid gap-3">
              {difficulties.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    aria-pressed={difficulty === item.value}
                    className="flex items-center justify-between gap-4 rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) p-4 text-left transition-[background,border-color,transform] duration-150 ease-out hover:border-(--color-accent) active:scale-[0.99] aria-pressed:border-(--color-accent) aria-pressed:bg-(--color-accent-muted)"
                    key={item.value}
                    onClick={() => {
                      sound.playSelectorChange();
                      setDifficulty(item.value);
                    }}
                    type="button"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius) border border-(--color-border-subtle) bg-(--color-bg-elevated) text-(--color-accent)">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-(--color-text-primary)">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-(--color-text-secondary)">
                          {item.detail}
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-bold text-(--color-accent)">
                      {item.metric}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      </section>
    </main>
  );
}

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeRoute,
});
