<!-- managed-by: golden-path v1 -->
# Data Model

`vtex.admin-pages` is a frontend-only VTEX IO app — it owns no MasterData
entities and exposes no GraphQL schema. The data the editor manipulates lives
in the apps that back the Admin experience.

## External entities (read/written through GraphQL)

| Entity | Owner app | Operations consumed | Where the queries live |
|---|---|---|---|
| Route | `vtex.pages-graphql` | list / read / save | `react/queries/`, `react/PageForm.tsx`, `react/PageList.tsx` |
| Content Page | `vtex.admin-cms` | list / read / save | `react/queries/`, `react/components/admin/pages/` |
| Redirect | `vtex.rewriter` | list / read / save / delete | `react/RedirectForm.tsx`, `react/RedirectList.tsx` |
| Message (translation) | `vtex.messages` | list / save | `react/queries/` |
| App metadata | `vtex.apps-graphql` | read manifest, settings | `react/queries/` |
| Style configuration | `vtex.styles-graphql` | list / read | `react/queries/` |
| PWA settings | `vtex.pwa-graphql` | read | `react/queries/` |
| Tenant metadata | `vtex.tenant-graphql` | read bindings | `react/queries/` |
| File asset | `vtex.file-manager-graphql` + `vtex.file-manager` | upload / list | `react/MediaGalleryWidget.tsx` |

## Local declarative data

| File | Purpose |
|---|---|
| `admin/routes.json` | Routes the app contributes to the Admin |
| `admin/navigation.json` | Items rendered in the Admin navigation tree |
| `pages/plugins.json` | Editor plugin registry |
| `messages/<locale>.json` | Translation catalogs (one per locale, structure mirrors `en.json`) |
| `manifest.json` → `settingsSchema` | The single tenant setting: `copyContentBinding` (boolean) |

## App settings

| Setting | Type | Default | Description |
|---|---|---|---|
| `copyContentBinding` | boolean | `false` | Enables the feature that copies pages from one binding to another |

<!-- TODO(team): if new MasterData schemas or app-owned storage are introduced, document them here. -->
