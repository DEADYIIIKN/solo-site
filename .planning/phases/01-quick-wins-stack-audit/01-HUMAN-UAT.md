---
status: partial
phase: 01-quick-wins-stack-audit
source: [01-VERIFICATION.md]
started: 2026-04-22T17:10:00Z
updated: 2026-04-22T17:10:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. /privacy page renders correctly
expected: Navigating to http://localhost:3000/privacy shows a page with dark background (#0d0300), Montserrat font, placeholder privacy policy text in Russian, and "← На главную" back link — NOT a 404

### 2. Consultation modal button is visually centered
expected: Opening a consultation modal at any breakpoint (1440, 1024, 768, 480, 360px) shows the "оставить заявку" button text is vertically centered — no asymmetric top/bottom padding visible

### 3. Privacy link opens in new tab without toggling checkbox
expected: In the lead form (consultation modal), clicking "Политикой конфиденциальности" opens /privacy in a new browser tab; the consent checkbox state does NOT change

### 4. Label text outside link toggles checkbox
expected: Clicking any part of the consent label text that is NOT the privacy link toggles the checkbox on/off normally

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
