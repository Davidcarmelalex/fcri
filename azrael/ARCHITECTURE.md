# AZRAEL Architecture

## System Overview

```
┌─────────────────────────────────────────────┐
│                AZRAEL MESH                  │
│                                             │
│  ┌──────────┐   ┌──────────┐   ┌─────────┐ │
│  │  SENSE   │──▶│   CORE   │──▶│RESPONSE │ │
│  │ (detect) │   │(orchestr)│   │(execute)│ │
│  └──────────┘   └────┬─────┘   └─────────┘ │
│                      │                      │
│                 ┌────▼─────┐                │
│                 │  HEAL    │                │
│                 │(recovery)│                │
│                 └──────────┘                │
└─────────────────────────────────────────────┘
         │                    │
    ┌────▼────┐          ┌────▼────┐
    │  INTEL  │          │CONSOLE  │
    │ (feeds) │          │  (UI)   │
    └─────────┘          └─────────┘
```

## Module Responsibilities

| Module | Role |
|--------|------|
| `azrael-sense` | Ingests telemetry, logs, network events |
| `azrael-core` | Orchestrates agents, routes decisions |
| `azrael-response` | Executes containment and mitigation |
| `azrael-heal` | Restores systems to known-good state |
| `azrael-intel` | External threat intelligence feeds |
| `azrael-swarm` | Multi-node distributed agent deployment |
| `azrael-sdk` | Integration SDK for external systems |
| `azrael-console` | Human operator dashboard |

## Data Flow

1. **SENSE** ingests events → normalizes → publishes to internal bus
2. **CORE** receives events → scores threat → routes to RESPONSE or HEAL
3. **RESPONSE** executes playbooks → logs actions → reports to CONSOLE
4. **HEAL** monitors system state → triggers recovery → validates restoration
5. **INTEL** feeds CORE with external IOCs and threat signatures

## Governance

All response playbooks are versioned, auditable, and require explicit policy authorization before execution. See [GOVERNANCE.md](./GOVERNANCE.md).
