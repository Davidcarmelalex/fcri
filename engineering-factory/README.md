# AZRAEL Codex Engineering Factory

New replacement package created 2026-10-27 from verified repository evidence.
This is not a recovered copy of the previously referenced ZIP. AZ-001 and
AZ-002 below are newly proposed definitions, not recovered historical tickets.

Repository: https://github.com/Davidcarmelalex/fcri
Inspected baseline: b96ec825423d6984e008f9717866967729d8593c (main).

## Install in Ubuntu / Codex

Use an existing cloud checkout if one is already provided. Otherwise:

```bash
mkdir -p "$HOME/azrael"
git clone https://github.com/Davidcarmelalex/fcri.git "$HOME/azrael/fcri"
cd "$HOME/azrael/fcri"
```

After merging the factory PR, the factory is already present in the checkout;
no ZIP extraction is necessary. Before merge, fetch and check out the PR branch
`codex/azrael-engineering-factory` in a clean checkout.

For a separately uploaded ZIP, first inspect and extract to a NEW staging
directory, not over existing repository files:

```bash
ZIP=/absolute/path/AZRAEL_Codex_Engineering_Factory.zip
python3 -m zipfile -t "$ZIP"
python3 -m zipfile -l "$ZIP"
STAGE=$(mktemp -d)
python3 -m zipfile -e "$ZIP" "$STAGE"
test ! -e engineering-factory
cp -R "$STAGE/engineering-factory" ./engineering-factory
```

The verified archive has exactly one top-level directory: engineering-factory/.
It contains no application source, credentials, dependencies, or Git history.
Use the provided SHA256SUMS to check an uploaded ZIP before extraction.

## Preflight

Ubuntu prerequisites: git, Python 3.11 or later with venv and pip, and network
access to GitHub and PyPI. If Python venv is missing, an Ubuntu administrator can
install `python3-venv`. Do not assume /root or /opt is writable; the commands use
the current user's home directory. Set up in an isolated environment:

```bash
python3 -m venv "$HOME/azrael/venv"
source "$HOME/azrael/venv/bin/activate"
python -m pip install -r azrael/azrael-core/requirements.txt
bash engineering-factory/scripts/preflight.sh
```

Dependencies in the current repository are not pinned. Record installed
versions in preflight output; reproducibility remains follow-up work.
Preflight does not change application code or start any defense agents.
It reports the original test-collection failure until AZ-001 is repaired.
An import error is not seven failed assertions or seven passing tests.

## Work / Cloud setup

Choose Work in > Cloud > Select environment > Create environment. Select
Davidcarmelalex/fcri, prepare dependencies, review the setup report and publish.
The factory must be present on the branch used by that environment. Alternatively
upload this ZIP into the actual Ubuntu task and follow the staging commands.
Allow GitHub and PyPI hosts under the environment's network settings.
Publishing a new environment does not modify an existing task's filesystem.

This package does not configure an always-on service or guarantee 24-hour work.
Use one task per branch, preserve human review, and stop on missing access.
Never run destructive response actions or connect to production systems as
part of preflight. The current chat cannot mount files into a separate cloud VM.

See tasks/AZ-001.md, tasks/AZ-002.md, and CODEX_START.md.
