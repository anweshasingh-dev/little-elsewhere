# Little Elsewhere — Permanent Project Rules

Project scaffolding and the functional MVP with visual redesign were explicitly approved. Future roadmap work still requires separate approval; permanent rules below remain in force.

1. Never implement future features without explicit approval or silently expand the MVP in PRODUCT.md.
2. Prefer simple maintainable solutions over unnecessary abstractions; no backend for hypothetical needs.
3. Separate UI, application logic, quest/bingo data, and persistence.
4. Centralize coin awards, validate completion, derive balance from a validated ledger, and prevent duplicate claims with stable award keys.
5. Persist completion and reward changes together. Never directly increment coins in UI effects.
6. Use clear names and small reusable components with explicit typed transitions.
7. Follow accessibility best practices: semantics, focus, contrast, large targets, reduced motion, and non-color cues.
8. Avoid manipulative engagement, shame, streak-loss penalties, urgency, and endless reward loops.
9. Collect no unnecessary children's information. No analytics, ads, photos, location, or activity transmission in this MVP.
10. Never claim an integration or platform capability works unless implemented and tested. Activity is self-reported.
11. Update documentation when implementation decisions change; distinguish plans from implemented behavior.
12. Ask before adding dependencies or substantial architectural complexity. A proposed stack is not installation approval.
13. Inspect existing code and preserve working code and user changes; never overwrite unnecessarily.
14. Implement incrementally after approval and verify each slice before marking it complete.
15. Never silently erase invalid local data. Explain recovery consequences and require confirmation.
16. Keep the approved coin economy finite and nonnegative. Changing amounts, repeatability, reset rules, or spending requires approval.
17. Review activity safety and provide accessible/indoor alternatives. Never encourage tasting unidentified objects, handling wildlife, leaving supervision, or approaching hazards.
18. Treat roadmap ideas as possibilities, not commitments.