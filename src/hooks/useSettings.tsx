import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

export type SessionDurationSeconds = 30 | 60 | 90 | 120;

export type SettingsState = {
  sessionDurationSeconds: SessionDurationSeconds;
  soundEffectsEnabled: boolean;
  backgroundMusicEnabled: boolean;
};

type SettingsContextValue = {
  settings: SettingsState;
  updateSettings: (settings: Partial<SettingsState>) => void;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  setSettingsOpen: (isOpen: boolean) => void;
};

const settingsStorageKey = "keyboard-warrior:settings";

const defaultSettings: SettingsState = {
  sessionDurationSeconds: 60,
  soundEffectsEnabled: true,
  backgroundMusicEnabled: false,
};

const validDurations: Array<SessionDurationSeconds> = [30, 60, 90, 120];

const SettingsContext = createContext<SettingsContextValue | null>(null);

function isSettingsObject(value: unknown): value is Partial<SettingsState> {
  return typeof value === "object" && value !== null;
}

function readStoredSettings() {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  const storedSettings = window.localStorage.getItem(settingsStorageKey);

  if (!storedSettings) {
    return defaultSettings;
  }

  try {
    const parsedSettings: unknown = JSON.parse(storedSettings);

    if (!isSettingsObject(parsedSettings)) {
      return defaultSettings;
    }

    const sessionDurationSeconds = validDurations.includes(
      parsedSettings.sessionDurationSeconds as SessionDurationSeconds,
    )
      ? (parsedSettings.sessionDurationSeconds as SessionDurationSeconds)
      : defaultSettings.sessionDurationSeconds;

    return {
      sessionDurationSeconds,
      soundEffectsEnabled:
        typeof parsedSettings.soundEffectsEnabled === "boolean"
          ? parsedSettings.soundEffectsEnabled
          : defaultSettings.soundEffectsEnabled,
      backgroundMusicEnabled:
        typeof parsedSettings.backgroundMusicEnabled === "boolean"
          ? parsedSettings.backgroundMusicEnabled
          : defaultSettings.backgroundMusicEnabled,
    };
  } catch {
    return defaultSettings;
  }
}

export function SettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<SettingsState>(readStoredSettings);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((nextSettings: Partial<SettingsState>) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      ...nextSettings,
    }));
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
      isSettingsOpen,
      openSettings,
      closeSettings,
      setSettingsOpen,
    }),
    [closeSettings, isSettingsOpen, openSettings, settings, updateSettings],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }

  return context;
}
