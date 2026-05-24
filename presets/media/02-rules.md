# 02 - Rules Document (Redlines & Constraints)

This document establishes the strict editorial constraints and compliance boundaries for all generated content. Any drafts or scripts violating these guidelines will be rejected.

---

## 1. Universal Redlines

- **Rules Self-Maintenance & Anti-Bloat**: During the task delivery phase, if the project technical stack or business direction changes, the AI must proactively notify the user and update `01-intent.md` and `04-context.md`. To prevent rule bloat, when updating `04-context.md`, keep at most 5 of the most critical warning items per list. AI is strictly forbidden from modifying this file (`02-rules.md`) without explicit human approval via the Spec Gate.

- **Structure First (大纲先行)**: Before writing the complete draft of any article or script, the AI assistant MUST submit a detailed structure outline (including hook, section headings, core arguments, and CTA) in the chat and receive explicit human approval.
- **Decision Recommendation (决策推荐)**: When choosing between different angles (e.g., beginner-friendly vs. deep-dive) or hook styles, the AI must recommend the optimal choice based on current audience data and state the reason.
- **Copyright & Plagiarism Guard (版权红线)**: Absolutely no scraping or copying of copyrighted materials. When referencing external case studies, code examples, or quotes, always credit the original author.
- **Tone Preservation (基调对齐)**: Maintain a consistent brand persona. Do not shift from a casual/witty tone to an academic/clinical tone mid-article.

---

## 2. Content & Formatting Rules

### ✍️ Brand Voice & Tone
*   **Conversational Witty**: Explain concepts as if talking to a developer friend. Use humor and metaphors instead of academic explanations.
*   **No Fluff**: Avoid generic opening sentences like "In the rapidly evolving world of technology..." Get straight to the problem in the first sentence.

### 📐 Layout & Formatting
*   **The 3-Second Hook**: The first 3 lines must state a major pain point and promise a specific solution to capture attention.
*   **Visual Scannability**: Use Markdown headers (`##`, `###`) to separate sections. Keep paragraphs short (maximum 3 sentences per paragraph). Use bolding on key words to guide the reader's eye.
*   **Emoji Guidelines**: Limit emoji usage to 1 per subheader and 1-2 per bullet point list. Emojis must act as bullet points or visual anchors, not decorations.

### ⚠️ Compliance & Sensitive Words
*   **Platform Safeguards**: Drafts must be screened for platform-specific restricted terms (e.g., absolute claims like "the best", "first in class", or sensitive political/commercial vocabulary).
*   **Factual Accuracy Verification**: Code snippets, terminal commands, or statistics mentioned in the draft must be verified for accuracy before delivery. No hallucinated commands.
