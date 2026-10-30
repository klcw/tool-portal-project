# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks, no libraries, no build step. Files are opened or served exactly as written.

## Project Structure

- `CLAUDE.md` — this file.
- `index.html` — the portal homepage.
- `tools/` — one page per tool (currently only the placeholder `tool-1.html`).
- `css/style.css` — shared styles, including the light and dark theme colours.
- `js/theme.js` — shared light/dark theme toggle.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.
3. Text must stay easy to read, with good contrast, in both the light and the dark theme.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.

## Feature Plan

The portal is for GCE A Level General Paper, Paper 1 students. Visitors try small web tools.

### Portal structure

- **Homepage** (`index.html`): the portal title, a short intro, and one card per tool. Each card has the tool's name, one line on what it does, and an Open button.
- **Opening a tool**: clicking a card goes to that tool's own page in `tools/`, for example `tools/marker.html`.
- **Getting back**: every tool page has the same header with a "Back to all tools" link to the homepage, plus the theme toggle.
- **Adding a tool later**: add one page in `tools/` and one card on the homepage. Nothing else changes.

### Phases

1. **Phase 1: the portal plus its first tool.** The homepage, the shared header and theme toggle, and exactly one tool: the Essay Marker. In: an essay question and the essay. Out: a score breakdown with reasoning. A small server function keeps the AI key private.
   - [x] Portal homepage with a placeholder "Tool 1 — coming soon" card that opens and closes (`index.html`, `tools/tool-1.html`).
   - [ ] Essay Marker tool, replacing the placeholder.
   - [ ] Server function that keeps the AI key private.
2. **Phase 2: more tools.** Add further tools one at a time, chosen after seeing how students use the first.
