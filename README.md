<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=0a0a0a&height=200&section=header&text=FCRI&fontSize=70&fontColor=D4AF37&animation=fadeIn&fontAlignY=35&desc=Fusion%20Civilization%20Research%20Institute&descAlignY=55&descSize=22&descColor=ffffff" width="100%"/>

<br/>

<img src="https://readme-typing-svg.herokuapp.com?font=EB+Garamond&size=18&duration=3000&pause=1000&color=D4AF37&center=true&vAlign=true&width=900&lines=Frontier+Science+%C2%B7+Civilization+Engineering+%C2%B7+Autonomous+Systems;Intelligence+%C2%B7+Governance+%C2%B7+Economics+%C2%B7+Justice+%C2%B7+Culture;Research+Institute+%C2%B7+Academic+Programs+%C2%B7+Open+Infrastructure" />

<br/><br/>

[![Site](https://img.shields.io/badge/Institution-fcri.science-D4AF37?style=for-the-badge&logo=googlescholar&logoColor=white)](https://fcri.science)
[![License](https://img.shields.io/badge/License-MIT-0f0f0f?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![Research](https://img.shields.io/badge/Research-5%20Domains-1a5276?style=for-the-badge&logo=academia&logoColor=white)]()
[![Status](https://img.shields.io/badge/Status-Active-00ff88?style=for-the-badge&logo=checkcircle&logoColor=white)]()

<br/>

<a href="https://fcri.science"><img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white" /></a>
<a href="https://fcri.science"><img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" /></a>
<a href="https://fcri.science"><img src="https://img.shields.io/badge/Python-3.11+-3776ab?style=flat-square&logo=python&logoColor=white" /></a>
<a href="https://fcri.science"><img src="https://img.shields.io/badge/Kotlin-2.0-7f52ff?style=flat-square&logo=kotlin&logoColor=white" /></a>
<a href="https://fcri.science"><img src="https://img.shields.io/badge/PostgreSQL-16-4169e1?style=flat-square&logo=postgresql&logoColor=white" /></a>

</div>

---

## FCRI — Fusion Civilization Research Institute

**Principal Investigator:** David Carmel Alex, SEBI Certified Research Analyst & Investment Advisor

**Affiliation:** Voltex Network · MrNothing Ecosystem

**Digital Infrastructure:** [https://fcri.science](https://fcri.science)

**Repository:** [github.com/Davidcarmelalex/fcri](https://github.com/Davidcarmelalex/fcri)

---

## Mission

FCRI conducts frontier research and builds open infrastructure across **five civilization domains** — intelligence, governance, economics, justice, and culture. Our work spans theoretical frameworks, applied research, and production-grade systems that advance human civilization through technology.

## Research Domains

| Domain | Research Areas | Active Projects |
|--------|---------------|-----------------|
| **Intelligence** | Artificial general intelligence, multi-agent systems, cognitive architectures, autonomous reasoning | MrNothing, FAASI Core, VOID//SIGNAL |
| **Governance** | Digital democracy, civic transparency, decentralized decision-making, public representation analytics | Jan Niti, Voting Systems |
| **Economics** | Cross-border settlement, financial inclusion, digital markets, token economics | NRLink, GiftOS, VoltexFinance |
| **Justice** | Cyber defense, digital forensics, surveillance detection, privacy preservation | AZRAEL, MrNothing Shield |
| **Culture** | Autonomous media, knowledge preservation, educational technology, artistic tools | VOID//SIGNAL, Nexum Labs, NothingBuilt |

## Repository Structure

This is a **research monorepo** containing multiple FCRI initiatives:

| Project | Path | Description | Status |
|---------|------|-------------|--------|
| **FCRI Web** | `src/` | Institutional website at [fcri.science](https://fcri.science) | ✅ Live |
| **NRLink** | `apps/nrlink-*` | Cross-border liquidity orchestration for institutional settlement | 🔨 Active |
| **AZRAEL** | `azrael/` | Self-healing autonomous cyber defense stack | 🔨 Active |
| **FAASI Core** | `fcri-faasi-core/` | Framework for Autonomous Agent Systematic Integrity evaluation | 🔬 Research |
| **MR NOTHING** | `projects/mr-nothing/` | Android-native AI agent platform | 📋 Planned |
| **NR Agent** | `projects/nothing-agent/` | Agentic computing research initiative | 📋 Planned |

---

## FCRI Web Platform

**Live:** [https://fcri.science](https://fcri.science)

The institutional web platform provides public access to research outputs, academic programs, and ecosystem tools:

| Route | Content |
|-------|---------|
| `/research` | Research archive — papers, preprints, datasets |
| `/research/papers` | Full papers archive with categorization and search |
| `/academics` | Courses, fellowships, executive programs, seminars |
| `/financial-systems` | Fusion Veritas, VoltexFinance, NRLink documentation |
| `/ecosystem` | Complete Voltex Network topology |
| `/azrael` | AZRAEL cyber defense initiative documentation |
| `/mr-nothing` | MR NOTHING project specifications |
| `/grants` | Research grants and fellowship applications |
| `/support` | Institutional partnerships and support channels |
| `/about` | Mission, vision, and institutional charter |

---

## NRLink — Cross-Border Settlement Infrastructure

**Path:** `apps/nrlink-web/`, `apps/nrlink-admin/`, `apps/nrlink-api/`

NRLink is a premium cross-border settlement infrastructure designed for sovereign and institutional actors. It provides:

- **Real-time FX rate calculation** with multi-source aggregation
- **Secure transaction processing** with cryptographic verification
- **Beneficiary management** with compliance checks
- **Webhook settlement events** for real-time integration
- **Institutional-grade API** with comprehensive documentation

### Architecture

```
NRLink Platform
├── nrlink-web      Next.js 16 — Public-facing quote and transfer interface
├── nrlink-admin    Next.js 16 — Administrative dashboard for operators
└── nrlink-api      Express · Prisma · PostgreSQL — Core settlement engine
    ├── Auth        JWT-based authentication and authorization
    ├── Quote       FX rate engine with markup calculation
    ├── Transaction End-to-end transfer processing
    ├── Beneficiary KYC-linked beneficiary management
    └── Webhooks    Real-time settlement event notifications
```

### Data Model

```prisma
model User { id, email, passwordHash, role, createdAt }
model Quote { id, fromCurrency, toCurrency, amount, rate, markup, finalAmount, status, expiresAt }
model Transaction { id, quoteId, senderId, beneficiaryId, status, trackingNumber, createdAt }
model Beneficiary { id, userId, name, accountNumber, bankCode, currency, country }
```

---

## AZRAEL — Autonomous Cyber Defense

**Path:** `azrael/`

AZRAEL is the world's first self-healing autonomous cyber defense stack. It combines threat detection, automated response, and system recovery into a unified defense framework.

| Module | Description | Status |
|--------|-------------|--------|
| `azrael-core` | Orchestration engine with policy-governed agent coordination | 🔨 Active |
| `azrael-sense` | Real-time threat detection and event normalization | 📋 Planned |
| `azrael-response` | Automated containment and neutralization | 📋 Planned |
| `azrael-heal` | Self-healing recovery and baseline restoration | 📋 Planned |
| `azrael-intel` | Threat intelligence aggregation and correlation | 📋 Planned |
| `azrael-console` | Operator dashboard for oversight and control | 📋 Planned |

### Core Implementation

- **`orchestrator.py`** — Policy-governed agent coordination with finite state machine
- **`sense.py`** — Event normalization pipeline and threat scoring algorithm
- **`heal.py`** — Baseline restoration with integrity validation
- **Full test suite** — pytest with >90% coverage target

### Integration with MrNothing Shield

AZRAEL leverages [MrNothing Shield](https://github.com/Davidcarmelalex/mrnothing-shield) for mobile endpoint defense, creating a unified threat detection surface across server and mobile infrastructure.

---

## FAASI Core — Agent Reliability Framework

**Path:** `fcri-faasi-core/`

The **Framework for Autonomous Agent Systematic Integrity (FAASI)** provides reproducible benchmarks for evaluating autonomous AI agent reliability in long-horizon tool-augmented workflows.

### Research Objectives

1. Establish standardized metrics for agent reliability assessment
2. Create reproducible test environments for long-horizon task evaluation
3. Develop integrity scoring methodologies for tool-augmented agents
4. Publish open benchmarks for the research community

### Methodology

- **Long-horizon tasks** — Multi-step workflows requiring 10+ tool invocations
- **Adversarial testing** — Injection of failures, delays, and ambiguous inputs
- **Metric collection** — Success rate, completion time, error recovery rate, resource efficiency
- **Cross-platform validation** — Testing across Ollama, OpenAI, Anthropic backends

---

## Research Standards

### Publication Standards

FCRI adheres to the following academic standards for all research outputs:

1. **Open Access** — All publications available under CC-BY or MIT license
2. **Reproducibility** — Complete methodology, datasets, and code provided
3. **Peer Review** — External review for all formal publications
4. **Version Control** — All research tracked via Git with signed commits
5. **DOI Registration** — Persistent identifiers for all major outputs

### Citation Format

```bibtex
@techreport{fcri2026,
  title={FCRI Research Output},
  author={Alex, David Carmel and {FCRI Research Team}},
  institution={Fusion Civilization Research Institute},
  year={2026},
  url={https://fcri.science},
  note={Open access publication}
}
```

### Ethics Compliance

- **Human subjects research** — IRB approval required for any human subjects studies
- **Data privacy** — GDPR-compliant data handling practices
- **AI safety** — All AI systems evaluated for safety before deployment
- **Conflict of interest** — Transparent disclosure of all funding sources and affiliations

---

## Technology Stack

**Frontend:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion

**Backend:** Express · Prisma · PostgreSQL · JWT · Zod

**AI/Agents:** Python 3.11+ · asyncio · Pydantic · Ollama · OpenAI API

**Security:** AZRAEL · MrNothing Shield · AES-256-GCM · Ed25519

**Mobile:** Kotlin · Jetpack Compose

**Infrastructure:** Nginx · systemd · Datadog · Let's Encrypt

---

## Development

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
pytest --cov=src --cov-report=html
```

---

## Deployment

FCRI runs on a Debian VPS at [fcri.science](https://fcri.science) behind Nginx with HTTPS via Let's Encrypt.

- **Web:** Nginx reverse proxy to Next.js
- **API:** PM2-managed Node.js processes
- **Database:** PostgreSQL 16 with automated backups
- **Monitoring:** Datadog synthetic monitoring and APM

See [deploy/README.md](deploy/README.md) and [OPERATIONS.md](OPERATIONS.md) for complete deployment documentation.

---

## Contributing

FCRI welcomes contributions from researchers, engineers, and domain experts.

See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Research contribution guidelines
- Code standards and review process
- Publication co-authorship policies
- Grant and fellowship application procedures

## License

[MIT License](LICENSE) — Copyright 2026 David Carmel Alex / Fusion Civilization Research Institute

All research outputs are open access unless otherwise specified.

---

<div align="center">

**Advancing civilization through frontier science and open infrastructure.**

[https://fcri.science](https://fcri.science) · [github.com/Davidcarmelalex/fcri](https://github.com/Davidcarmelalex/fcri)

<sub><code>Fusion Civilization Research Institute · A Voltex Network Institution</code></sub>

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0a0a0a&height=80&section=footer" width="100%"/>
