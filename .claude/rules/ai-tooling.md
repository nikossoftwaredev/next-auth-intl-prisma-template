# AI Tooling: Skill Gate, Inventory, Delivery QA

<!-- No `paths` frontmatter: this file loads every session, because a skill or
     tool can be installed from any task. -->

## Nothing is installed before SkillSpector scans it

Every third-party skill, plugin or agent instruction set goes through NVIDIA SkillSpector before it touches `.claude/`.

- **Install SkillSpector from NVIDIA's GitHub only:** `uv tool install git+https://github.com/NVIDIA/SkillSpector.git@<tag>`. **Never** `pip install skillspector`, `uv tool install skillspector` or `uvx skillspector`: that PyPI name was malware (MAL-2026-6561) that sent hostname and username to a third party.
- LLM analysis uses the Claude login: `SKILLSPECTOR_PROVIDER=claude_cli`.
- Clone the source pinned to a tag or commit into its own empty folder in the scratchpad, scan it there, and copy exactly those scanned bytes into `.claude/skills/`. Never run an installer that downloads a fresh copy after the scan.
- Read `recommendation` from `--format json`. The exit code is 0 for both SAFE and CAUTION, so it cannot gate on its own.
- **SAFE** installs. **CAUTION** goes to the user with the findings explained. **DO_NOT_INSTALL** never installs, even when the findings look like false positives; tell the user and stop.
- Windows: `--output` is unsupported (redirect stdout instead), and v2.13.4 has no `--max-skills`.
- A clean scan is defense in depth, not a sandbox. Still read what a skill tells the agent to do.
- Record every vendored skill in `.claude/skills/SOURCES.md`: source repo, pinned ref, verdict, date.

## What is in, and what stays out

The inventory with sources and verdicts lives in `.claude/skills/SOURCES.md`. Deliberately not installed:

| Tool | Why |
| --- | --- |
| Impeccable 4.x (and its design hook) | DO_NOT_INSTALL on 2026-11-09: downloads and runs a native binary, writes `~/.claude/settings.json`, and its live mode treats `_instructions` in tool output as authoritative. The template keeps the older vendored Impeccable skills. |
| Playwright CLI's bundled agent skill | DO_NOT_INSTALL. The CLI itself (`@playwright/cli`, devDependency) is used through `/site-qa` only. |
| Taste Skill | Fights Impeccable with conflicting design rules |
| Playwright MCP | The CLI does the same job with fewer tokens |
| Figma MCP | Not part of the workflow; add it with one command when a project needs it |
| `frontend-design` plugin | Disabled in `.claude/settings.json`: Impeccable is built on it and both trigger on the same requests |

## Never run `/impeccable teach` in the template

It writes `.impeccable.md` with one product's audience and brand, and every clone would inherit it. Run it in each client repo after cloning.

## Before every delivery

Run `/audit`, then `/site-qa`, and fix until zero Blockers remain open.
