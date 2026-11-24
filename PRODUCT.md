# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, served by the same tool:

- **Enthusiasts and collectors** setting their own watches at home, crown pulled out, one watch at a time.
- **Professional watchmakers** at a workshop bench, setting several watches a day, who need speed and precision above everything else.

Both are looking at the screen in short glances while their hands are busy with the watch.

## Product Purpose

A reference for setting analog watches by hand: the exact time, date, day, month, leap-year cycle and moon phase, shown the way a watch shows them, synchronized with the device's operating-system clock. A session succeeds when all of these hold:

- **Set to the second:** release the crown exactly on the reference :00 (hacking).
- **Do not damage the calendar:** never use the date quick-set inside the forbidden window.
- **Full calendar right first time:** day, date, month, leap cycle and moon phase all aligned.
- **Recalibrate hands:** zero position to realign hands after a battery change or service.

## Positioning

The screen speaks the watch's own language. Instead of a digital clock the user must translate, it shows analog hands and calendar complications for the generic architecture they are holding, moving with the same beat (quartz 1/s, mechanical 6/s or 8/s, continuous), plus bench-only aids no clock app has: forbidden-window warning, countdown to the next :00, and zero position.

## Operating Context

- Used on a phone leaning on the bench (portrait, glanced at from about 40 cm) and on a fixed monitor or tablet beside the bench (landscape), equally.
- Hands are occupied: interactions are rare and coarse (pick an architecture, a time zone, toggle zero position or keep-screen-on), reading is constant.
- Screen stays on through the Screen Wake Lock API, which needs HTTPS and a user gesture.
- Flow requested by the owner: a default watch at the top, then a choice by architecture (full calendar and so on) below.

## Capabilities and Constraints

- 100% client-side SPA (React 18, Vite, TypeScript, Tailwind 3), installable PWA, deployed to Cloudflare Pages at setmywatch.oliverops.com.br. No backend, no accounts.
- Engine already built and tested in `src/motor` and `src/hooks`: time source live/offset/frozen, time zones through `Intl` (DST-correct), hand angles per movement, Gregorian leap rule, L/+1/+2/+3 cycle, mean-synodic moon phase, forbidden window (default 21h–03h, per architecture), ms to next minute.
- Generic architectures only: 3 hands + date, day-date, multifunction (day, date, 24h), perpetual calendar, GMT / second time zone. No brands, no model names, no reproduction of real branded dials.
- Accuracy depends on the device's NTP-synced clock; the app does not correct it.
- Interface language: Brazilian Portuguese.

## Brand Commitments

Name: SetMyWatch. Part of the owner's OliverOps family of apps (traia, nummus), which share stack and deployment but not a visual identity. No other brand assets exist yet; the current favicon is a placeholder.

## Evidence on Hand

None. No testimonials, users, metrics or press exist; future work must not invent them.

## Product Principles

1. **Glanceable over complete:** every critical reading (time, second, forbidden window, countdown) must be legible in a half-second glance from bench distance.
2. **Mirror the watch:** show information the way the watch on the bench shows it, so the user copies positions instead of converting numbers.
3. **Never let the user hurt the movement:** danger (forbidden window) is impossible to miss when active and silent when not.
4. **Precision is visible:** the second hand's beat and the :00 countdown must be trustworthy to the frame.
5. **Hands-free by default:** once configured, the screen needs no touch until the watch is done.

## Accessibility & Inclusion

High contrast is a functional requirement (bench lighting, distance, older eyes), not a theme. Critical states must not rely on color alone.
