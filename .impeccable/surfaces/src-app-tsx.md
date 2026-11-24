---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface: tela principal do SetMyWatch

Mode: Operate. Single screen; the whole app.

Audience/job: enthusiast or watchmaker with the crown pulled, glancing from bench distance. Reads time, second, countdown to :00, forbidden-window state; touches rarely (architecture, theme, zone, movement, zero, keep-screen-on).

Owner decisions (2026-11-24): technical-sheet world chosen; two themes, Folha (light, default) and Bancada (pure black, high contrast); app opens on the simple watch (3 hands + date), richer architectures chosen below; the chosen sketch felt too boxy, so the build must be softer and less gridded than the sketch.

## Direction contract

THESIS: the dial is the front view of a service-manual drawing, each complication named by a leader line and a callout, refusing the category default of a decorative dial plus a list of settings.

OWN-WORLD: matte drafting-film ground (Folha) or pure black (Bancada); graphite-ink linework in two weights; construction lines in non-photo blue, dashed, only on the dial; red revision pencil reserved for danger and the seconds hand; one condensed technical sans with tabular figures; rounded drafting-template corners, hairlines instead of boxed cells.

STORY: user sees the reference time instantly, copies the hand positions, waits for the :00 countdown, releases the crown; if the hour is in the forbidden window, a red reversed plate says so before the quick-set is touched.

FIRST VIEWPORT: dial dominant (left on desktop, top on phone) with leader-line callouts; title-block panel beside/below with digital time, date, countdown to :00, and the forbidden-window state; architecture switch as a segmented control under it; theme and settings in a compact toolbar.

FORM: candidate 4 of 7 (service-manual technical drawing), seed:6c654952bb6522c4. Raises: leader lines only at 0/45/90 with fixed-size labels; dial alone owns the centre; one type family; tabular right-aligned numbers; the danger plate is the only reversed element.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
