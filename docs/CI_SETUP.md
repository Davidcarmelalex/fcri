# CI/CD Setup Instructions

## GitHub Actions CI Pipeline

The repository currently has a CI design, but no committed workflow. Before
activating one, AZ-001 must first be integrated: the current main branch stores
the AZRAEL modules directly under `azrael/azrael-core/src`, while the tests
import `azrael_core`. A workflow that claims AZRAEL coverage before that package
boundary is repaired would fail at collection and would not be useful evidence.

The next safe implementation should use one least-privilege workflow job on
pushes and pull requests targeting `main`. It should install the locked Node
dependencies and declared Python test dependencies, then run lint, TypeScript
checking, the Next build, and the AZRAEL unit tests only after the package is
importable in a clean environment.

The evidence receipt should be generated only after every required check exits
successfully. Its minimum fields are:

```json
{
  "schema": "fcri.ci-evidence/v1",
  "status": "passed",
  "revision": "<git commit SHA>",
  "repository": "<owner>/<repo>",
  "run": "<hosted run ID>",
  "generated_at": "<UTC timestamp>",
  "checks": ["npm run lint", "npx tsc --noEmit", "npm run build", "pytest azrael/azrael-core/tests"]
}
```

GitHub should upload that file as a run artifact. The receipt is evidence of
the checks in that run; it is not a deployment approval or a secrets record.

### Local verification after AZ-001

```bash
git clone https://github.com/Davidcarmelalex/fcri
cd fcri
python -m pip install -r azrael/azrael-core/requirements.txt
python -m pip install --editable azrael/azrael-core
python -m pytest -q azrael/azrael-core/tests
```

## Branch Protection

After CI is active, enable branch protection:
- Go to **Settings → Branches → Add rule**
- Pattern: `main`
- Enable: Require PR, Require status checks (CI), No direct pushes

See [BRANCH_PROTECTION.md](./docs/BRANCH_PROTECTION.md) for full details.
