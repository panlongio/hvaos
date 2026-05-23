# 02 - Rules Document (Redlines & Constraints)

This document establishes the strict redlines for code modifications and execution behavior. Any codebase changes, configurations, or dependencies violating these rules will be rejected.

---

## 1. Universal Redlines

- **Spec Gate Protocol (方案先行)**: Before making any non-trivial modifications to the codebase (such as editing files, introducing dependencies, or altering core architecture), the AI assistant MUST present a detailed implementation plan in the chat and receive explicit approval ("approved", "continue", "同意") from the human.
- **Decision Recommendation (决策推荐)**: When multiple architectural paths or library choices are available, the AI must explicitly recommend the optimal solution and detail the rationale. Simply listing options for the user to select is strictly forbidden.
- **Credential & Secret Protection (凭证安全)**: Never hardcode api keys, database credentials, passwords, or private configurations in any source file. All credentials must be loaded via environment variables (`process.env`) and defined in a `.env.example` file.
- **Surgical Code Modification (手术刀修改)**: Follow the principle of least modification. Only modify lines directly relevant to the current task. Do not reformat unrelated files or introduce massive refactorings unless specifically authorized.

---

## 2. Software Engineering Rules

### 💻 Language & Type Systems
*   **Strict Typing**: Always use strict TypeScript configuration. The use of `any`, `ts-ignore`, or compiler-escaping shortcuts is strictly prohibited. Define explicit interfaces or types for all function signatures and data payloads.
*   **Functional Patterns**: Prefer pure functions, immutability, and explicit error-handling types (e.g., returning an Either/Result type instead of throwing runtime exceptions) where applicable.

### 🎨 UI & Aesthetics
*   **Premium Visuals**: Avoid default styling or unstyled components. Implement custom CSS styling with CSS variables for dynamic theme support. Add subtle micro-animations (e.g., scale transitions on hover, keyframe loading shimmers).
*   **Responsive Layouts**: Design mobile-first using CSS Flexbox or Grid. Ensure perfect alignment, consistent padding (using a 4px/8px grid system), and correct contrast ratios for accessibility.

### 🗄️ Database & Transactions
*   **Schema Migration Guard**: Any schema modification must be represented as a discrete migration file. Direct edits to existing live schemas are forbidden.
*   **Transaction Integrity**: Multi-table updates or sequential inserts/deletes must be executed within an explicit database transaction block. Always ensure connection pools are released properly.
