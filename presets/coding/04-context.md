# 04 - Context Document (System State & Historical Debts)

This document serves as the persistent memory of the codebase, tracking dependencies, active environment setups, technical debts, and failed technical approaches to prevent repeat mistakes.

---

## 1. Runtime Environment & Dependencies


> [!IMPORTANT]
> **Local Environment Variable Isolation**: Never hardcode local file paths, credentials, tokens, or local machine-specific configurations inside this file. When defining environmental differences, use env variables (e.g. `DB_URL=env.DB_URL`) and load the real value from a local `.env` file to prevent exposing sensitive keys or causing Git merge conflicts for the team.


*   **Project Environment**: `Vite + React SPA development environment with ESLint & Prettier.`
*   **Running Platform**: `Cloudflare Pages (Static Assets) & Cloudflare Workers (API Layer). Node.js v20.x for local builds.`
*   **Core Dependencies**:
    - Build tool: `vite@5.2.0`
    - Logic framework: `react@18.3.0`, `react-dom@18.3.0`
    - API communication: `fetch` (native API)

---

## 2. Technical Debts & Pending Optimizations

Keep these existing debts in mind when editing code and address them progressively:
- **Type Relaxations**: There are several legacy modules in the API layer where interfaces are not strictly typed (such as using generic objects instead of specific payload interfaces).
- **CSS Variable Inconsistency**: The application uses a mixture of utility classes and custom styles. Transition these to use global CSS variables defined in `/styles/variables.css`.
- **Error Boundaries**: The landing dashboard lacks a React Error Boundary, causing the entire page to blank out if a sub-component throws a rendering error.

---

## 3. Failed Attempts & Retrospective Warnings

> [!WARNING]
> **AI Assistant Alert: Do NOT attempt or propose the following solutions, as they have been proved broken or highly buggy in past iterations.**
> 
*   **Attempt 1: Migrating to Tailwind CSS for Styling**
    - *Method tried*: Replaced custom styles with Tailwind utility classes in a legacy branch.
    - *Failure reason*: It broke the delicate glassmorphic design and led to severe stylesheet inflation, conflicting with the MIT license goals of keeping CSS under 15KB.
    - *Conclusion*: Do NOT use utility-first frameworks. Always use clean Vanilla CSS with standardized CSS variables.
*   **Attempt 2: Utilizing Client-Side IndexedDB for Real-time State Sync**
    - *Method tried*: Stored real-time sync states in IndexDB directly without an abstraction layer.
    - *Failure reason*: Caused severe performance bottlenecks and write locks during rapid collaborative typing.
    - *Conclusion*: Always route real-time typing events through local in-memory state or lightweight local-first structures before batching writes.
