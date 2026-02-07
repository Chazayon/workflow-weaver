

# Book Production Workflow Dashboard

A modern web UI to control your multi-agent book production pipeline and manage your growing romance fantasy library.

---

## 1. Dashboard Home

An at-a-glance overview of your production status:
- **Active productions** — chapters currently in the pipeline with their current phase
- **Recent completions** — last few finished chapters with quick links
- **Series progress cards** — visual progress bars for each series/book (e.g., "Sanctuary of the Damned: Book 1 — 8/24 chapters complete")
- **Quick stats** — total chapters produced, words written, approval rate

---

## 2. Series & Book Library

A browsable content management area organized by your file structure:
- **Series grid** — cards for each series (Sanctuary, Pactbound, Gilded Shadows, etc.)
- **Book view** — drill into a series to see books with chapter lists
- **Chapter detail view** — view scene brief, prose, metadata, and production log for any completed chapter
- **Search & filter** — find chapters by POV character, status, or keyword

---

## 3. New Chapter Production

A guided form to kick off chapter production:
- **Chapter input form** — chapter number, POV character, plot summary, character list, location, and any notes
- **Context preview** — shows what previous chapter context will be loaded (closing moment, emotional state, plot threads)
- **Series Bible reference** — display relevant excerpts being fed to agents
- **Character voice call sheet preview** — quick view of the selected POV character's voice markers
- **"Start Production" button** — sends the input to your LangGraph API

---

## 4. Visual Workflow Pipeline

A real-time view of the 6-phase production process:
- **Phase tracker** — visual pipeline showing: Initialization → Scene Brief → Brief Review → Prose Generation → Prose Review → Finalization
- **Live status indicators** — each phase shows pending/in-progress/approved/needs-revision
- **Phase detail panels** — click any phase to see its output (scene brief content, prose text, orchestrator notes)
- **Revision loop visualization** — when the orchestrator sends something back, show it clearly with the revision notes

---

## 5. Review & Approval Interface

The core quality control UI for orchestrator checkpoints:
- **Scene Brief review** — display the full scene brief with the checklist (all sections present, action beats pure, sensory details, continuity callbacks, ship vibes)
- **Prose review** — display prose with voice consistency markers highlighted, word count, and the review checklist
- **Approve / Request Revision** — buttons to approve or send back with notes
- **Revision notes editor** — rich text area to flag specific passages and reference call sheet sections
- **Side-by-side view** — compare scene brief requirements against the generated prose

---

## 6. Production History & Logs

Track everything across your 26-book plan:
- **Production log timeline** — chronological view of all production activity
- **Chapter metadata viewer** — structured display of metadata.yaml contents (revision counts, quality check results, dates)
- **Export options** — download prose, scene briefs, or full chapter packages

---

## Design & Layout

- **Sidebar navigation** — collapsible sidebar with sections for Dashboard, Library, New Chapter, Active Productions, and History
- **Clean, professional aesthetic** — dark mode support, card-based layouts, warm accent colors fitting the romance fantasy genre
- **Responsive design** — works on desktop for primary use, tablet-friendly for reviewing prose on the go

---

## API Integration

- The UI will be structured to connect to your LangGraph API endpoints
- API service layer with clear interfaces so you can plug in your actual endpoints
- Mock/placeholder data included so the UI is fully functional and testable before connecting the live backend

