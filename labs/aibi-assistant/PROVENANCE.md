# Verified reuse and source inspection

Inspected through the user's connected GitHub account `Davidcarmelalex` on
2026-10-22. User selected Agent47 in place of Dimitri.

| Source | Findings / reuse |
| --- | --- |
| [automation Agent47](https://github.com/Davidcarmelalex/automation/blob/main/agents/agent47/agent47.py) | Actual `Task`, `TaskResult`, `Agent47.execute` interface. Upstream blob `615c2013337aa412e34a4939106c2064b0efabc9`, vendored under `aibi/vendor/agent47.py` with only trailing whitespace normalized. MIT; copyright David Carmel Alex / Voltex Network. |
| [Automation architecture](https://github.com/Davidcarmelalex/automation/blob/main/ARCHITECTURE.md) | Calls out authn/authz, persistent task store, sandboxing and audit as hardening backlog. |
| [Automation guardrails](https://github.com/Davidcarmelalex/automation/blob/main/config/guardrails.json) | Describes dual confirmation, but Agent47 does not enforce that configuration. No claim of existing OAuth/biometric integration. |
| [Automation registry](https://github.com/Davidcarmelalex/automation/blob/main/config/registry.json) | Inspected registry and skill matrix; no Dimitri reference found. No production registry changes made. |
| [FCRI Azrael orchestrator](https://github.com/Davidcarmelalex/fcri/blob/main/azrael/azrael-core/src/orchestrator.py) | Agent handlers run before authorization and critical severity bypasses restrictions. Not suitable as the assistant's authorization boundary. |
| [Nothing Agent service](https://github.com/Davidcarmelalex/fcri/blob/main/projects/nothing-agent/services/api/app/services/agent_service.py) | Returns an `approval-gated` label, without approval persistence/enforcement. |
| [Nothing Agent auth](https://github.com/Davidcarmelalex/fcri/blob/main/projects/nothing-agent/services/api/app/auth/security.py) | JWT helper with fallback signing secret. Not reused. |
| [SystemOperator](https://github.com/Davidcarmelalex/SystemOperator) | Hermes/Titan/Minerva bootstrap; no verified campus connector. |

The FCRI base inspected is commit `b96ec825423d6984e008f9717866967729d8593c`.
No GitHub secrets, encrypted vault material, private keys or secret-bearing env
files were read. No live AIBI service was authenticated or contacted.

`ScopedAgent47` subclasses the real dispatcher and reuses upstream data contracts.
It overrides initialization, execution and history so the command executor cannot
be reached through this assistant. No upstream autonomous loops, MCP servers or
unverified infrastructure are started. Agent manifests and skills in this project
are local contracts, not claims that they are registered with a running fleet.

## Upstream license

MIT License · Copyright (c) 2026 David Carmel Alex / Voltex Network.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
