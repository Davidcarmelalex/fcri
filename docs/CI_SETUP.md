# CI/CD Setup Instructions

## GitHub Actions CI Pipeline

The CI workflow file has been prepared. To activate it, follow these steps:

### Option A: Copy via GitHub UI

1. Go to your repo → **Add file** → **Create new file**
2. Name it: `.github/workflows/ci.yml`
3. Paste the content below and commit to `main`

### CI Workflow Content

```yaml
name: CI

on:
  push:
    branches: ["**"]
  pull_request:
    branches: [main]

jobs:
  build:
    name: Build & Type Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Build
        run: npm run build

  security:
    name: Dependency Audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm audit --audit-level=high
```

### Option B: Clone and push locally

```bash
git clone https://github.com/Davidcarmelalex/fcri
cd fcri
mkdir -p .github/workflows
# paste the yaml above into .github/workflows/ci.yml
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions CI pipeline"
git push origin main
```

## Branch Protection

After CI is active, enable branch protection:
- Go to **Settings → Branches → Add rule**
- Pattern: `main`
- Enable: Require PR, Require status checks (CI), No direct pushes

See [BRANCH_PROTECTION.md](./docs/BRANCH_PROTECTION.md) for full details.
