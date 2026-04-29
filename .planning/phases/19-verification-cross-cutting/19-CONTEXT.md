# Phase 19 Context — Verification

## Scope

Phase 19 validates v1.2 performance work and adds a regression guard for future changes.

## External Constraints

- PageSpeed Insights API is quota-blocked in this environment (`429 RESOURCE_EXHAUSTED`, `quota_limit_value: 0`).
- Lighthouse CLI refuses to run on this machine because Node is x64 while Chrome is arm64 on Apple Silicon; producing lab scores would be misleading.

## Local Verification Strategy

- Use production build served locally.
- Use Playwright browser performance entries for transfer/encoded bytes.
- Verify SEO metadata in browser.
- Add e2e guard for mobile initial page weight and no initial MP4 request.

## Key Results

- Mobile `/` production transfer: 901 KB.
- Mobile `/` initial showreel video requests: 0.
- Mobile `/privacy` production transfer: 508 KB.
- `/privacy` canonical and `index, follow` verified.
