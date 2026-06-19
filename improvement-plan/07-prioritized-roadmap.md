# 07 — Prioritized Roadmap

Priorities: **P0** = blocks everything / do now · **P1** = do this quarter · **P2** = next ·
**P3** = later. Effort: S (≤2d), M (≤1wk), L (multi-week).

## Phase 0 — Stabilize the foundation (P0)

| Item | Effort | Ref |
|------|:------:|-----|
| Validate the new Supabase end-to-end (golden path checklist) | S | [03](./03-supabase-new-project.md) |
| Decide canonical ownership model (`owner_id` recommended) + canonical DB | S | [04](./04-data-layer-remediation.md) |
| Snapshot new DB as `0000_baseline.sql`; archive the 88 legacy + `v2/` migrations | M | [04](./04-data-layer-remediation.md) |
| Delete deprecated `usePets`; standardize on `usePetV2`; unify the two types files | M | [04](./04-data-layer-remediation.md) |
| Move server-only secrets out of `EXPO_PUBLIC_*`; verify `.env*` git-ignored; rotate exposed keys | S | [05](./05-code-quality-and-architecture.md) |
| Declare `Waggly/` canonical; freeze sibling repos | S | [05](./05-code-quality-and-architecture.md) |

**Exit criteria**: one DB, one schema, one types file; golden path works; no secrets in client bundle.

## Phase 1 — Make change safe (P1)

| Item | Effort | Ref |
|------|:------:|-----|
| Add FK indexes + enum/CHECK constraints + seed reference data | M | [04](./04-data-layer-remediation.md) |
| Re-enable `react-hooks/exhaustive-deps` (warn → fix → error) | M | [05](./05-code-quality-and-architecture.md) |
| `any` ratchet: baseline 749, fail CI on increase; burn down data-hook hotspots | L | [05](./05-code-quality-and-architecture.md) |
| Test foundation: hook unit tests + 1 golden-path E2E; CI runs `tsc`+lint+jest on PRs | L | [05](./05-code-quality-and-architecture.md) |
| Route logging through `utils/logger.ts`; strip `console.*` in prod builds | S | [05](./05-code-quality-and-architecture.md) |
| Set real `bundleIdentifier`/`package` + app group id | S | [05](./05-code-quality-and-architecture.md) |
| Implement the real `calculate_health_score` per spec (replace heuristic) | M | [03](./03-supabase-new-project.md), [06](./06-feature-gap-vs-spec.md) |

## Phase 2 — Differentiate (P2)

| Item | Effort | Ref |
|------|:------:|-----|
| AI: NLP record entry + document OCR (reuse `Waggli-New` Edge Functions) | L | [06](./06-feature-gap-vs-spec.md) |
| Monetization: Stripe subscriptions + freemium gating per spec tiers | L | [06](./06-feature-gap-vs-spec.md) |
| Server-side reminders + push scheduling (Edge Function) | M | [06](./06-feature-gap-vs-spec.md) |
| Consolidate weight tables; add emergency_contacts / body-condition-score flows | M | [04](./04-data-layer-remediation.md) |
| Repo → monorepo with shared `packages/{types,ui-kit,services}` | L | [05](./05-code-quality-and-architecture.md) |
| Enforce RBAC (roles already modeled) + GDPR export/delete | M | [06](./06-feature-gap-vs-spec.md) |

## Phase 3 — Expand (P3)

| Item | Effort | Ref |
|------|:------:|-----|
| Provider directory + booking ecosystem (spec 15) | L | [06](./06-feature-gap-vs-spec.md) |
| Social network (spec 09) | L | [06](./06-feature-gap-vs-spec.md) |
| Admin panel / CMS / feature flags (spec 16) | L | [06](./06-feature-gap-vs-spec.md) |
| EU travel-compliance passport checks (spec 05) | M | [06](./06-feature-gap-vs-spec.md) |
| Doc hygiene: dedupe spec folders; rename `Pawzly-` files | S | [02](./02-current-state-assessment.md) |

## Suggested first sprint

1. Run the golden-path validation against the new DB; log every failure.
2. Make the `owner_id` vs `user_id` decision and execute the rename + `usePets` deletion.
3. Snapshot + archive migrations so the new project becomes the reproducible source of truth.
4. Re-enable `exhaustive-deps` and stand up CI (`tsc` + lint + jest).

That sequence converts "four databases and two schemas" into "one reproducible backend with a
safety net" — the precondition for all feature work in Phases 2–3.
