<!-- managed-by: golden-path v1 -->
# Glossary

Domain vocabulary used in `vtex.admin-pages`. Confirm and expand entries with
the product team — anything marked _TODO(team)_ needs human context.

| Term | Definition |
|---|---|
| **Page** | A composable route in the storefront, defined under `pages/` and edited through the Admin Pages UI. |
| **Content Page** | A page type whose body is authored as content blocks rather than fixed components. See `docs/CONTENT_PAGE.md`. |
| **Editable Component** | A React component exposed to the editor through a static `schema` constant or a dynamic `getSchema` function. See `docs/README.md`. |
| **Editor** | The visual editing surface rendered by the `react/` builder of this app. |
| **Extension Point** | A slot in the storefront tree where content can be plugged in (`EditableExtensionPoint`, `EmptyExtensionPoint`). |
| **Plugin** | Editor extension registered through `pages/plugins.json`. |
| **Redirect** | Pages → URL rewrites managed through `RedirectForm` / `RedirectList`, persisted by `vtex.rewriter`. |
| **Institutional Page** | Static informational page edited through `InstitutionalPageForm` / `InstitutionalPageList`. |
| **Binding** | A locale/site binding (channel, sales channel, language) — Pages Admin can optionally copy content across bindings (`copyContentBinding` setting). |
| **Site Editor** | The broader VTEX editor experience this app contributes to (cross-app concept). |
| **Builder** | A VTEX IO declaration in `manifest.json` that packages a folder into a platform artifact (`admin`, `react`, `messages`, `docs`). |
| **Workspace** | A VTEX account environment used for development (linked via `vtex link`). |
| **Locale Equality** | Constraint enforced by `intl-equalizer`: every locale must have the same keys as `en.json`. |

<!-- TODO(team): confirm terminology that crosses into Store Framework (e.g. "block", "interface") so this glossary is consistent with vtex.store. -->
