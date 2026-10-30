# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks, no libraries, no build step. Files are opened or served exactly as written.
- One exception: a single small server function, written in plain JavaScript, may hold the AI key so it never reaches the browser. No other server code.

## Project Structure

- `CLAUDE.md` — this file.
- `index.html` — the portal homepage.
- `tools/` — one page per tool (currently `question-analyser.html`).
- `css/style.css` — shared styles, including the light and dark theme colours.
- `js/theme.js` — shared light/dark theme toggle.
- `js/analyser.js` — the Essay Question Analyser's logic.

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

## Feature Plan

The portal is for GCE A Level General Paper, Paper 1 students. Visitors try small web tools.

### Portal structure

- **Homepage** (`index.html`): the portal title, a short intro, and one card per tool. Each card has the tool's name, one line on what it does, and an Open button.
- **Opening a tool**: clicking a card goes to that tool's own page in `tools/`, for example `tools/question-analyser.html`.
- **Getting back**: every tool page has the same header with a "Back to all tools" link to the homepage, plus the theme toggle.
- **Adding a tool later**: add one page in `tools/` and one card on the homepage. Nothing else changes.

### Phases

1. **Phase 1: the portal plus its first tool.** The homepage, the shared header and theme toggle, and exactly one tool. No AI in this phase.
   - [x] Portal homepage with a placeholder "Tool 1 — coming soon" card that opens and closes (`index.html`, `tools/tool-1.html`).
   - [x] First tool, replacing the placeholder: the Essay Question Analyser (`tools/question-analyser.html`, `js/analyser.js`). It matches words in a question; it does not use AI.
2. **Phase 2: more tools.** Add further tools one at a time, chosen after seeing how students use the first.
3. **Phase 3 (later): AI marking.** The Essay Marker. In: an essay question and the essay. Out: a score out of 50 (Content 30, Language 20) with reasoning. A small server function keeps the AI key private. Needs an Anthropic API key, which is billed separately from a Claude plan.
