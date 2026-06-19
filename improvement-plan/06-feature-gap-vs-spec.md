# 06 — Feature Gap vs Spec

The `documentation/spec/` set defines 18 areas. Below is a pragmatic implemented-vs-planned
read based on the `Waggly/` codebase (routes, hooks, components). Treat the "Gap" column as
the product backlog.

| # | Spec area | In the app today | Gap / next |
|---|-----------|------------------|------------|
| 02 | User management | Email + Google + Apple auth, profiles, onboarding | Roles/permissions tables exist but RBAC not enforced in UI; account deletion/GDPR export |
| 03 | Pet profiles | Full CRUD, multi-step add, photos, breeds | Breed/reference tables unseeded on new DB; identification (microchip) flows partial |
| 04 | Health management | Vaccinations, visits, medications, allergies, conditions, weight, metrics | Consolidate the 3 weight tables; body-condition-score flow; emergency contacts table referenced but absent |
| 05 | Pet passport | Passport screen, share, `calculate_health_score` | Health-score is a **heuristic stub** — implement the spec algorithm; EU travel-compliance checks |
| 06 | Documents | Upload, storage, categories | OCR pipeline (Vision) not wired; document sharing |
| 07 | Calendar & reminders | Events, calendar views, notifications | Server-side reminder generation / push scheduling (Edge Function) |
| 08 | **AI features** | OpenAI key present; symptom-analysis Edge Function exists in `Waggli-New` | **Core differentiator largely unbuilt in this app**: conversational health assistant, NLP record entry, OCR, predictions |
| 09 | Social network | — | Not started in `Waggly/` (posts, stories, groups, events) |
| 10 | Sharing & collaboration | Public links, co-owners | Granular permissions, professional (vet) access |
| 11 | Monetization | — | No Stripe/subscriptions/paywall in this app; freemium gating absent |
| 12 | Architecture | Supabase + RN | See [04](./04-data-layer-remediation.md), [05](./05-code-quality-and-architecture.md) |
| 13 | UI/UX design | Tamagui design-system, theming, skeletons | Formalize tokens vs the spec design system; a11y audit |
| 15 | Providers | — | Provider directory/booking ecosystem not started |
| 16 | Admin panel | — | No admin/CRM/CMS/feature-flags surface |

## Reading

- The app is strong on **core pet + health record-keeping** (areas 02–07, 10).
- The **AI features (08)** that the business plan positions as the differentiator are the
  biggest gap in this app, though some Edge Functions exist in the `Waggli-New` repo
  (`ai-symptom-analysis`, `ai-translate`, `generate-embeddings`) — another reason to settle
  the canonical-repo question ([05](./05-code-quality-and-architecture.md)).
- **Monetization (11)** has zero implementation; it must precede any revenue milestone.

## Recommendation

Don't open new feature fronts until the data layer is stable. Then sequence by business value:
**AI record entry/OCR (08) → monetization/paywall (11) → providers (15) → social (09)**, each
gated behind the freemium tiers defined in `documentation/spec/11-monetization/`.
