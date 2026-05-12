# Contributing to FCRI

## Workflow

1. Fork the repo and create your branch from `main`: `git checkout -b feat/your-feature`
2. Make your changes and commit with a clear message (see Commit Convention below)
3. Open a Pull Request against `main` — describe what you changed and why
4. CI must pass before merging
5. At least one reviewer approval required

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new research page
fix: correct broken navigation link
docs: update README with deployment steps
ci: add linting step to pipeline
chore: update dependencies
refactor: extract layout component
```

## Local Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npx tsc --noEmit   # type check
```

## Code Style

- TypeScript strict mode — no `any` unless unavoidable
- Tailwind CSS for all styling
- Components go in `src/components/`
- No direct commits to `main`

## Questions?

Open an issue or reach out via [fcri.science](https://fcri.science).
