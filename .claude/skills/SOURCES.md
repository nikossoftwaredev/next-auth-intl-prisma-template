# Vendored skills: sources and scan verdicts

Every skill here passed the SkillSpector gate in `.claude/rules/ai-tooling.md` (NVIDIA SkillSpector v2.13.4, LLM analysis through `claude_cli`). Third-party skills were copied byte for byte from the pinned ref that was scanned. To update one, scan the new ref first and replace the folder only on SAFE, or on CAUTION approved by Nikos.

## Installed

| Skill | Source | Ref | Verdict | Scanned |
| --- | --- | --- | --- | --- |
| `gsap-core`, `gsap-frameworks`, `gsap-performance`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-utils` | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) (MIT) | `aed9cfd` | SAFE | 2026-11-09 |
| `gsap-plugins` | greensock/gsap-skills | `aed9cfd` | CAUTION, approved by Nikos | 2026-11-09 |
| `emil-design-eng` | [emilkowalski/skills](https://github.com/emilkowalski/skills) (MIT) | `715c180` | SAFE | 2026-11-09 |
| `review-animations` | emilkowalski/skills | `715c180` | CAUTION, approved by Nikos | 2026-11-09 |
| `lenis-gsap` | Written for this repo | | SAFE | 2026-11-09 |
| `adapt`, `animate`, `arrange`, `audit`, `bolder`, `clarify`, `colorize`, `delight`, `distill`, `extract`, `impeccable`, `normalize`, `onboard`, `optimize`, `overdrive`, `polish`, `quieter`, `shape`, `typeset` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) (Apache 2.0), pre-2.1 layout, vendored before the gate | unknown | SAFE | 2026-11-09 |
| `harden` | pbakaus/impeccable, pre-2.1 | unknown | CAUTION, approved by Nikos | 2026-11-09 |
| `critique` | pbakaus/impeccable, pre-2.1, **locally modified** | unknown | SAFE after the change | 2026-11-09 |
| `stripe-best-practices` | Vendored before the gate | unknown | SAFE | 2026-11-09 |

### Why the CAUTION ones were approved

- `gsap-plugins`: the HIGH "credential access" hit is the word `.npmrc` in a line telling the agent NOT to create one. The other finding is PixiPlugin missing from the description.
- `review-animations`: `STANDARDS.md` was only 50% analyzed. Read in full by hand: animation values and two reference links (easing.dev, easings.co), no commands, no hidden characters.
- `harden`: a static analyzer failed on the file (coverage 0%, no findings). Read by hand: UI hardening guidance only, no URLs, commands or hidden characters.

### Local change to `critique`

The original scored DO_NOT_INSTALL: its "Assessment B" ran the unpinned `impeccable` npm package (the 4.x line rejected below), started a background server and injected a `<script>` into the page. That section was removed; the LLM design review, scoring and personas remain.

## Rejected (DO_NOT_INSTALL)

| Skill | Source | Ref | Main findings |
| --- | --- | --- | --- |
| `impeccable` 4.8.1 (and its design hook) | pbakaus/impeccable | `skill-v4.8.1` | Downloads and runs a native binary, writes `~/.claude/settings.json`, live mode treats `_instructions` in tool output as authoritative |
| `playwright-cli` agent skill | `@playwright/cli` 0.1.23 (bundled) | npm 0.1.23 | Cookie extraction examples, `gh` PR posting, session state files, unpinned `npx`. The CLI itself is used through `/site-qa`. |
