# 05 - Acceptance Document (Quality Gates & UX Standards)

This document is the ultimate checklist that determines whether a task is complete. No delivery is accepted if it fails any of these criteria.

---

## 1. Automated Pre-checks & Gates

The AI assistant must run and pass the following quality checks before proposing a walkthrough:
- **Linting & Compilation**: Run `npm run lint` and `npm run type-check`. Zero errors and zero warnings are allowed.
- **Unit Testing**: Run `npm run test`. All tests must pass, and the code coverage report must show zero regressions.
- **Accessibility & Format**: Ensure code formatting complies with Prettier style standards by running `npm run format:check`.

---

## 2. Manual UX & Visual Standards

*   **Responsive layouts**: Verify that the interface looks perfect on resolutions ranging from 375px (mobile) to 1920px (desktop). Element overlap, text clipping, or broken margins are automatic failures.
*   **Aesthetics & Polish**: Ensure all UI elements use HSL/RGB tailored color schemes, subtle border borders (e.g. `1px solid rgba(255,255,255,0.1)`), and smooth ease-in-out transitions for hover and loading states.
*   **Zero Placeholders**: Never use placeholder images or unstyled mock divs. Edge cases like empty results, fetching errors, and loading states must be fully styled.

---

## 3. Resource & Performance Budgets

*   **Bundle Size**: Production build assets must increase by no more than 10KB for any single feature implementation. Total package size must be within 150KB.
*   **Performance Metrics**: The local build must maintain a Lighthouse Performance score of 95+ and a First Contentful Paint (FCP) of under 1.2 seconds.

---

## 4. Negative Gatekeeper (Strictly Unacceptable Outcomes)

> [!CAUTION]
> **If any of the following flaws exist in the delivery, the task will be immediately rejected and reverted:**
> 
- `Unresolved console.log, debugger statement, or commented-out debug code in production files.`
- `Hardcoded string configurations or raw API URLs (they must be loaded from variables or environment).`
- `Adding third-party packages to package.json without explicit human authorization.`
- `Broken links, unhandled JS exceptions, or empty states left as raw browser defaults.`
