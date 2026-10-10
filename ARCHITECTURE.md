# Little Elsewhere — Proposed Architecture

Status: Functional MVP implemented in the existing scaffold. Hash routing is retained; activity data, pure reward reducer, provider, snapshot validation/storage, UI components, and tests are present. Future integrations remain excluded.

## Stack and trade-offs
React + TypeScript + Vite, plain CSS, and browser localStorage. React handles reusable interactive views; TypeScript clarifies activity/reward transitions; Vite provides development and static builds. No backend, state library, CSS framework, or external API.

One app-level reducer/context manages state. Four hash routes (#/, #/bingo, #/quests, #/progress) use native hashchange handling, avoiding a router dependency and static-host rewrites. Unknown routes offer navigation home. Use native controls/dialogs.

Phase 1 installed exact versions recorded in package.json and package-lock.json: React 19.3.0, TypeScript 7.0.2, Vite 8.3.4, and React plugin 6.1.2. Navigation tests use Vitest 5.0.3, React Testing Library 16.3.3, and jsdom 30.1.2. React and React DOM were the scaffold runtime dependencies; V2 adds the explicitly requested Lucide React 1.55.0 interface icons. The project requires Node ^24.15.0 or >=26.0.0 (the test environment sets the higher minimum); tested with Node 24.16.0 and npm 11.13.0. Vitest uses one thread worker because the default fork pool stalled on this Windows setup. No new dependencies were added for the functional MVP. Existing test tooling covers domain and component journeys.

## Proposed source structure
```text
little-elsewhere/
  PRODUCT.md, RULES.md, DESIGN.md
  ARCHITECTURE.md, TASKS.md, README.md
  index.html
  package.json, package-lock.json
  tsconfig.json, vite.config.ts
  public/illustrations/
  src/
    main.tsx
    app/
      App.tsx
      routes.ts
      state.ts
      reducer.ts
      AppStateProvider.tsx
    pages/
      HomePage.tsx
      BingoPage.tsx
      QuestsPage.tsx
      ProgressPage.tsx
    components/
      Button.tsx
      Card.tsx
      Navigation.tsx
      CoinBalance.tsx
      ConfirmDialog.tsx
      FirstTimeHelp.tsx
      RewardFeedback.tsx
    features/
      bingo/
        BingoBoard.tsx
        BingoCell.tsx
        logic.ts
      quests/
        QuestCard.tsx
        logic.ts
      rewards/
        rules.ts
        award.ts
        ledger.ts
    data/
      quests.ts
      bingoActivities.ts
    persistence/
      storage.ts
      validation.ts
    styles/
      tokens.css
      global.css
    tests/
      bingo.test.ts
      quests.test.ts
      rewards.test.ts
      persistence.test.ts
      journeys.test.tsx
```
Add files as needed rather than generating empty placeholders.

## Responsibilities
index.html mounts main.tsx. App initializes persistence, provides state, selects routes, and renders shared navigation/balance. Pages compose features. UI dispatches intents; pure domain functions validate transitions. Data modules contain content only. Persistence validates and stores one snapshot. Tokens govern shared styling.

## Models
- QuestDefinition: stable id, title, description, category (nature/observation/movement/creative), effort (gentle/medium/longer), coinReward (5/10/15), duration, icon, completionInstruction, and a combined indoor/adapted alternative. Eight records.
- QuestProgress: questId, status (available/active/completed/claimed), optional startedAt/completedAt/claimedAt. Abandon active quests to available; completed/claimed states cannot reopen.
- BingoActivity: id, label, instruction, category, optional alternative. Pool has at least nine distinct prompts.
- BingoCell: activityId, completed, strokes (bounded arrays of normalized [x,y] points); array index determines board position.
- BingoBoard: id, createdAt, exactly nine distinct cells, and celebratedLines (unique indices 0–7). New board clears marks but retains history/awards.
- CompletionRecord: id, kind (quest/bingo-line/bingo-full), sourceId, completedAt. Record quest completion and first reward-relevant bingo events, not every toggle.
- CoinEntry: unique awardKey, positive integer amount, reason, sourceId, awardedAt. No spending entries.
- AppState: schemaVersion: 1, revision, onboardingSeen, bingoBoard, bingoFoundIds, questProgress, completionRecords, coinLedger.
- CoinBalance: derived sum of validated ledger amounts, never independently persisted.

Internal IDs are local identifiers, not personal profiles. Timestamps do not prove offline activity.

## Validating and awarding rewards
features/rewards/award.ts is the only award entry point. rules.ts holds constants; quest rewards come from trusted definitions, never UI-provided amounts.

Keys: `bingo:first-line`, `bingo:first-full`, `quest:<questId>:first-completion`. Bingo keys are profile-wide, not board-specific. Evaluate the resulting board against eight fixed line patterns. A full board grants both remaining awards. Undo and new boards preserve keys.

Quest claim requires completed status, a matching completion record, a recognized definition, and an absent award key. Update status and ledger together. Invalid/repeated intents return a useful reason or no-op without payment.

Reducer transitions use the latest state, so rapid duplicate dispatches cannot duplicate awards. Commit completion, claim, and ledger as one snapshot. Never increment coins in component effects. Initial total cap: 105 (75 quest coins + 30 bingo coins).

## Local persistence
One JSON snapshot under `little-elsewhere:state:v1`. Load before exposing actionable content. Successful setItem replaces the entire snapshot atomically. Missing state starts a fresh profile.

Validate schema/types, known IDs, unique award keys, expected amounts/reasons, completion records, claim/ledger correspondence, nine distinct known cells, and nonnegative derived balance. Bingo awards may reference previous boards. Do not regenerate boards on render.

Malformed data or unsupported schema enters recovery mode: retain the raw snapshot, explain the issue, and offer a confirmed local reset. Do not silently overwrite it. Future schema changes need explicit tested migration.

Failed/disabled storage retains usable in-memory state but visibly says progress is unsaved; retry saves the latest whole snapshot. Reload may lose unsaved changes. Feedback must not imply a failed save succeeded.

One active tab is supported. A storage event indicating another tab changed progress suspends mutations and offers reload, explaining any unsaved changes. Do not silently merge competing ledgers. This detects conflicts but cannot guarantee transactions for simultaneous tabs; robust multi-tab coordination is outside scope.

## Error handling and testing
Invalid transitions never pay. Unknown routes offer home; empty and all-claimed states are calm and finite. Errors use actionable text; no server loading states are invented.

Test all eight bingo patterns, full-board compound awards, undo/reset, quest lifecycle, premature/double claims, catalog integrity, and the 105 cap. Test snapshot round-trips, malformed/unsupported data, quota failures, refresh restoration, and conflict warnings. Integration tests exercise actual journeys and rapid repeat actions, including canceled/confirmed reset.

Manual checks: touch/mobile/desktop, keyboard/dialog focus, contrast, zoom/reflow, reduced motion, disabled storage, and competing-tab warnings. Record actual results before marking tasks complete.

## Limits and extension points
localStorage is editable/clearable, origin/device-specific, and neither anti-cheat nor backup nor identity storage. Activities are self-reported; there is no sync. No service worker means network-free website loading is not guaranteed.

Separate content, rewards, and persistence boundaries support reviewable future changes. Backend, accounts, spending, rooms, photos, AI, and OS enforcement each need separately approved architecture/privacy work. Do not scaffold them now.
## Functional delivery notes
AppStateProvider applies the pure appReducer using one current-session reference and React state. This makes successive rapid intents observe the latest committed state. Saves occur synchronously for each accepted intent, not in render/effects; one JSON snapshot contains completion and ledger changes together. Balance is derived only from the ledger. React context shares state without a new library.

Session-only storage status, raw-snapshot comparison, and notification state are not persisted. Compare the current stored raw value before every mutation/retry, and also listen for storage events. Detected conflicts pause activities until a confirmed reload. Failed writes retain the newest memory state and explicitly show unsaved progress. Invalid JSON/schema never auto-saves; confirmed recovery replaces it. No state migration is needed from Phase 1 because it had no persisted activity state.

Bingo board replacement rotates the nine reviewed prompts, creates a new board ID, and resets line celebrations while retaining profile award keys and distinct found-activity history. Quest completion and claim remain separate intents. Quest reward values derive from the centralized effort configuration; the finite cap remains 105.

Additional reusable files: Icon.tsx, Companion.tsx, SectionHeading.tsx, ProgressIndicator.tsx, EmptyState.tsx, and StorageStatus.tsx. Navigation and all four existing pages were updated, not rescaffolded. Future state libraries, API clients, and integrations were not added.

Verification uses four Vitest files plus temporary dependency-free Edge/CDP checks. Browser scripts/profile/results remain ignored under .verification/ and .browser-profile/. Six real screenshots live in public/screenshots/. Pure logic is covered in rewards.test.ts and persistence.test.ts, while navigation.test.tsx and journeys.test.tsx cover views and interactions; separate empty test/module placeholders were not created.
## Visual Redesign V2 implementation

Home is an open pet scene and game invitation; quests are compact entries and progress a keepsake shelf. Local Press Start 2P/Nunito fonts and Lucide interface icons are documented in ASSETS.md. NatureIllustration.tsx remains original and separate from interface icons. Plain CSS and native hash routing remain.

BingoCell.tsx captures one active pointer and renders saved/live SVG polylines. Coordinates clamp to 0–100; each cell accepts at most 12 strokes, each with at most 128 points. Interrupted strokes are discarded. Only incomplete drawing surfaces disable touch scrolling; surrounding content remains scrollable. Mark/Undo are native keyboard-accessible controls.

features/bingo/drawing.ts recognizes two sufficiently long opposite diagonal strokes whose chords cross in the central tile area, rejecting taps, tiny strokes, and excessive scribbles. This is a deliberately simple gesture rule; drawing is optional. draw-cell, clear-cell, and toggle-cell share the existing reducer's line/full-board evaluation and profile-wide award keys. Drawing components do not assign rewards.

The existing schemaVersion 1 snapshot/key is retained through a compatible field extension. persistence/migration.ts upgrades validated legacy cells lacking strokes to a default X when completed, or empty ink otherwise. Stored raw data remains untouched until an accepted action saves. Provided strokes are validated for bounds, size, and agreement with completed state. Partial ink, Undo, and new-board replacement persist through existing snapshot storage, failure/retry, recovery, and conflict protections.

Current verification: 46 tests in five files, including drawing gestures, bounded data, pointer cancellation, legacy upgrade, and duplicate awards. Real Edge/CDP checks cover mouse/touch/pen simulation and 16 view/width combinations. Six V2 screenshots replace previous captures. Physical-device, screen-reader, and broader cross-browser checks remain release follow-up.
## CSS organization

main.tsx imports styles once in this order: tokens, global, components, layout, progress, home, Bingo, Quests. No component-local or duplicate imports are needed.

- src/styles/tokens.css: shared colors, font families, spacing, control sizing, pixel border and shadow variables.
- src/styles/global.css: local font faces, reset, base typography, accessibility helpers, skip link, and reduced-motion defaults.
- src/styles/components.css: shared buttons, links, section headings, pixel surfaces, nature artwork, dialogs/help, empty states, storage alerts, and reward feedback.
- src/styles/layout.css: app shell, branding/header/footer, navigation, shared page headings and containers.
- src/styles/home.css: Home composition, decorative companion device, game invitation, and featured quests.
- src/styles/progress.css: keepsakes, discovery history, coin HUD/animation, reusable coin art and discovery trail shared with other views.
- src/features/bingo/bingo.css: board, tile illustrations/controls, SVG pointer surfaces, ink, completed-line indicators, and Bingo guidance.
- src/features/quests/quests.css: quest entries, lifecycle states, alternatives, action groups, and quest reward layout.

Each stylesheet owns its responsive overrides beside its base rules. Shared selectors have one owner; feature styles may specialize shared components using their existing contextual selectors. Keep the established import order and use token variables for palette/type changes.