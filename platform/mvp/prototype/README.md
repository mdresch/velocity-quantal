Velocity Quantal — v0 Prototype

Purpose
- Lightweight prototype assets to import into v0.dev (or use locally) to demonstrate the core flows: Role selection, Dashboard, Pilot submission, Evidence viewer, Admin audit.

Contents
- `pages.md` — structured page definitions and interaction notes for each screen.
- `assets/` — placeholder images or exported wireframes (add if available).

How to use
- For v0.dev: create a new project and copy page titles and copy from `pages.md` into v0.dev pages; wire links according to actions.
- To run locally: this is a content-only scaffold. Use existing `platform/mvp` React app to plug in the flows quickly (`src/pages/*` already exists).

Suggested quick run (local dev)

```bash
cd platform/mvp
npm install
npm run dev
```

Notes
- Ensure `Docs/UI-Requirements.md` is visible to reviewers so they see acceptance criteria alongside the prototype screens.
