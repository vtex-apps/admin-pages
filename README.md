<!-- managed-by: golden-path v1 -->
# VTEX Pages Admin (`vtex.admin-pages`)

The Pages Admin is the VTEX Admin app that lets store administrators visually edit a
VTEX Store: selecting editable components, changing their configurations, and adding
or removing content in a straightforward way. It is a VTEX IO app composed of the
`admin`, `messages`, `react`, and `docs` builders.

- Public registry: `vtex.admin-pages`
- Source: <https://github.com/vtex-apps/admin-pages>
- Backstage component: `admin-pages` (owner `te-0013`)

## Prerequisites

- Node.js 18+ (matching the VTEX IO React builder runtime)
- [Yarn](https://classic.yarnpkg.com/) (used by both the repo root and `react/`)
- [VTEX Toolbelt](https://www.npmjs.com/package/vtex) — log in with `vtex login <account>`
- Access to a VTEX account where you can link this app

## How to run

This is a VTEX IO app — there is no local server. Development happens against a live
VTEX workspace via the Toolbelt.

```bash
make dev   # install root deps, react/ deps, run `vtex setup`
make link  # vtex link in the active account/workspace (requires confirmation)
```

Manual equivalent:

```bash
yarn install --frozen-lockfile
yarn --cwd react install --frozen-lockfile
vtex setup
vtex use <dev-workspace>
vtex link
```

> ⚠️ `vtex link`, `vtex publish`, and `vtex deploy` change the active account/workspace.
> Never run them in automation without explicit confirmation.

## How to test

```bash
make test       # vtex-test-tools test (Jest under the hood)
make coverage   # same, with LCOV coverage report for SonarQube
make check      # lint + test — the pre-PR gate
make lint       # ESLint on react/, --max-warnings=0
```

Locale equality (translation drift) is also enforced:

```bash
yarn --cwd react lint:locales
```

## How to publish

The app is published from `master` after a Conventional-Commits-style
[`CHANGELOG.md`](./CHANGELOG.md) entry is added. Publishing flows through the VTEX IO
registry:

```bash
# from a clean master, after CHANGELOG bump
vtex publish
```

Manifest scripts wire `postreleasy` to `vtex publish -r vtex --verbose`.

CI runs on DK CI through [`.vtex/deployment.yaml`](./.vtex/deployment.yaml):

- `vtexio/build` — builder-hub validates the IO build, lint, and typecheck
- `node-ci-v2` — tests + SonarQube reporting for executable `react/` code
- `techdocs-v1` — publishes the docs under `docs/` to TechDocs

## Documentation

- [`docs/README.md`](./docs/README.md) — extended developer documentation
- [`docs/CONTENT_PAGE.md`](./docs/CONTENT_PAGE.md) — Content Pages reference
- [`docs/glossary.md`](./docs/glossary.md) — domain vocabulary
- [`docs/data-model.md`](./docs/data-model.md) — main entities and relationships
- [`docs/scope_of_work/`](./docs/scope_of_work/) — Scope-of-Work template (SDD Full input)
- [`docs/sdd/model-guide.md`](./docs/sdd/model-guide.md) — recommended models per SDD command
- [`AGENTS.md`](./AGENTS.md) — agent instructions (also exposed as `CLAUDE.md`,
  `.github/copilot-instructions.md`, `.cursor/rules/specify-rules.mdc`)
- [Engineering Golden Path](https://darkkitchen.vtex.com/docs/default/domain/engineering/engineering-golden-path/golden_path/)
