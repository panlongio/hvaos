# 04 - Context Document (Publication State & Style Guide)

This document tracks the active publishing channels, demographic targets, style preferences, and past content experiments to maintain brand continuity.

---

## 1. Distribution Channels & Targets


> [!IMPORTANT]
> **Local Environment Variable Isolation**: Never hardcode local file paths, credentials, tokens, or local machine-specific configurations inside this file. When defining environmental differences, use env variables (e.g. `DB_URL=env.DB_URL`) and load the real value from a local `.env` file to prevent exposing sensitive keys or causing Git merge conflicts for the team.


*   **Active Platforms**: `WeChat Official Account (Markdown-based layout), Dev.to, and Medium.`
*   **Target Demographics**: `Developers, junior engineers, tech leads, and technical product managers.`
*   **Preferred Layout Tooling**: `mdnice (for WeChat styling) using the dark-mode/neon code template.`

---

## 2. Editorial Debt & Outstanding Tasks

Keep these outstanding editorial tasks in mind during draft creation:
- **Style Cleanup**: A few older articles on the blog used a formal, third-person writing style. Avoid referencing them as tone templates.
- **Image Asset Standardization**: We lack a unified code snippet generator template, leading to mismatched visual aesthetics across different posts.
- **Tag Consolidation**: The blog has a messy taxonomy (over 45 custom tags). Stick strictly to the primary tags: `WebDev`, `AI-Engineering`, `Workflow`, and `Career`.

---

## 3. Retrospective Warnings (Avoid Repeating Mistakes)

> [!WARNING]
> **AI Assistant Alert: Do NOT recommend or adopt these content approaches under any circumstances.**
> 
*   **Attempt 1: Fully Automated AI Article Generation**
    - *Method tried*: Input raw topics and had AI output complete articles to publish directly.
    - *Failure reason*: Led to generic, dry content with subtle factual inaccuracies, causing a drop in subscriber engagement.
    - *Conclusion*: Content must follow human-designed outlines, and all code and facts must be manually verified. Pure AI-generated text without human restructuring is banned.
*   **Attempt 2: High Frequency Daily Posting**
    - *Method tried*: Published short, low-depth news articles every single day.
    - *Failure reason*: Subscriber fatigue and a significant drop in average read-time per article.
    - *Conclusion*: Prioritize depth over frequency. Limit distribution to 1-2 high-quality, long-form articles per week.
