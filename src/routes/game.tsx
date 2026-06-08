import { createRoute, useSearch } from "@tanstack/react-router";

import { rootRoute } from "@/routes/root";
import type { Difficulty, GameMode } from "@/types";

type GameSearch = {
  mode?: GameMode;
  difficulty?: Difficulty;
};

function GameRoute() {
  const search = useSearch({ from: "/game" }) as GameSearch;

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <section className="w-full max-w-3xl rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) p-6 text-center shadow-[0_22px_90px_var(--color-shadow)]">
        <p className="text-xs font-semibold tracking-[0.22em] text-(--color-accent) uppercase">
          Game Session
        </p>
        <h1 className="mt-4 text-3xl font-black text-(--color-text-primary)">
          Engine Slot Reserved
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-(--color-text-secondary)">
          The route is wired for {search.mode ?? "letter"} mode on{" "}
          {search.difficulty ?? "easy"} difficulty. Falling tiles arrive in the
          next feature.
        </p>
      </section>
    </main>
  );
}

export const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/game",
  validateSearch: (search: Record<string, unknown>): GameSearch => ({
    mode: search.mode === "word" ? "word" : "letter",
    difficulty:
      search.difficulty === "medium" || search.difficulty === "hard"
        ? search.difficulty
        : "easy",
  }),
  component: GameRoute,
});
