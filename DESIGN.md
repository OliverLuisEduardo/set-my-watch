---
name: SetMyWatch
description: Bench reference for setting analog watches, drawn as a watch service-manual sheet.
colors:
  folha-ground: "#ECF0EF"
  folha-surface: "#F6F8F7"
  folha-ink: "#14181B"
  folha-ink-secondary: "#465058"
  folha-construction: "#3E7BD6"
  folha-revision: "#C4231B"
  folha-on-revision: "#FFFFFF"
  bancada-ground: "#000000"
  bancada-surface: "#0C0E0F"
  bancada-ink: "#FFFFFF"
  bancada-ink-secondary: "#B0B8BE"
  bancada-construction: "#4A7DC4"
  bancada-revision: "#FF4D40"
  bancada-on-revision: "#000000"
typography:
  display:
    fontFamily: "Barlow Semi Condensed, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 9vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Barlow Semi Condensed, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  title:
    fontFamily: "Barlow Semi Condensed, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Barlow Semi Condensed, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.375
    fontFeature: "tnum"
  label:
    fontFamily: "Barlow Semi Condensed, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  control: "0.625rem"
  gabarito: "0.875rem"
  balloon: "9999px"
spacing:
  xs: "4px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "56px"
components:
  segment:
    textColor: "{colors.folha-ink-secondary}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
  segment-selected:
    backgroundColor: "{colors.folha-surface}"
    textColor: "{colors.folha-ink}"
    rounded: "{rounded.control}"
  danger-plate:
    backgroundColor: "{colors.folha-revision}"
    textColor: "{colors.folha-on-revision}"
    rounded: "{rounded.gabarito}"
    padding: "12px 16px"
  select-field:
    backgroundColor: "{colors.folha-surface}"
    textColor: "{colors.folha-ink}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
---

# Design System: SetMyWatch

## Overview

**Creative North Star: "A Folha de Calibre"**

The whole screen is the front-view sheet of a watch service manual. The dial is drawn, not rendered: ink linework on drafting film, each complication named by a leader line that ends in a lettered balloon, and the same letters repeated in a legend beside it, the way a parts list sits beside a technical drawing. Everything a watchmaker needs to copy (hand positions, date, the second to release the crown) reads in a glance from bench distance.

The system lives in two themes from one set of rules. **Folha** is cool matte drafting film for daylight and the bench lamp. **Bancada** is pure black with white ink for maximum contrast at a distance. Density is low and deliberate: one dial, one title block, one segmented control. Ornament is rejected outright: no imitation enamel, no bevels, no glow, no brand dials.

**Key Characteristics:**
- Dial as a technical drawing: two line weights, dashed construction lines, leader lines at 0°, 45° and 90° only.
- Lettered balloons on the dial mirrored one-to-one in the legend.
- One condensed technical face with tabular figures for every role.
- Red appears only for danger and for the beat of the seconds.
- Hairline separators instead of boxed cells; rounded drafting-template corners.

## Colors

A restrained ink-on-film palette: neutrals carry almost everything, blue is only ever construction geometry, and red is reserved for revision (danger) and the seconds beat.

### Primary
- **Drafting Ink** (folha-ink / bancada-ink): every line, numeral and solid hand; the selection ring on controls.

### Secondary
- **Non-Photo Construction Blue** (folha-construction / bancada-construction): dashed construction axes, the subdial pitch circle, the calm hatching of the forbidden window, and the focus outline. Never text, never fill.

### Tertiary
- **Revision Pencil Red** (folha-revision / bancada-revision): the seconds hand, the countdown pointer, the date marking and hatching while the forbidden window is active, and the danger plate.

### Neutral
- **Cool Drafting Film** (folha-ground): page ground in Folha; deliberately cool, never cream.
- **Film Highlight** (folha-surface): dial face, settings panel, selected segment.
- **Graphite Secondary** (folha-ink-secondary): seconds digits, labels, secondary legend text (≥4.5:1 on the ground).
- **Pure Black** (bancada-ground) and **Bench Surface** (bancada-surface): the Bancada equivalents.

### Named Rules
**The Revision Rule.** Red means "the movement can be hurt" or "this is the beat". Anything calm is ink or construction blue; the forbidden-window hatch is blue until the zone is active.

**The One Plate Rule.** The danger plate is the only reversed element on screen. Selection is never shown by ink reversal.

## Typography

**Display Font:** Barlow Semi Condensed (self-hosted, weights 400/500/600/700), with system-ui fallback.

**Character:** a condensed engineering grotesk that reads like drawing lettering; tabular figures everywhere so digits never jitter while the clock runs.

### Hierarchy
- **Display** (700, clamp(3.5rem, 9vw, 6rem), 0.9): the digital reference time; seconds in graphite.
- **Headline** (700, 3rem to 4.5rem in the last 10 s, 1): countdown to :00.
- **Title** (700, 1.25rem): danger plate title, release cue "Solte a coroa agora".
- **Body** (400, 1rem to 1.125rem, 1.375): date line, explanations, legend names.
- **Label** (600, 1rem): segments, toolbar buttons, legend values (1.25rem).

### Named Rules
**The One Face Rule.** One family carries every role; hierarchy comes from weight, size and ink tone, never from a second face or a monospace costume.

## Layout

Desktop (≥1024px): two columns, the dial left (square, capped so it fits the viewport height) and the title block right (360–440px), with the architecture control under the dial. Gap 56px horizontally, 24px vertically; page max width 1600px.

Phone: single column. Toolbar collapses to icon-only buttons on one row; dial, then the title block (time, legend, countdown, zone state); the architecture control comes last because it is touched rarely. When the forbidden window is active, the danger plate moves directly under the time so it sits in the first viewport.

Below 640px, small SVG labels scale up (subdial labels to 17 units, GMT ring to 18) so they render near 12 CSS px; the month subdial shows only quarter letters there, keeping all twelve ticks.

## Elevation & Depth

Flat by design. There are no shadows anywhere; depth is drawn the way a technical sheet draws it, with line weight, hatching and tone. The dial face sits on a slightly lighter surface than the ground, and that is the only layering.

### Named Rules
**The Two Weights Rule.** Linework uses exactly two weights: heavy (2.6) for the case, hour indices, main and subdial hands and the seconds hand; fine (1.1) for leaders, construction, minute ticks and subdial rings.

## Shapes

Drafting-template corners: containers round at 0.875rem, controls at 0.625rem, balloons are full circles. Lists are divided by hairlines (ink at 20%) instead of boxes. Hands are lozenges; the GMT hand ends in an outlined triangle; the moon aperture shades its dark side with hatching.

## Components

### Buttons and segments
- **Shape:** 0.625rem corners, 44px minimum height.
- **Default:** transparent, ink or graphite text, icon and label; hover tints the ground with ink at 10%.
- **Selected / pressed:** film-highlight fill, bold text and a 1.5px inset ink ring. Never inverted.
- **Groups:** theme and architecture selectors sit in a 6%-ink tray as radio groups.

### Inputs / Fields
- **Style:** native selects, film-highlight fill, ink border at 60%, 44px tall, 0.625rem corners.
- **Focus:** 2px construction-blue outline, 3px offset, following the control's own corner.

### Navigation
- Top toolbar: wordmark left; theme (Folha/Bancada), Posição zero, Tela acesa, Ajustes right. Labels hide on phones but stay as accessible names. Ajustes opens an inline settings panel (movement, reference zone, GMT second zone).

### Dial (signature)
Front-view drawing of the selected architecture. Leader lines draw on (0.7s, exponential ease-out) when the architecture changes; this is the one authored motion and is disabled under reduced motion. Balloons turn red only for the date while the forbidden window is active.

### Countdown scale (signature)
A drawing scale bar from 0 to 60 with a red pointer that steps with the movement's beat. The number grows in the last 10 seconds; at :00 it reads "00" with "Solte a coroa agora", and it never shows 60.

### Danger plate (signature)
Revision-red plate with a drawn revision delta, a title and the recovery instruction. The only reversed element.

## Do's and Don'ts

### Do:
- **Do** draw every new complication with a leader line at 0°, 45° or 90° ending in a lettered balloon, and add the same letter to the legend.
- **Do** keep linework at the two weights (2.6 and 1.1).
- **Do** use tabular figures for every number that changes.
- **Do** keep red for danger and the seconds beat; calm states use ink or construction blue.
- **Do** design both themes for every change; Bancada is pure black, not dark gray.

### Don't:
- **Don't** imitate branded dials or real watch models.
- **Don't** add ornament: no enamel textures, bevels, gradients, glow or skeuomorphic cases.
- **Don't** use neon-on-black "gamer" styling in Bancada.
- **Don't** mark selection by inverting ink; the danger plate owns reversal.
- **Don't** box information into cells; divide with hairlines.
