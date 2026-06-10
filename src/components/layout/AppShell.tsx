import type { PropsWithChildren } from "react";

import { SettingsModal } from "@/components/SettingsModal";
import { SettingsProvider } from "@/hooks/useSettings";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <SettingsProvider>
      <div className="min-h-screen overflow-hidden bg-(--color-bg) text-(--color-text-primary)">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-0 h-px bg-(--color-accent) opacity-70 shadow-[0_0_34px_var(--color-glow)]"
        />
        {children}
        <SettingsModal />
      </div>
    </SettingsProvider>
  );
}
