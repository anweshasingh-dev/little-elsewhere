# Little Elsewhere — Product

Status: Functional browser MVP implemented in the approved visual-redesign delivery. Future roadmap items remain ideas only.

## Vision and users
Make real-world exploration feel exciting, without guilt about screen time. Children need simple playful prompts; caregivers need safe activities, accessible alternatives, and predictable rewards.

Core loop: choose an adventure → put the device away → explore → return and record progress → earn coins → see earned milestones.

Assumptions: ages roughly 5–9 with caregiver support, English copy, one shared explorer profile per browser, and self-reported activity. Offline activities do not mean the website is guaranteed to load offline.

## Journeys
First visit explains the loop in three steps; help can be reopened. A child selects Bingo or starts a quest, explores with appropriate supervision, returns to mark discoveries or complete the quest, and sees calm reward feedback. Progress shows recorded achievements and encourages enjoying the rest of the day.

## Exact MVP
- Welcoming Home and navigation to Home, Bingo, Quests, and Rewards/Progress.
- Interactive 3×3 Nature Bingo with nine distinct safe prompts, persistent freehand two-stroke X marks, equivalent optional Mark/Undo controls, completion feedback for all eight lines (rows, columns, diagonals) and the full board. Every newly completed line celebrates once per board; only the profile-wide first line awards coins.
- Confirmed reset/new-board action clears marks, retains coins and reward eligibility history, and selects nine valid distinct prompts.
- Eight predefined quests in a separate data module. Each has ID, title, short description, category, effort, suggested duration, coin reward, icon, safe completion instruction, and indoor/adapted alternatives.
- Quest lifecycle: available → active → completed → claimed. An active quest may be abandoned and restarted; completed/claimed quests cannot be reopened.
- Centralized coin awards, local persistence, duplicate prevention, and brief reward feedback.
- Progress shows balance, completion history, and static earned milestones. No shop, spending, virtual inventory, or unlockable world.
- First-time help, responsive layouts, accessibility, and applicable loading, empty, completion, and error states.

## Exclusions
No accounts, backend, AI, external APIs, multiplayer, parental dashboards, app blocking, photos, location, timers, streaks, repeatable quests, or future-phase features. Dependencies require approval.

## Coin economy
Coins are recognition, not money; they cannot be purchased, transferred, or spent.

| Event | Coins | Limit |
| --- | ---: | --- |
| Mark a bingo square | 0 | No reward |
| First completed bingo line | 10 | Once per local profile |
| First completed full board | 20 | Once per local profile, additional to line reward |
| Claim completed quest | 5/10/15 | Once per quest ID |

Three gentle quests pay 5 each, three medium quests pay 10 each, two longer quests pay 15 each: 75 quest coins. Maximum total: 105. Effort is approximate activity size, not ability or enforced duration.

A full board grants both still-unclaimed bingo awards. Undo never subtracts coins or enables another payout. Board replacement never replenishes rewards. Clearing browser site data loses all progress; there is no economy-reset feature.

Static milestones: first recorded completion, 30 coins, 75 coins. They give no additional coins or collectible items. No urgent prompts or endless rewards.

## Acceptance criteria
- All four views work by keyboard and touch; first-time help can be reopened.
- Exactly nine bingo cells; all eight line patterns and full-board detection verified.
- Undo, rapid activation, refresh, and board replacement never duplicate earned awards.
- Eight valid quest definitions sum to 75 coins; claim requires completion and pays exactly once.
- Balance derives from validated nonnegative ledger entries and cannot exceed 105 for this catalog.
- Successful saves restore board, quests, onboarding, history, and coins after refresh.
- Failed storage shows unsaved progress; invalid data offers explicit confirmed recovery without silent deletion.
- Canceling board reset preserves marks; confirming clears marks and retains coins/award keys.
- Usable at 320px and desktop with visible focus, readable contrast, 48px targets, reduced motion, and non-color status cues.
- Application collects no personal information and sends no activity data, analytics, ads, or remote-font requests.

## Roadmap — ideas only, not implemented or committed
### Phase 2: Grow Your World
Virtual garden/forest/miniature world; unlockable plants, decorations, animals, environments, and earned cosmetics. Define a separate spending economy before implementation.
### Phase 3: Family Screen-Time Agreements
Parent-controlled expectations before recreation, after screen sessions, or within routines; exceptions and child-friendly explanations. A web app cannot independently lock/unlock arbitrary apps such as YouTube. Genuine enforcement needs a separate feasibility/privacy investigation into supported platform capabilities, OS permissions, and parental consent.
### Phase 4: Shared Adventures
Private family/friend rooms, timers, shared goals, collective progress, cooperative sessions, privacy-conscious joining, and moderation.
### Phase 5: Explorer Journal
Photos, observations, drawings, notes, and discovery exploration. Potential image recognition/visual search must provide reliable educational sources and express uncertainty. Guardian controls and photo/location protection are prerequisites.
### Additional possibilities
Seasonal/themed bingo, rainy-day collections, family-created quests, ability-specific activities, collectible companions, printable cards, and family dashboards. Prioritize through feedback, feasibility, safety, and value; no implementation authorized.

## Open questions — nonblocking
Validate ages, reading level, shared-profile use, finite reward clarity, and activity adaptations with families. Select a license before public release.

## Delivery clarifications
The user-requested Phase 2 is the functional MVP and visual redesign, not the future Grow Your World roadmap phase. Today's quest spotlight is a finite selection, not daily reward regeneration. A static pixel frog is decorative artwork, not a virtual pet system. Progress counts distinct bingo activities ever marked (maximum nine), current board marks, completed quests, and earned coins. Indoor alternatives earn the same rewards; suggested durations are not enforced.
