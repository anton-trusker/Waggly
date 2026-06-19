# Waggli — Improvement Plan

> **Project**: Waggli (formerly Pawzly) — AI-first digital pet passport & all-in-one pet platform
> **App**: `Waggly/` — Expo + React Native + Tamagui (iOS / Android / Web)
> **Author**: Engineering review, 2026-06-19
> **Status**: Living document — review per phase

This folder is a structured, evidence-based plan for improving the Waggli platform.
It was produced from a full review of the `Waggly/` codebase, the `documentation/spec`
specification set (144 docs), the `documentation/research` business material, and the
state of the Supabase backends.

## How to read this

| # | Document | Audience | Purpose |
|---|----------|----------|---------|
| 01 | [Executive Summary](./01-executive-summary.md) | Everyone | The 5-minute version |
| 02 | [Current State Assessment](./02-current-state-assessment.md) | Eng | What exists today, with metrics |
| 03 | [New Supabase Project](./03-supabase-new-project.md) | Eng | What was wired up on 2026-06-19 + how to verify |
| 04 | [Data Layer Remediation](./04-data-layer-remediation.md) | Eng | Fix the schema drift — the #1 risk |
| 05 | [Code Quality & Architecture](./05-code-quality-and-architecture.md) | Eng | Types, tests, repos, hooks |
| 06 | [Feature Gap vs Spec](./06-feature-gap-vs-spec.md) | Product + Eng | What the spec promises vs what ships |
| 07 | [Prioritized Roadmap](./07-prioritized-roadmap.md) | Everyone | P0–P3 phased backlog |

## The one thing to know

The platform is **feature-rich but its data layer has drifted across at least four Supabase
projects and two incompatible in-code schemas** (`user_id` vs `owner_id`). This is the single
biggest source of risk and must be stabilized before further feature work. See
[04-data-layer-remediation.md](./04-data-layer-remediation.md).
