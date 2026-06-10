import { useCallback, useEffect, useMemo } from "react";

import { useSettings } from "@/hooks/useSettings";

type OscillatorKind = OscillatorType;

type Tone = {
  frequency: number;
  durationMs: number;
  delayMs?: number;
  gain?: number;
  type?: OscillatorKind;
};

type AudioContextConstructor = new () => AudioContext;

type WindowWithAudioContext = Window & {
  AudioContext?: AudioContextConstructor;
  webkitAudioContext?: AudioContextConstructor;
};

type AudioMusicState = {
  element: HTMLAudioElement;
  kind: "audio";
};

type SynthMusicState = {
  gain: GainNode;
  kind: "synth";
  oscillators: Array<OscillatorNode>;
};

type MusicState = AudioMusicState | SynthMusicState;

let audioContext: AudioContext | null = null;
let musicState: MusicState | null = null;
let isMusicStartPending = false;

const lofiMusicPath = "/assets/audio/lofi.mp3";

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  const audioWindow = window as WindowWithAudioContext;
  const AudioContextClass =
    audioWindow.AudioContext ?? audioWindow.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  const context = audioContext ?? new AudioContextClass();
  audioContext = context;

  if (context.state === "suspended") {
    void context.resume();
  }

  return context;
}

function playTone({
  delayMs = 0,
  durationMs,
  frequency,
  gain = 0.05,
  type = "sine",
}: Tone) {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  const startsAt = context.currentTime + delayMs / 1000;
  const endsAt = startsAt + durationMs / 1000;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startsAt);
  gainNode.gain.setValueAtTime(0.0001, startsAt);
  gainNode.gain.exponentialRampToValueAtTime(gain, startsAt + 0.012);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, endsAt);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(startsAt);
  oscillator.stop(endsAt + 0.02);
}

function playPattern(tones: Array<Tone>) {
  tones.forEach(playTone);
}

function stopBackgroundMusic() {
  isMusicStartPending = false;

  if (!musicState) {
    return;
  }

  if (musicState.kind === "audio") {
    musicState.element.pause();
    musicState.element.currentTime = 0;
    musicState = null;
    return;
  }

  musicState.gain.gain.setTargetAtTime(0.0001, audioContext?.currentTime ?? 0, 0.08);
  musicState.oscillators.forEach((oscillator) => {
    try {
      oscillator.stop((audioContext?.currentTime ?? 0) + 0.2);
    } catch {
      oscillator.disconnect();
    }
  });
  musicState = null;
}

function startSynthBackgroundMusic() {
  if (musicState) {
    return;
  }

  const context = getAudioContext();

  if (!context) {
    return;
  }

  const gain = context.createGain();
  const low = context.createOscillator();
  const high = context.createOscillator();

  low.type = "sine";
  high.type = "triangle";
  low.frequency.setValueAtTime(110, context.currentTime);
  high.frequency.setValueAtTime(220, context.currentTime);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.setTargetAtTime(0.018, context.currentTime, 0.16);

  low.connect(gain);
  high.connect(gain);
  gain.connect(context.destination);
  low.start();
  high.start();

  musicState = {
    gain,
    kind: "synth",
    oscillators: [low, high],
  };
}

function startBackgroundMusic() {
  if (musicState || isMusicStartPending || typeof window === "undefined") {
    return;
  }

  isMusicStartPending = true;
  void fetch(lofiMusicPath, { method: "HEAD" })
    .then((response) => {
      if (!isMusicStartPending || musicState) {
        return;
      }

      isMusicStartPending = false;

      if (!response.ok) {
        startSynthBackgroundMusic();
        return;
      }

      const element = new Audio(lofiMusicPath);
      element.loop = true;
      element.volume = 0.24;
      musicState = {
        element,
        kind: "audio",
      };

      void element.play().catch(() => {
        if (musicState?.kind === "audio" && musicState.element === element) {
          musicState = null;
          startSynthBackgroundMusic();
        }
      });
    })
    .catch(() => {
      isMusicStartPending = false;
      startSynthBackgroundMusic();
    });
}

export function useSoundEngine() {
  const { settings } = useSettings();
  const soundEnabled = settings.soundEffectsEnabled;

  useEffect(() => {
    if (settings.backgroundMusicEnabled && soundEnabled) {
      startBackgroundMusic();
      return;
    }

    stopBackgroundMusic();
  }, [settings.backgroundMusicEnabled, soundEnabled]);

  const playWhenEnabled = useCallback(
    (tones: Array<Tone>) => {
      if (!soundEnabled) {
        return;
      }

      playPattern(tones);
    },
    [soundEnabled],
  );

  return useMemo(
    () => ({
      playButtonClick: () =>
        playWhenEnabled([
          { durationMs: 36, frequency: 520, gain: 0.035, type: "square" },
          { delayMs: 28, durationMs: 30, frequency: 760, gain: 0.022 },
        ]),
      playModalOpen: () =>
        playWhenEnabled([
          { durationMs: 120, frequency: 220, gain: 0.024, type: "sine" },
          { delayMs: 48, durationMs: 140, frequency: 520, gain: 0.026 },
        ]),
      playModalClose: () =>
        playWhenEnabled([
          { durationMs: 70, frequency: 420, gain: 0.022 },
          { delayMs: 54, durationMs: 80, frequency: 190, gain: 0.018 },
        ]),
      playSelectorChange: () =>
        playWhenEnabled([
          { durationMs: 40, frequency: 660, gain: 0.03, type: "triangle" },
        ]),
      playHit: () =>
        playWhenEnabled([
          { durationMs: 44, frequency: 880, gain: 0.04, type: "square" },
          { delayMs: 36, durationMs: 42, frequency: 1320, gain: 0.02 },
        ]),
      playMiss: () =>
        playWhenEnabled([
          { durationMs: 110, frequency: 96, gain: 0.055, type: "sawtooth" },
        ]),
      playCombo: (streakCount: number) =>
        playWhenEnabled([
          {
            durationMs: 54,
            frequency: Math.min(1480, 540 + streakCount * 42),
            gain: 0.026,
            type: "triangle",
          },
        ]),
      playComboBreak: () =>
        playWhenEnabled([
          { durationMs: 70, frequency: 320, gain: 0.025 },
          { delayMs: 56, durationMs: 90, frequency: 160, gain: 0.023 },
        ]),
      playSessionEnd: () =>
        playWhenEnabled([
          { durationMs: 120, frequency: 330, gain: 0.032 },
          { delayMs: 110, durationMs: 130, frequency: 247, gain: 0.026 },
          { delayMs: 230, durationMs: 180, frequency: 196, gain: 0.024 },
        ]),
      playCountdownTick: () =>
        playWhenEnabled([
          { durationMs: 70, frequency: 520, gain: 0.028, type: "square" },
        ]),
      playCountdownGo: () =>
        playWhenEnabled([
          { durationMs: 70, frequency: 660, gain: 0.028 },
          { delayMs: 58, durationMs: 90, frequency: 990, gain: 0.03 },
        ]),
      playSplashDismiss: () =>
        playWhenEnabled([
          { durationMs: 120, frequency: 300, gain: 0.026 },
          { delayMs: 70, durationMs: 150, frequency: 720, gain: 0.03 },
        ]),
      playDownload: () =>
        playWhenEnabled([
          { durationMs: 34, frequency: 940, gain: 0.04, type: "square" },
          { delayMs: 52, durationMs: 46, frequency: 520, gain: 0.028 },
        ]),
    }),
    [playWhenEnabled],
  );
}
