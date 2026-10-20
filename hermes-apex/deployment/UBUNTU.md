# Ubuntu deployment checklist

1. Provision supported Ubuntu LTS, create non-root operator, configure SSH keys, firewall, patches and backups.
2. Pin and independently verify the official Hermes runtime release, install procedure and supported CLI/API/skill interfaces. Do not execute unreviewed remote scripts.
3. Deploy only the five core design roles in a staging environment.
4. Provision isolated database, queue, artifact storage and secrets management.
5. Connect the Hermes adapter only after integration tests confirm the installed version's supported interface.
6. Run dry-run tasks, prompt-injection tests, permission tests, recovery tests and audit checks.
7. Enable external connectors with least privilege and explicit owner approval.
8. Document rollback and emergency shutdown; promote only after acceptance review.

This folder is a blueprint, not an unattended production installer.
