import { createRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Settings } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { rootRoute } from "@/routes/root";
import type { Difficulty, GameMode } from "@/types";

const modes: Array<{ value: GameMode; label: string; detail: string }> = [
  {
    value: "letter",
    label: "Letter",
    detail: "Single-key reflex runs",
  },
  {
    value: "word",
    label: "Word",
    detail: "Full-word typing trials",
  },
];

const difficulties: Array<{
  value: Difficulty;
  label: string;
  detail: string;
}> = [
  {
    value: "easy",
    label: "Easy",
    detail: "Slow, clean, focused",
  },
  {
    value: "medium",
    label: "Medium",
    detail: "More keys, more pressure",
  },
  {
    value: "hard",
    label: "Hard",
    detail: "Symbols in the storm",
  },
];

function HomeRoute() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<GameMode>("letter");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-8 lg:px-10">
      <header className="flex items-center justify-between">
        <a
          aria-label="Keyboard Warrior home"
          className="text-sm font-bold tracking-[0.18em] text-[var(--color-text-primary)] uppercase"
          href="/"
        >
          KW
        </a>
        <Button aria-label="Open settings" size="icon" variant="ghost">
          <Settings aria-hidden="true" />
        </Button>
      </header>

      <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.06fr_0.94fr] lg:py-8">
        <div className="max-w-3xl [animation:kw-fade-up_480ms_ease-out_both]">
          <p className="mb-5 text-sm font-semibold tracking-[0.28em] text-[var(--color-accent)] uppercase">
            How well do you know your keyboard?
          </p>
          <h1 className="text-5xl leading-[0.95] font-black tracking-normal text-[var(--color-text-primary)] sm:text-7xl lg:text-8xl">
            Keyboard Warrior
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg">
            A fast reaction typing arena where falling keys test your rhythm,
            recall, and nerve.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button
              onClick={() =>
                navigate({
                  to: "/game",
                  search: { mode, difficulty },
                })
              }
              size="lg"
            >
              Play
              <ChevronRight aria-hidden="true" />
            </Button>
            <Button
              onClick={() =>
                navigate({
                  to: "/results",
                })
              }
              size="lg"
              variant="secondary"
            >
              Preview Results
            </Button>
          </div>
        </div>

        <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 shadow-[0_22px_90px_var(--color-shadow)] [animation:kw-fade-up_560ms_120ms_ease-out_both]">
          <div className="mb-5 flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
            <div>
              <h2 className="text-base font-bold text-[var(--color-text-primary)]">
                Session Setup
              </h2>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Feature one shell, ready for the engine.
              </p>
            </div>
            <div className="h-2 w-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_18px_var(--color-glow)]" />
          </div>

          <fieldset className="space-y-3">
            <legend className="mb-3 text-xs font-semibold tracking-[0.16em] text-[var(--color-text-secondary)] uppercase">
              Mode
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {modes.map((item) => (
                <button
                  aria-pressed={mode === item.value}
                  className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-bg-overlay)] p-4 text-left transition-[background,border-color,transform] duration-150 ease-out hover:border-[var(--color-accent)] active:scale-[0.99] aria-pressed:border-[var(--color-accent)] aria-pressed:bg-[var(--color-accent-muted)]"
                  key={item.value}
                  onClick={() => setMode(item.value)}
                  type="button"
                >
                  <span className="block text-sm font-bold text-[var(--color-text-primary)]">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[var(--color-text-secondary)]">
                    {item.detail}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6 space-y-3">
            <legend className="mb-3 text-xs font-semibold tracking-[0.16em] text-[var(--color-text-secondary)] uppercase">
              Difficulty
            </legend>
            <div className="grid gap-3">
              {difficulties.map((item) => (
                <button
                  aria-pressed={difficulty === item.value}
                  className="flex items-center justify-between gap-4 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-bg-overlay)] p-4 text-left transition-[background,border-color,transform] duration-150 ease-out hover:border-[var(--color-accent)] active:scale-[0.99] aria-pressed:border-[var(--color-accent)] aria-pressed:bg-[var(--color-accent-muted)]"
                  key={item.value}
                  onClick={() => setDifficulty(item.value)}
                  type="button"
                >
                  <span>
                    <span className="block text-sm font-bold text-[var(--color-text-primary)]">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[var(--color-text-secondary)]">
                      {item.detail}
                    </span>
                  </span>
                  <span className="text-xs font-bold text-[var(--color-accent)]">
                    {difficulty === item.value ? "SELECTED" : ""}
                  </span>
                </button>
              ))}
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
