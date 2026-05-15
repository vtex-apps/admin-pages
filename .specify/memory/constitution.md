# vtex.admin-pages Constitution

`vtex.admin-pages` is a VTEX IO Admin app that powers the visual page editor
inside the VTEX Admin. It composes the `admin`, `messages`, `react`, and `docs`
builders declared in `manifest.json`. All executable behavior lives in the
`react/` builder; the other builders ship JSON-only declarations
(navigation/routes, locale catalogs, TechDocs).

This constitution captures the durable rules the team commits to. It
supersedes ad-hoc conventions and is the reference point reviewers use when
approving PRs.

## Core Principles

### I. Frontend-Only Boundary (NON-NEGOTIABLE)

`admin-pages` is and remains a frontend IO app. It MUST NOT introduce a
`node/` builder, a `graphql/` builder, MasterData schemas, or any backend
runtime owned by this app. Behavior changes that require new server-side
logic MUST flow through a dependent app declared in `manifest.json`
(e.g. `vtex.pages-graphql`, `vtex.admin-cms`, `vtex.rewriter`). PRs that
add a backend builder are rejected on principle, not on review preference.

*Evidence:* `manifest.json` builders list (`admin`, `messages`, `react`,
`docs`); `docs/data-model.md` enumerates external entities consumed via
GraphQL.

### II. Reference Apps Drive Data Contracts

Every external entity the editor reads or mutates MUST be consumed through
a typed GraphQL query under `react/queries/` whose backing app is declared
in `manifest.json` dependencies. Direct `fetch`/`axios` calls to internal
VTEX APIs without going through a dependent app are not allowed. Adding a
new data source is a three-step contract:

1. Add the app to `manifest.json` dependencies.
2. Add the query/mutation under `react/queries/`.
3. Update `docs/data-model.md` so the audit trail stays accurate.

*Evidence:* `react/queries/`, `manifest.json` dependencies block,
`docs/data-model.md`.

### III. Locale Equality Is a Release Gate

`messages/en.json` is the canonical catalog. Every other locale under
`messages/` MUST have exactly the same keys. The `intl-equalizer` check
(`yarn --cwd react lint:locales`) is part of `react`'s `ci` script and runs
in pre-commit via `lint-staged`, so it MUST stay green at all times.
Translations are managed via Crowdin (`crowdin.yml`); direct edits to
non-English locales are reserved for automated Crowdin sync and emergency
hotfixes.

*Evidence:* `react/package.json` (`lint:locales`, `lint-staged`),
`crowdin.yml`, `react/package.json` `intl-equalizer` block pointing at
`../messages/`.

### IV. Zero ESLint Warnings

The `react/` builder lints with `eslint -c .eslintrc ./ --ext ts,tsx
--max-warnings=0`. Warnings ARE failures. New rules either pass cleanly,
get fixed in the same PR, or are relaxed in `react/.eslintrc` with an
explicit justification in the PR description. The base configuration is
`eslint-config-vtex-react`; replacing it with a generic config is treated
as an architectural change and requires an ADR or RFC.

*Evidence:* `react/.eslintrc`, `react/package.json` `lint` script.

### V. Coverage Must Reach SonarQube

Tests run via `vtex-test-tools test`. The PR gate command
`yarn --cwd react test:coverage` MUST produce `react/coverage/lcov.info`,
which `.vtex/deployment.yaml`'s `node-ci-v2` pipeline (with
`contextPath: "react"`) ships to SonarQube. Disabling the scan (removing
`node-ci-v2`, setting `skipScan: "true"`, dropping `--coverage`, or
relocating coverage output) requires team sign-off in the PR. Quality-gate
thresholds (Coverage on New Code > 85%, Maintainability/Reliability/Security
Rating ≥ A, Security Hotspots Reviewed = 100%) are managed server-side and
MUST NOT be overridden locally.

*Evidence:* `react/package.json` `test:coverage`, root `package.json`
`test:coverage` bridge, `.vtex/deployment.yaml` `node-ci-v2` entry.

### VI. Workspace-Changing Toolbelt Operations Require Human Consent

`vtex link`, `vtex publish`, `vtex deploy`, `vtex use`, `vtex workspace
promote`, and `vtex setup --tooling` change live state or overwrite custom
tooling files. Automation, CI, and AI agents MUST stop and ask before
running any of them. The `make link` and `make run` targets print this
disclaimer and require interactive confirmation.

*Evidence:* `Makefile` (`link`, `run` targets), `AGENTS.md` Autonomy
Limits, `react/.eslintrc` and `react/.prettierrc` carrying custom rules
that `vtex setup --tooling` would otherwise overwrite.

### VII. Releases Are CHANGELOG-Driven

Every PR that ships user-observable behavior MUST add an entry to
`CHANGELOG.md`. The `vtex publish` step (wired to
`manifest.json.scripts.postreleasy`) runs only from a clean `master` after
a CHANGELOG bump and a maintainer-approved PR merge. Direct pushes to
`master`, force-pushes, or republishing a previously published version
are not allowed.

*Evidence:* `CHANGELOG.md` history, `manifest.json` `scripts.postreleasy`,
`.github/CODEOWNERS` (`@vtex/store-framework`).

## Architectural Constraints

- **Builder JSON files are declarative.** `admin/navigation.json`,
  `admin/routes.json`, `pages/plugins.json`, and `manifest.json`
  `settingsSchema` are read at build/install time. They MUST NOT carry
  executable logic, comments embedded as keys, or environment-specific
  values.
- **Component imports respect layers.** `react/queries/` MAY only depend on
  Apollo/GraphQL primitives and other queries. `react/utils/` MUST stay
  pure (no React hooks, no network). `react/components/` MAY consume both
  but MUST NOT import build artifacts (`lib/`, `.build/`).
- **Dependency upgrades to VTEX IO builders are coordinated.** Bumping
  `admin@0.x`, `react@3.x`, `messages@1.x`, or `docs@0.x` in
  `manifest.json` requires confirmation with the builder-hub team because
  the platform-side build, lint, and typecheck come from those versions.
- **Public-repo posture.** `vtex-apps/admin-pages` is a public repository.
  Secrets, internal URLs, and account-specific identifiers MUST NOT land
  in committed files. The `.gitignore` already ignores `.mcp.json`,
  `.claude/`, `.agents/`, and the local-only parts of `.specify/`.

## Development Workflow

- **Pre-PR gate (local).** Run `make check` (`lint` + `test`) and, when
  touching `react/`, `make coverage`. The pre-commit hook in
  `package.json` runs `lint-staged` over staged `react/` files.
- **CI pipelines (DK CI).** Every PR triggers `vtexio/build` (builder-hub
  build/lint/typecheck) and `node-ci-v2` (tests + SonarQube scan against
  `react/`). The `techdocs-v1` pipeline publishes docs on push to
  `master` when `docs/**` or `.vtex/deployment.{yaml,json}` change.
- **SDD per task.** Choose SDD Full or SDD Lite per task using
  `docs/sdd/model-guide.md`. SDD Full uses the spec-kit pipeline
  (`/speckit.specify` → `/speckit.plan` → `/speckit.tasks` →
  `/speckit.implement`) with `docs/scope_of_work/<feature>.md` as input.
  SDD Lite uses `/specification` + `/implementing` from
  `vtex/vtex-agent-skills`.
- **Agent instructions.** `AGENTS.md` is the canonical instruction file
  for Claude (`CLAUDE.md`), GitHub Copilot
  (`.github/copilot-instructions.md`), and Cursor
  (`.cursor/rules/specify-rules.mdc`) via symlinks. Edits go to
  `AGENTS.md`; the others follow automatically.

## Governance

This constitution supersedes ad-hoc conventions and undocumented
preferences. PR reviewers from `@vtex/store-framework` MUST verify that
changes do not violate a Core Principle before approving; principle
violations require either a fix or an amendment to this document in the
same review cycle.

Amendments to this constitution require:

1. A PR that updates `.specify/memory/constitution.md` with the new rule
   and the supporting evidence.
2. Maintainer review by at least one `@vtex/store-framework` codeowner.
3. A bump to the version line below — **MAJOR** for principle additions
   or removals, **MINOR** for non-breaking rule expansions or new
   sections, **PATCH** for editorial clarifications.
4. An entry in `CHANGELOG.md` referencing the amendment.

Runtime guidance for human contributors and AI agents lives in
[`AGENTS.md`](../../AGENTS.md), sourced from the same boundaries declared
here.

<!-- TODO(team): formalize where ADRs and RFCs live for this repo — under `docs/adr/`, `docs/rfcs/`, or in a shared store-framework knowledge base. -->
<!-- TODO(team): define the explicit threshold (effort/days, critical-flow taxonomy) the team uses to pick SDD Full over SDD Lite, so the decision in `docs/sdd/model-guide.md` is not subjective. -->

**Version**: 1.0.0 | **Ratified**: 2026-05-15 | **Last Amended**: 2026-05-15
