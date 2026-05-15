<!-- managed-by: golden-path v1 -->
# AGENTS.md — `vtex.admin-pages`

> This file is the canonical agent instruction surface for the repository.
> `CLAUDE.md`, `.github/copilot-instructions.md`, and
> `.cursor/rules/specify-rules.mdc` are symlinks to this file. Keep changes here.

## Repository Purpose

`vtex.admin-pages` is the VTEX IO Admin app that powers the visual page editor
inside the VTEX Admin. It composes the `admin`, `messages`, `react`, and `docs`
builders. The `react/` builder owns the editor UI, form generation, and content
page workflows; the other builders ship navigation/routes, translations, and
TechDocs. There is no `node/` runtime — the app is purely frontend.

## Sources of Truth

Read these before editing — they encode contract behavior that is hard to
rediscover from source alone:

- `manifest.json` — app identity, builders, dependencies, policies, settings
- `admin/navigation.json`, `admin/routes.json` — Admin entry points and routes
- `react/package.json` — React builder scripts, dependencies, lint-staged config
- `react/.eslintrc`, `react/.prettierrc`, `react/tsconfig.json` — tooling for the
  React builder
- `react/queries/`, `react/components/` — the editor's GraphQL queries and UI tree
- `messages/` — translation catalogs (locale equality is enforced via
  `intl-equalizer`)
- `pages/plugins.json` — registered page plugins
- `docs/README.md`, `docs/CONTENT_PAGE.md` — extended docs
- `.vtex/deployment.yaml` — DK CI pipelines
- `.vtex/catalog-info.yaml` — Backstage ownership and platform-flow metadata
- `CHANGELOG.md` — release history

When SDD Full is in use, the relevant `.specify/memory/constitution.md`,
`docs/scope_of_work/<feature>.md`, and `specs/<feature>/…` files override
generic guidance.

## Verified Commands

All Make targets exist in `Makefile`; underlying scripts exist in
`react/package.json` and the root `package.json`.

| Command | What it runs | When to use |
|---|---|---|
| `make dev` | `yarn install` (root + react) + `vtex setup` | First-time setup or after lockfile changes |
| `make lint` | `yarn --cwd react lint` (ESLint, `--max-warnings=0`, no `--fix`) | Pre-commit, pre-PR |
| `make test` | `yarn --cwd react test` (`vtex-test-tools test`) | After code changes |
| `make coverage` | Jest with LCOV reporter | Before opening a PR that touches `react/` |
| `make check` | `lint` then `test` | The pre-PR gate |
| `make link` | `vtex link` against the active workspace | Manual smoke test on a workspace |
| `make sdd-init` | `specify init .` | One-time, to scaffold `.specify/` for SDD Full |

NPM-level shortcuts (when running outside Make):

- `yarn --cwd react ci` → `lint:locales` + `test`
- `yarn --cwd react lint:locales` → `intl-equalizer` (locale drift)

Do not run `yarn lint` at the root — there is no such script there. Always
`cd react` or use the Make targets.

## Architecture Boundaries

| Layer / folder | Allowed imports | Must not |
|---|---|---|
| `react/components/` | React, `@vtex/admin-ui`, `vtex.styleguide`, intl helpers | Import directly from build outputs (`lib/`, `.build/`) |
| `react/queries/` | `graphql-tag`, `apollo-client` | Hold component state |
| `react/utils/` | Pure functions / hooks | Touch the network without going through a client in `queries/` or `clients/` |
| `messages/` | n/a (JSON only) | Diverge from `en.json` — `lint:locales` will fail |
| `admin/`, `pages/`, `store/`-style declarations | n/a (JSON only) | Carry executable logic |

## Expected Skills

Per the Golden Path doc, agents should bring SDD skills from
[`vtex/vtex-agent-skills`](https://github.com/vtex/vtex-agent-skills):

- `specification` — generate spec documents for SDD Lite tasks
- `implementing` — non-interactive sandbox implementation from a spec

For VTEX IO–specific work, also use:

- `vtex-io-cli` — Toolbelt usage and workspace/app lifecycle
- `vtex-io-app-structure` — `manifest.json`, builders, policies, packaging
- `vtex-io-react-apps` — React builder components and Store Framework integration
- `shoreline-assistant` — VTEX Admin / agent-canvas UI work

## Expected MCPs

Configure at least these MCP servers in `.mcp.json` (project-scoped) or
`.cursor/mcp.json`:

- `github` — cross-repo references, PRs, issues
- `shoreline-assistant` — VTEX Admin design system support
- `atlassian` — when Jira/Confluence context drives the task

## Autonomy Limits

Agents MUST stop and ask before:

- Running `vtex link`, `vtex publish`, `vtex deploy`, or any
  workspace-/account-changing Toolbelt command
- Running `vtex setup --tooling` — it can overwrite `react/.eslintrc`,
  `react/.prettierrc`, or `react/tsconfig.json` (this repo has custom rules)
- Pushing to `master` directly, force-pushing, or rewriting published history
- Modifying `CHANGELOG.md` formatting conventions or the release flow
- Editing `messages/*.json` other than `en.json` (translations are managed via
  Crowdin per `crowdin.yml`)
- Touching `.vtex/deployment.yaml` pipelines or `.vtex/catalog-info.yaml`
  annotations that affect platform metadata
- Committing changes to `react/yarn.lock` without running a fresh install

Cross-team coordination required for:

- Schema changes that affect consumers of `vtex.admin-pages` (Store Framework,
  Admin home, IO core)
- Changes to the Admin routes declared in `admin/routes.json` and
  `admin/navigation.json`
