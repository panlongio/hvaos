# 03 - Processes Document (Workflows & Lifecycle)

This document maps out the daily, weekly, and monthly cycles for routine execution, financial auditing, and health reviews.

---

## 1. Routine Management Lifecycle (5-Step Cycle)

```mermaid
graph LR
    A[1. Goal Setting] --> B[2. Time Boxing]
    B --> C[3. Focus Execution]
    C --> D[4. Daily Reflection]
    D --> E[5. Weekly Audit & Sync]
```

1.  **Goal Setting**: Every Sunday evening, define 3 core outcomes for the upcoming week based on quarterly personal goals.
2.  **Time Boxing**: Pre-allocate blocks on the digital calendar for deep work, exercise, administrative chores, and family time.
3.  **Focus Execution**: Protect focus blocks. Turn off non-essential notifications and work through task list sequentially.
4.  **Daily Reflection**: Spend 5 minutes every evening logging the day's successes, logging expenses, and listing the next day's top 3 tasks.
5.  **Weekly Audit & Sync**: Conduct a 30-minute review session every Sunday. Review budget statements, update savings metrics, and log physical health stats.

---

## 2. Financial Logging & Budgeting Process

Execute this check at the end of every week to maintain financial health:
*   **Transaction Sync**: Extract and compile weekly expense transactions from bank alerts/apps.
*   **Categorization**: Allocate each transaction to its corresponding budget (e.g., Groceries, Rent, Utilities, Subscriptions, Leisure).
*   **Deficit Alerting**: If any category has utilized more than 85% of its monthly allowance, flag it in the weekly summary and suggest alternative spending plans for the remaining weeks.

---

## 3. Scheduling Conflict & Emergency Resolution

When schedule conflicts arise (e.g., flight delays, sudden meetings, double bookings) or budget is breached:
1.  **Automated Rescheduling**: If a conflict occurs, immediately identify the lowest priority task block and move it to a free slot later in the week. Protect sleep and exercise blocks.
2.  **Budget Compensation**: If the monthly budget is breached, calculate the deficit. Apply an immediate spending freeze on discretionary categories for the subsequent week to restore balance.
3.  **Review and Readjust**: Analyze the cause of the schedule drift or budget breach. Adjust the next week's allocation rules to prevent recurrence.

---

## 4. AI Engine Operations (AI 助理运行规范)

### 🟢 Multi-Agent Concurrency Lock
In a multi-agent environment, only the primary Orchestrator Agent has write permissions to modify the 5-layer files in `.hvaos` (or root directory). Subagents must operate in read-only mode to prevent write conflicts and inconsistent updates.

### 🟢 Walkthrough, Delivery & Self-Evolution
During the task delivery/walkthrough phase, if the task involved a tech stack migration, dependency shift, or new retrospective warning, the primary AI must automatically update and prune `04-context.md` (warnings list capped at 5 items) to keep the documentation aligned.

### 🟢 Periodic Memory Heartbeat
If the chat conversation exceeds 10 turns, the AI must prepend a bold, 1-line recap of active constraints (e.g. `[Active Redline: Spec Gate Approval Required]`) at the top of subsequent responses to refocus the LLM's attention in long contexts.
