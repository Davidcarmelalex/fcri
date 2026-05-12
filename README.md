# FCRI

> Fusion Civilization Research Institute

[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Live](https://img.shields.io/badge/Site-fcri.science-D4AF37)](https://fcri.science)
[![Voltex Network](https://img.shields.io/badge/Voltex%20Network-Ecosystem-purple)](https://voltexbazar.io)

FCRI is a frontier science and civilization engineering institute based in **Liberland**. We conduct research, run academic programs, and build systems across five civilization domains — intelligence, governance, economics, justice, and culture.

---

## What's in This Repository

This is a **monorepo** containing multiple FCRI initiatives:

| Project | Path | Description |
|---------|------|-------------|
| **FCRI Web** | `src/` | Main institutional website at fcri.science |
| **NRLink** | `apps/nrlink-*` | Cross-border liquidity orchestration platform |
| **AZRAEL** | `azrael/` | Autonomous cyber defense stack |
| **MR NOTHING** | `projects/mr-nothing/` | Android-native AI agent platform |
| **NR Agent** | `projects/nothing-agent/` | Agentic computing initiative |

---

## FCRI Web

**Live:** [https://fcri.science](https://fcri.science)

The institutional website spanning:

| Route | Content |
|-------|---------|
| `/research` | Research archive — papers, categories, publications |
| `/research/papers` | Full papers archive with filtering |
| `/academics` | Courses, fellowships, executive programs, seminars |
| `/financial-systems` | Fusion Veritas, VoltexFinance, NRLink |
| `/ecosystem` | Full Voltex Network map |
| `/azrael` | AZRAEL cyber defense initiative |
| `/mr-nothing` | MR NOTHING project page |
| `/grants` | Research grants and fellowships |
| `/support` | Donations, partnerships, crypto support |
| `/about` | Institute mission and vision |
| `/token` | FCRI participation token |
| `/invest` | Investment pathways |

---

## NRLink

**Path:** `apps/nrlink-web/`, `apps/nrlink-admin/`, `apps/nrlink-api/`

Cross-border premium settlement infrastructure for sovereign and institutional actors.

| Component | Stack | Status |
|-----------|-------|--------|
| `nrlink-web` | Next.js 16 | 🔨 Building |
| `nrlink-admin` | Next.js 16 | 🔨 Building |
| `nrlink-api` | Express · Prisma · PostgreSQL | 🔨 Building |

NRLink API features complete implementations of:
- Auth (register / login / JWT)
- Quote engine (FX rate calculation)
- Transaction processing
- Beneficiary management
- Webhook settlement events
- Prisma schema (User, Quote, Transaction, Beneficiary)

---

## AZRAEL

**Path:** `azrael/`

The world's first self-healing autonomous cyber defense stack.

| Module | Description | Status |
|--------|-------------|--------|
| `azrael-core` | Orchestration engine | 🔨 Building |
| `azrael-sense` | Threat detection | 📋 Planned |
| `azrael-response` | Automated response | 📋 Planned |
| `azrael-heal` | Self-healing recovery | 📋 Planned |
| `azrael-intel` | Threat intelligence | 📋 Planned |
| `azrael-console` | Operator dashboard | 📋 Planned |

Python core implementation:
- `azrael-core/src/orchestrator.py` — policy-governed agent coordination
- `azrael-core/src/sense.py` — event normalization and threat scoring
- `azrael-core/src/heal.py` — baseline restoration and recovery validation
- Full test suite in `azrael-core/tests/`

---

## Stack

**Frontend:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4

**Backend (NRLink):** Express · Prisma · PostgreSQL · JWT · Zod

**AZRAEL:** Python 3.11+ · asyncio · Pydantic · pytest

**Android (MR NOTHING):** Kotlin · Jetpack Compose

**Infra:** Nginx · systemd · Datadog synthetic monitoring

---

## Local Development

```bash
# Main site
npm install
npm run dev       # http://localhost:3000

# NRLink API
cd apps/nrlink-api
npm install
npx prisma generate
npm run dev       # http://localhost:4100

# AZRAEL tests
cd azrael/azrael-core
pip install -r requirements.txt
pytest
```

---

## Deployment

FCRI runs on a Debian VPS at `fcri.science` behind Nginx with HTTPS via Let's Encrypt.

See [deploy/README.md](deploy/README.md) and [OPERATIONS.md](OPERATIONS.md) for full deployment instructions.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Built under [MIT License](LICENSE).
