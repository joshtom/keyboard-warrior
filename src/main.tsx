import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createRouter,
  RouterProvider,
  createRoute,
} from "@tanstack/react-router";

import { gameRoute } from "@/routes/game";
import { indexRoute } from "@/routes/index";
import { resultsRoute } from "@/routes/results";
import { rootRoute } from "@/routes/root";
import "@/styles/globals.css";

const routeTree = rootRoute.addChildren([
  indexRoute,
  gameRoute,
  resultsRoute,
  createRoute({
    getParentRoute: () => rootRoute,
    path: "*",
    component: () => (
      <main className="flex min-h-screen items-center justify-center px-5 text-center">
        <section>
          <p className="text-sm font-semibold text-[var(--color-accent)]">
            404
          </p>
          <h1 className="mt-3 text-3xl font-black text-[var(--color-text-primary)]">
            Route missed
          </h1>
        </section>
      </main>
    ),
  }),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
