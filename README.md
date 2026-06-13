# Keyboard Warrior

Keyboard Warrior is a browser-based typing reaction game where falling keys,
symbols, and words test speed, accuracy, and keyboard recall. It is fully
client-side, session-based, and built around quick runs with shareable results.

## Features

- Animated Three.js splash screen with a floating keyboard model and
  scramble-text keyboard prompts.
- Letter Mode with lowercase, uppercase, numbers, and symbols by difficulty.
- Desktop-only Word Mode with expanded word lists for less repetition.
- Mobile tap mode with piano-tiles-style falling tiles.
- Easy, Medium, and Hard difficulty profiles.
- Countdown-gated sessions with combo feedback and end-session polish.
- Score, accuracy, average reaction speed, hits, misses, and longest combo.
- Per-key reaction tracking with a QWERTY heatmap, including hard-mode symbols.
- Player progress tracking in `localStorage` per mode and difficulty.
- Square social score card export through `Download Card`.
- Settings modal with session length, sound effects, and lofi background music.

## Tech Stack

- React
- TanStack Router
- Tailwind CSS
- shadcn-style local UI components
- Three.js with `@react-three/fiber` and `@react-three/drei`
- Web Audio API for sound effects and fallback ambient music
- `html-to-image` for score-card export
- Geist Mono via Google Fonts

## Project Structure

```txt
public/
└── assets/
    ├── audio/
    │   └── lofi.mp3
    └── keyboard.glb

src/
├── components/
│   ├── ui/
│   ├── CountdownTimer.tsx
│   ├── GameBoard.tsx
│   ├── KeyboardHeatmap.tsx
│   ├── ResultsCard.tsx
│   ├── ScoreDisplay.tsx
│   ├── SettingsModal.tsx
│   ├── SplashScreen.tsx
│   └── Tile.tsx
├── data/
│   ├── characterSets.ts
│   ├── difficultyProfiles.ts
│   └── wordLists.ts
├── hooks/
│   ├── useGameEngine.ts
│   ├── useIsCoarsePointer.ts
│   ├── useReactionTracker.ts
│   ├── useSettings.tsx
│   └── useSoundEngine.ts
├── routes/
│   ├── game.tsx
│   ├── index.tsx
│   ├── results.tsx
│   └── root.tsx
├── styles/
│   └── globals.css
├── types/
│   └── index.ts
└── utils/
    ├── cardExport.ts
    ├── gameResultStorage.ts
    ├── heatmap.ts
    ├── playerProgressStorage.ts
    └── scoring.ts
```

## Game Flow

```txt
Splash Screen
  -> Home
  -> Mode + Difficulty Selection
  -> Countdown
  -> Game Session
  -> Results
  -> Download Score Card / Play Again / Home
```

## Splash Screen

The first screen uses a floating Three.js keyboard model with a subtle bob and
rotation animation. Above the title, the eyebrow copy cycles through keyboard
phrases such as `KEYBOARD REFLEX TEST`, `QWERTY - TYUIO`, number rows, symbol
patterns, and shortcut-inspired prompts.

The phrase transition uses a scramble animation with a deliberate pause between
changes so the text feels animated without becoming frantic. Users can dismiss
the splash with any key on desktop or a tap on mobile.

## Modes

### Letter Mode

Available on desktop and mobile.

- Easy: lowercase letters
- Medium: lowercase, uppercase, and numbers
- Hard: lowercase, uppercase, numbers, and symbols

### Word Mode

Available on desktop only.

- Easy: short common words
- Medium: everyday medium-length words
- Hard: longer mixed-case challenge words

## Mobile Behavior

Mobile uses tap-only play. Instead of showing letters or words, the game behaves
more like piano tiles: larger falling tiles are tapped directly before they
leave the board. Word Mode is hidden on coarse-pointer devices.

## Scoring

- Correct hit: `+10` base points, multiplied by combo tier.
- Missed tile: `-5` points.
- Score never drops below zero.
- Combo tiers:
  - `1-4`: `1x`
  - `5-9`: `1.5x`
  - `10-14`: `2x`
  - `15+`: `3x`

## Player Progress

Personal bests are stored locally in `localStorage` for each mode and
difficulty. The app tracks:

- Best score
- Best accuracy
- Fastest average reaction speed
- Best hit count
- Longest combo

The home screen shows the current personal best for the selected setup, and the
results screen highlights any new records from the latest session.

## Shareable Score Card

The results screen includes a `Download Card` action. It exports a square
`1080x1080` social score card containing:

- Final score
- Mode
- Difficulty
- Accuracy
- Average speed
- Hits
- Longest combo

The exported card intentionally does not include the heatmap or full analytics
view, keeping it clean for social sharing.

## Assets

- `public/assets/keyboard.glb`: 3D keyboard model used by the splash screen.
- `public/assets/audio/lofi.mp3`: lofi background loop for settings.

## Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Styling Rules

All app colors are defined as CSS variables in
`src/styles/globals.css`. Components should reference those variables through
Tailwind arbitrary values or CSS variable references. Do not hardcode colors in
components.

Shared TypeScript declarations use `type`, not `interface`.
