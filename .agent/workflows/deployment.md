---
description: Deployment Workflow (Staging -> Production)
---

# Git Workflow: Staging (`dev`) to Production (`main`)

This workflow defines how to manage code changes using the `dev` (Staging) and `main` (Production) branches.

## 1. Development (Staging)
**Goal**: Iterate, test, and verify features.

1.  **Checkout Staging**:
    ```bash
    git checkout dev
    git pull origin dev
    ```
2.  **Make Changes**:
    -   Option A: Commit directly to `dev` (for small changes).
    -   Option B: Create a feature branch `git checkout -b feature/my-feature`, then merge back to `dev`.
3.  **Push to Staging**:
    ```bash
    git push origin dev
    ```
    *Builds/Tests should run here.*

## 2. Release (Production)
**Goal**: Deploy tested code to live users.

1.  **Switch to Production**:
    ```bash
    git checkout main
    git pull origin main
    ```
2.  **Merge changes from `dev`**:
    ```bash
    git merge dev
    ```
3.  **Push to Production**:
    ```bash
    git push origin main
    ```
    *This triggers the Production deployment.*

## 3. Hotfixes (Emergency)
**Goal**: Fix critical bugs in Production.

1.  Checkout `main`.
2.  Create branch `hotfix/bug-name`.
3.  Fix and merge to **BOTH** `main` and `dev`.
