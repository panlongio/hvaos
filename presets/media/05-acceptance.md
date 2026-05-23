# 05 - Acceptance Document (Quality Gates & UX Standards)

This document represents the quality requirements that every piece of content must meet before it is approved for publication.

---

## 1. Compliance & Editorial Pre-checks

The AI assistant must run and pass the following quality pre-checks before submitting the final draft:
- **Restricted Word Check**: Scan the draft against platform-specific banned lists (e.g., e-commerce advertising restrictions, absolute superlative words).
- **Code Execution Verification**: Every code snippet included in the text must be checked to ensure it runs correctly and contains no syntax errors.
- **Link Auditing**: All external links and references must be checked to ensure they are active and secure.

---

## 2. Readability & Engagement UX Standards

*   **The 3-Sentence Hook Test**: Read the first three sentences. If they contain generalities or do not immediately present a core pain point, rewrite them.
*   **Visual Rhythm & Spacing**: Confirm that no paragraph exceeds 4 lines. Ensure there is a blank line separating every paragraph. Key phrases must be bolded.
*   **Logical Chunking**: Each main section must have a clear takeaway. If a section is longer than 500 words, split it using a subheader (`###`).

---

## 3. Length & Detail Budgets

*   **Word Count**: Standard articles must stay within 1,200 to 1,800 words. Short tutorials must be kept under 800 words to ensure high mobile retention.
*   **Visual Density**: Every 400 words must be accompanied by a visual element (a code card, a diagram, or a list block) to break up reading fatigue.

---

## 4. Negative Gatekeeper (Strictly Unacceptable Outcomes)

> [!CAUTION]
> **If any of the following flaws exist in the draft, it will be rejected and sent back for editing:**
> 
- `Presence of generic clichés (e.g., "In conclusion", "As we all know", "revolutionary solution").`
- `Hallucinated commands, inaccurate API descriptions, or invalid URLs.`
- `Excessive use of exclamation marks or overly aggressive marketing language.`
- `Incomplete placeholder sections (e.g., "[Insert code here]" or "[Explain details later]").`
