import type { PropsWithChildren } from "react";
import { Suspense, lazy, useState } from "react";

import { SettingsModal } from "@/components/SettingsModal";
import { SettingsProvider } from "@/hooks/useSettings";

const SplashScreen = lazy(() =>
  import("@/components/SplashScreen").then((module) => ({
    default: module.SplashScreen,
  })),
);

export function AppShell({ children }: PropsWithChildren) {
  const [isSplashDone, setIsSplashDone] = useState(false);

  return (
    <SettingsProvider>
      <div className="min-h-screen overflow-x-hidden bg-(--color-bg) text-(--color-text-primary)">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-0 h-px bg-(--color-accent) opacity-70 shadow-[0_0_34px_var(--color-glow)]"
        />
        {isSplashDone ? (
          <>
            {children}
            <SettingsModal />
          </>
        ) : (
          <Suspense
            fallback={
              <div className="fixed inset-0 z-50 bg-(--color-bg)" />
            }
          >
            <SplashScreen onDismiss={() => setIsSplashDone(true)} />
          </Suspense>
        )}
      </div>
    </SettingsProvider>
  );
}
