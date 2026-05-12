# Branch Protection Setup

## Protecting `main`

Go to: Settings → Branches → Add branch protection rule

**Branch name pattern:** `main`

### Required settings:
- [x] Require a pull request before merging
  - Required approvals: 1
- [x] Require status checks to pass before merging
  - Required checks: `Build & Check` (from CI workflow)
- [x] Require branches to be up to date before merging
- [x] Do not allow bypassing the above settings

### Recommended:
- [x] Require linear history
- [x] Restrict who can push to matching branches
