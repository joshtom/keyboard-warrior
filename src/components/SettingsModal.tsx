import { Clock, Music2, Volume2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  useSettings,
  type SessionDurationSeconds,
} from "@/hooks/useSettings";

const sessionDurationOptions: Array<SessionDurationSeconds> = [
  30,
  60,
  90,
  120,
];

export function SettingsModal() {
  const {
    closeSettings,
    isSettingsOpen,
    setSettingsOpen,
    settings,
    updateSettings,
  } = useSettings();

  return (
    <Dialog open={isSettingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent onEscapeKeyDown={closeSettings}>
        <DialogHeader>
          <p className="text-xs font-semibold tracking-[0.22em] text-(--color-accent) uppercase">
            Preferences
          </p>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Tune each run before stepping back into the arena.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 space-y-4">
          <section className="rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-(--radius) border border-(--color-border-subtle) bg-(--color-bg-elevated) text-(--color-accent)">
                <Clock aria-hidden="true" className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-black text-(--color-text-primary)">
                  Session Time
                </h3>
                <p className="mt-1 text-xs text-(--color-text-secondary)">
                  Applies to the next session.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {sessionDurationOptions.map((duration) => (
                <button
                  aria-pressed={settings.sessionDurationSeconds === duration}
                  className="h-10 rounded-(--radius) border border-(--color-border) bg-(--color-bg-elevated) text-xs font-black text-(--color-text-primary) transition-[background,border-color,color,transform] duration-150 hover:border-(--color-accent) active:scale-[0.98] aria-pressed:border-(--color-accent) aria-pressed:bg-(--color-accent-muted) aria-pressed:text-(--color-accent)"
                  key={duration}
                  onClick={() =>
                    updateSettings({ sessionDurationSeconds: duration })
                  }
                  type="button"
                >
                  {duration}s
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <label className="flex items-center justify-between gap-4 rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) p-3">
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius) border border-(--color-border-subtle) bg-(--color-bg-elevated) text-(--color-accent)">
                  <Volume2 aria-hidden="true" className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-black text-(--color-text-primary)">
                    Sound Effects
                  </span>
                  <span className="mt-1 block text-xs text-(--color-text-secondary)">
                    Tactile cues for UI and game hits.
                  </span>
                </span>
              </span>
              <Switch
                checked={settings.soundEffectsEnabled}
                onCheckedChange={(soundEffectsEnabled) =>
                  updateSettings({ soundEffectsEnabled })
                }
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-(--radius) border border-(--color-border) bg-(--color-bg-overlay) p-3">
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius) border border-(--color-border-subtle) bg-(--color-bg-elevated) text-(--color-accent)">
                  <Music2 aria-hidden="true" className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-black text-(--color-text-primary)">
                    Background Music
                  </span>
                  <span className="mt-1 block text-xs text-(--color-text-secondary)">
                    Optional ambient loop for future sound.
                  </span>
                </span>
              </span>
              <Switch
                checked={settings.backgroundMusicEnabled}
                onCheckedChange={(backgroundMusicEnabled) =>
                  updateSettings({ backgroundMusicEnabled })
                }
              />
            </label>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
