# Placebook (web)

Map-centric place bookmarking web app built with Vite + React + TypeScript. Inspired by Journi and designed to be mobile-first with Kakao Map as the map provider.

## Features
- Tap the Kakao map to drop a temporary marker, then add details via a bottom-sheet flow.
- Save places with name, memo, and emoji/icon.
- Card-style saved list with selection, deletion, and map centering.
- Selected markers highlight on the map; tapping list items pans the view.
- Local storage (Zustand + persist) for offline-friendly usage.
- PWA-ready structure and Tailwind-based modern UI.

## Getting started
1. Install dependencies
   ```bash
   npm install
   ```
2. Set your Kakao Map JavaScript key in a `.env` file:
   ```bash
   VITE_KAKAO_MAP_KEY=your_kakao_js_key
   ```
3. Run the app
   ```bash
   npm run dev
   ```

## Tech stack
- Vite + React + TypeScript
- Tailwind CSS for styling
- Zustand for state management
- Kakao Maps JavaScript SDK (loaded dynamically)

## Project structure
```
src/
  app/App.tsx          # Shell & layout
  features/
    map/MapView.tsx    # Kakao map rendering & marker handling
    places/            # Place list + creation form
  hooks/useKakaoLoader.ts
  store/placeStore.ts  # Zustand store for places
  ui/                  # UI primitives (sheet, modal, FAB)
  styles/index.css     # Tailwind entry
```
