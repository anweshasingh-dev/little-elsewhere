# Little Elsewhere — Visual Design V2

A tiny cozy adventure game for children: storybook warmth, a matcha handheld-pet aesthetic, and space to explore. The V2 brief governs this redesign. The two described reference images were not included in the available attachment; this implementation follows the written art direction.

## Color system
| Token | Color | Role |
| --- | --- | --- |
| paper | #F7F7ED | Warm ivory canvas |
| meadow | #DDE9D2 | Pet screen and game accents |
| sage | #A8C18D | Pixel landscape, subtle collected details |
| forest | #4F604D | Borders, strokes, controls |
| ink | #293D30 | Readable text |
| peach | #E9B49A | Flowers and warm illustration accents |
| brown | #A77A61 | Coin outline and natural details |

Use deep ink/moss for text; pastel fills never imply sufficient contrast. Verify at least 4.5:1 normal text and 3:1 essential UI boundaries. A few sunny coin accents are allowed. No gradients or glass surfaces.

## Typography
Self-host unmodified Press Start 2P and variable Nunito under public/fonts/ with their SIL OFL licenses. Use font-display: swap and sensible local fallbacks. Press Start 2P is reserved for short game labels, counters, and selected milestone labels. Nunito carries headings, actions, body copy, and descriptions. No remote font requests at runtime.

## Composition
Home is one open scene: compact logo/coin HUD, short greeting, one pixel pet device alongside a prominent Bingo invitation, three compact quest entries, and subtle discovery dots. It is not a grid of equally weighted cards. Mobile keeps the primary game link near the companion, followed by the short quest list.

Bingo is the main tactile game surface: nine large illustrated tiles with space for strokes, a compact discovery count, and optional help below. Quests are an open adventure list with small artwork and a clear current action. Progress is a small keepsake shelf with earned marks and readable discovery notes, not a statistics dashboard.

Reserve chunky pixel borders for the pet device, Bingo game surface, and earned keepsakes. Other surfaces use whitespace or a simple divider. Remove redundant metadata, labels, outlines, and nested cards.

## Illustration and controls
Original local pixel frog/landscape and custom nature illustrations provide visual identity. Lucide React supplies consistent 1.8px interface strokes for navigation, arrows, help, undo, and close; interface icons do not replace nature artwork. Assets and bundled licenses are recorded in ASSETS.md. No hotlinked images.

Controls remain at least 48px tall with visible keyboard focus and understandable labels. Native dialogs are reserved for help and destructive reset/recovery. There is no cell-completion modal. Reward messages are inline and brief; the coin HUD has a short collection bounce. Respect prefers-reduced-motion.

## Drawing interaction — Stage B
Use pointer events with a per-cell SVG overlay and normalized coordinates. Two deliberate crossing diagonal strokes form an X; taps and tiny scribbles cannot complete a tile. Keep partial strokes visible and allow undo. Confine ink to the tile, cancel interrupted strokes, and capture the active pointer. touch-action: none applies only to drawing surfaces; normal page scrolling remains available elsewhere.

Completed tiles retain the child's ink rather than turning into green buttons. A separate native completion control uses the same reducer/reward logic for keyboard users or children who cannot draw. Accessible completion uses a simple hand-drawn X and explicit state text. Refresh preserves ink and earned state; older saves retain their completions through a compatible upgrade.

## Accessibility and safety
Semantic headings/navigation/buttons, native modal focus, clear non-color completion states, readable labels, adapted activities, and polite reward announcements. Drawing is optional, never an ability requirement. Do not enforce time or precise motor skills. Support 320px layouts, 200% zoom, reduced motion, and a normal scrolling route around the board. Wider screen-reader and cross-browser release checks remain necessary.