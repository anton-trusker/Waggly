# 06 - Brand and Documentation Cleanup

## Canonical Naming

Use **Waggli** as the product/company name.

Current domain references in code and docs use `waggli.app`. Keep this as a domain value for now, but separate product name from domain:

- Product: Waggli.
- Public domain: `waggli.app` until changed.
- Technical slug: decide between `waggli` and `waggli` before app store release.

## Current Naming Problems

The documentation contains mixed history:

- Pawzly.
- PawHelp.
- PAW.
- Waggli.
- Waggli.

This is normal for an evolving project, but it now creates product and engineering confusion.

## Cleanup Plan

### Phase 1 - Metadata

- Add `documentation/CANONICAL.md` declaring Waggli naming, source priority, and current domain.
- Mark old docs as historical if they use Pawzly/PawHelp.
- Keep old docs, do not delete them.

### Phase 2 - App Text

- Add brand constants:
  - `APP_NAME = 'Waggli'`
  - `APP_DOMAIN = 'waggli.app'`
  - `APP_SCHEME = 'waggli'` or future `waggli`
- Replace hardcoded visible names.
- Review app store bundle IDs separately.

### Phase 3 - Docs

- Rename headings in current specs from Waggli to Waggli.
- Keep old file names unless renaming is worth the git churn.
- Add frontmatter/status to docs:
  - canonical
  - supporting
  - historical
  - superseded

### Phase 4 - Database

- Avoid brand names in table names.
- Use generic public schema names: `pets`, `profiles`, `documents`, `providers`.
- Store brand/domain only in settings/config, not schema names.

## Documentation Governance

Add a lightweight rule:

- Specs define product behavior.
- DB canonical schema defines database behavior.
- App code must follow generated DB types.
- Historical docs are not implementation source unless promoted.

## Suggested Future Folder Structure

```text
documentation/
  CANONICAL.md
  spec/                  # current product specs
  architecture/          # current architecture decisions
  database/              # canonical DB design
  implementation/        # sprint plans and tasks
  historical/            # Pawzly/PawHelp/old PAW docs
  research/              # market/investor docs
```
