# Waggli Platform Improvement Plan

This folder is the deep review output for the Waggli pet passport and all-in-one pet platform.

Canonical name: **Waggli**  
Current domain in code/docs: **waggli.app**  
Decision needed later: keep `waggli.app` as domain/technical slug or migrate public naming fully to `waggli`.

## Source Priority

1. `documentation/spec/` is the canonical product specification set.
2. `documentation/spec/db-refactor/` is the canonical warning and target direction for database cleanup.
3. `documentation/documents/` contains useful implementation history, older Pawzly/PawHelp documents, and feature details.
4. Current app code shows what is already built and where compatibility risk exists.

## Documents

- `01-documentation-review.md` - deep summary of the platform docs and contradictions.
- `02-product-improvement-plan.md` - whole-product improvement plan by domain.
- `03-database-improvement-plan.md` - improved DB architecture and table logic.
- `04-technical-roadmap.md` - phased implementation roadmap.
- `05-current-app-gap-analysis.md` - current code/app gaps against the docs.
- `06-brand-and-documentation-cleanup.md` - Waggli naming cleanup and documentation governance.

## Strong Recommendation

Do not create Supabase tables from the old migration history. Freeze the canonical Waggli schema first, then apply a clean migration set to the new Supabase project.
