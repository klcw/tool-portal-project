# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks, no libraries, no build step. Files are opened or served exactly as written.
- One exception: a single small server function, written in plain JavaScript, may hold the AI key so it never reaches the browser. No other server code.

## Project Structure

- `CLAUDE.md` — this file.
- `marking-scheme.md` — the official Paper 1 band descriptors, condensed. The AI marker must follow it.
- `index.html` — the portal homepage.
- `tools/` — one page per tool (currently `marker.html`).
- `css/style.css` — shared styles, including the light and dark theme colours.
- `js/theme.js` — shared light/dark theme toggle.
- `js/marker.js` — the Essay Marker page's logic. `MARKING_URL` at the top is empty until the marking service exists.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.
3. Text must stay easy to read, with good contrast, in both the light and the dark theme.

## Visual Design

Design C, "Friendly Teal": Lexend for headings and Nunito Sans for body text (loaded from Google Fonts), a teal accent, pill-shaped buttons, and rounded cards. All colours are variables at the top of `css/style.css`, one set per theme.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.
- Marking must follow `marking-scheme.md`. Never invent marking criteria, bands, or penalties.

## Feature Plan

The portal is for GCE A Level General Paper, Paper 1 students. Visitors try small web tools.

### Portal structure

- **Homepage** (`index.html`): the portal title, a short intro, and one card per tool. Each card has the tool's name, one line on what it does, and an Open button.
- **Opening a tool**: clicking a card goes to that tool's own page in `tools/`, for example `tools/marker.html`.
- **Getting back**: every tool page has the same header with a "Back to all tools" link to the homepage, plus the theme toggle.
- **Adding a tool later**: add one page in `tools/` and one card on the homepage. Nothing else changes.

### Phases

1. **Phase 1: the portal plus its first tool.** The homepage, the shared header and theme toggle, and exactly one tool: the Essay Marker. In: an essay question and the essay, in two paste-in fields. Out: a score out of 50 (Content 30, Language 20) with a written reason for each part.
   - [x] Portal homepage with a card that opens and closes (`index.html`).
   - [x] Marker page: two fields, word count, and a results view for the two scores, the total and the reasons (`tools/marker.html`, `js/marker.js`). Marking is not connected yet, so it says so and shows no scores.
   - [x] Marking scheme recorded from the 8881 syllabus (`marking-scheme.md`).
   - [ ] Connect AI marking, following `marking-scheme.md`: a small server function keeps the AI key private, and its address goes in `MARKING_URL` in `js/marker.js`. Needs an Anthropic API key, which is billed separately from a Claude plan. Expected answer: `{"content": {"score", "reason"}, "language": {"score", "reason"}}`.
2. **Phase 2: more tools.** Add further tools one at a time, chosen after seeing how students use the first.
