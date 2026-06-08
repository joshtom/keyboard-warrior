import { Link, createRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { rootRoute } from "@/routes/root";

function ResultsRoute() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <section className="w-full max-w-3xl rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) p-6 text-center shadow-[0_22px_90px_var(--color-shadow)]">
        <p className="text-xs font-semibold tracking-[0.22em] text-(--color-accent) uppercase">
          Results
        </p>
        <h1 className="mt-4 text-3xl font-black text-(--color-text-primary)">
          Scorecard Slot Reserved
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-(--color-text-secondary)">
          Session stats, keyboard heatmap, and share card export will land after
          the core game loop.
        </p>
        <Button asChild className="mt-7" variant="secondary">
          <Link to="/">Home</Link>
        </Button>
      </section>
    </main>
  );
}

export const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: ResultsRoute,
});
