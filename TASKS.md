# Little Elsewhere — Implementation Checklist

The approved Phase 2 delivery implements the functional MVP and visual redesign across the implementation steps below. It does not authorize the future Grow Your World roadmap. Remaining release checks are explicitly recorded.

| Phase | Task | Completion criterion | Status |
| --- | --- | --- | --- |
| 1 | Project scaffolding | Approved React/TypeScript/Vite dependencies and lockfile; entry point, scripts, typecheck, and build work; actual Node requirement documented. | Complete |
| 2 | Design tokens and reusable UI | Colors/spacing/type plus buttons, cards, dialogs, and feedback render with labels/focus; no remote assets. | Complete |
| 3 | Home and navigation | Four hash routes, unknown-route recovery, first-time explanation, and reopened help work. | Complete |
| 4 | Nature Bingo | Nine distinct prompts, eight line patterns, full-board detection, undo, and confirmed/canceled replacement verified; central reward intents prepared. | Complete |
| 5 | Predefined quests | Eight separate definitions with indoor/adapted options, available/active/completed states, and completion records; claim reserved for phase 6. | Complete |
| 6 | Coin reward system | Validated quest claims and bingo awards; balance/history/milestones and feedback; duplicate/reset/undo checks pass; initial cap is 105. | Complete |
| 7 | Local persistence | Versioned state restores on refresh; confirmed invalid-data recovery, failed-write warning/retry, and competing-tab warning verified. | Complete |
| 8 | Responsive polish and accessibility | 320px/desktop/zoom checks pass; keyboard/dialog focus, contrast, 48px targets, labels, non-color cues, and reduced motion verified. | Implemented; responsive/keyboard browser checks passed; broader accessibility audit pending |
| 9 | Tests and manual verification | Approved tooling covers rewards, catalog, transitions, storage failures, and journeys; typecheck/build/tests pass; manual evidence recorded. | 46 automated tests and V2 browser checks passed; release manual checklist pending |
| 10 | README screenshots and setup | Real screenshots/alt text, tested install/run/build commands, actual feature status, limits, asset attribution, and selected release license documented. | Setup and six screenshots complete; release license pending |

## Workflow
Implement one agreed phase/slice at a time after approval. Verify behavior when introduced; phase 9 consolidates tests rather than postponing correctness. Earlier phases may use memory state; do not claim refresh persistence before phase 7. Use accessible primitives from phase 2 before final polish in phase 8.

Do not implement roadmap ideas within these phases. Update affected documents when decisions change. Ask before scope expansion, dependencies, or substantial complexity. License selection is required before public release.
## Phase 1 verification — 2026-10-10
- Created React/TypeScript/Vite entry points, strict type checking, exact dependencies/lockfile, .gitignore, .nvmrc, and agreed directories.
- Implemented only four placeholder views, native hash links, active navigation, unknown-route recovery, route titles/focus, and skip-to-content.
- Added initial DESIGN.md tokens/global CSS and eight navigation tests; no adventure/reward/persistence logic.
- npm run build passed, including TypeScript checking. npm test passed: one file, eight tests, using the configured single thread worker.
- Development server started on http://127.0.0.1:5173/ and served HTTP 200 with the correct entry module. It was stopped after verification.
- Default Vitest fork execution stalled and was interrupted; a thread worker resolved startup. No full browser visual/accessibility audit was performed; it remains in phase 8.
- No screenshots, release license, or Git repository were created. Documentation retained and updated to distinguish implemented scaffold from plans.
## Functional MVP + visual redesign verification — 2026-10-10
- Reused scaffold/routing and existing dependencies; package.json and package-lock.json unchanged.
- Implemented Home, 3×3 Bingo, eight quests, separate complete/claim actions, balance, progress history, static milestones, help, dialogs, empty/error states, and original SVG companion/icons/favicon.
- Central rules: first bingo line 10, first full board 20 additional, eight quests totaling 75; maximum 105. Each line celebrates once per board; coins do not replenish on resets. Quest durations are suggestions, not timers.
- Persisted one validated snapshot. Invalid records remain untouched until confirmed recovery; write failures warn/retry; detected cross-tab changes pause mutations.
- Final npm test: four files, 35 tests passed. Final npm run build: TypeScript and production bundle passed.
- Real Edge checks passed for all four views at 320/390/768/1280 CSS pixels (16 combinations), no horizontal overflow, and all visible buttons/navigation meeting the tested 48px height threshold.
- Browser checks exercised keyboard cell activation, line/full-board rewards, quest claims, actual page reloads, duplicate prevention, board cancellation/reset, malformed-data recovery, modal focus/Escape/restoration, and reduced-motion preference. No final console errors. A local favicon resolved an intermediate resource error.
- Six screenshots captured: Home desktop/mobile, Bingo desktop/mobile, Quests desktop, Progress desktop. SVG artwork is original; no external images/fonts or API calls added.
- Release follow-up: full screen-reader and cross-browser review, browser zoom/reflow review, family content feedback, and license selection. No claim of an exhaustive accessibility audit or public deployment.
Temporary browser artifacts are excluded from the Vite watcher as well as Git to avoid Windows file-lock warnings. Verification browser and dev server were stopped after checks.

## Visual Redesign V2 — 2026-10-10

- [x] Stage A: compact logo/coin HUD, pixel frog device scene, prominent Bingo invitation, three quest entries, and mobile bottom navigation.
- [x] Approved palette and self-hosted Press Start 2P/Nunito; Lucide React is the only added package. Bundled licenses and original art sources recorded in ASSETS.md.
- [x] Stage A build and 35 existing tests passed; browser checks verified fonts, navigation, and first-screen game invitation.
- [x] Stage B: per-cell SVG freehand ink, mouse/touch/pen pointer capture, bounded strokes, deliberate two-stroke X completion, cancellation, partial-ink clearing, Undo, and equivalent keyboard Mark control.
- [x] Persisted partial/completed ink and compatible legacy-save upgrade; coins, quests, history, corruption recovery, failed saves, and competing-tab protections retained.
- [x] Illustrated Bingo tiles, open quest list, and compact keepsake/progress view; obsolete card-grid styling removed.
- [x] Final build and 46 tests in five files passed. Edge checks passed at 320/390/768/1280 pixels on all four views, with no horizontal overflow or tested button-height failures.
- [x] Browser-simulated mouse/touch/pen strokes, stationary page during touch drawing, cancellation, confined ink, reload, redraw reward protection, full-board/reset, quest claim, legacy upgrade, keyboard fallback, dialog Escape, and reduced-motion preference verified. Final console errors: none.
- [x] Six actual V2 screenshots refreshed; README, DESIGN, PRODUCT, ARCHITECTURE, and asset notes updated.
- [ ] Physical touch/stylus device testing, full screen-reader/cross-browser/zoom audit, family feedback, and overall project license selection before public release.

The two described reference images were unavailable; V2 follows the supplied written direction. No backend, authentication, API, pet mechanics, reward spending, or future roadmap features were added.
## CSS architecture refactor — 2026-10-10

- [x] Inspected CSS imports, TSX class names, component/feature structure, and existing tokens before editing; proposed the file split before implementation.
- [x] Split global.css into base, reusable component, layout, Home, Progress, and feature-local Bingo/Quests styles. Moved font-face declarations to global.css; added tokens for existing literal palette values and pixel border/shadow without changing values.
- [x] Updated main.tsx to import each file once. Preserved all 217 existing rules, including mobile and reduced-motion behavior; no selectors or application logic removed.
- [x] npm test: 46 tests in five files passed. npm run build: TypeScript typecheck and production bundling passed.
- [x] Edge computed-style comparison matched the original CSS for every rendered element and pseudo-element across Home/Bingo/Quests/Progress at 320/390/768/1280 pixels (16 combinations).
- [x] Recorded file ownership in ARCHITECTURE.md. No visual redesign, runtime dependency, state, persistence, or drawing changes.