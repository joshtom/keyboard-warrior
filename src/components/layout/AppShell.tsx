import type { PropsWithChildren } from "react";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-px bg-[var(--color-accent)] opacity-70 shadow-[0_0_34px_var(--color-glow)]"
      />
      {children}
    </div>
  );
}
