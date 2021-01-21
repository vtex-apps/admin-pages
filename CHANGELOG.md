# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [4.32.0] - 2021-01-21
### Added
- Adds binding selector for CMS Pages 

## [4.31.1] - 2021-01-20
### Fixed
- Sending blockId in `Form index` component even when is not changed to prevent unexpected behaviors

## [4.31.0] - 2021-01-13
### Added
- Keep selected binding between admin reloads.

## [4.30.0] - 2020-12-14

### Added

- I18n Ro.
- Crowdin configuration file.

## [4.29.0] - 2020-12-11

### Added

- Admin v4 navigation setup

## [4.28.0] - 2020-11-23

### Fixed

- Templates scheduled to go live in a specific day now always go live at midnight

## [4.27.2] - 2020-09-30

### Added

- Add custom entity scope message

## [4.27.1] - 2020-09-30

### Fixed

- Uses querystring to get the redirect

## [4.27.0] - 2020-07-21 [YANKED]

### Added

- Field `binding` to redirects export spreadsheet.

## [4.26.0] - 2020-07-16

## [4.25.2] - 2020-06-30

### Fixed

- `undefined` appearing in the URL path wouldn't allow page to be loaded

## [4.25.1] - 2020-06-29

### Fixed

- Revert changes made in `4.25.0`

## [4.25.0] - 2020-06-29 [YANKED]

### Changed

- Replace node lib with browser version.

## [4.24.2] - 2020-06-18

### Fixed

- When accessing a specific page directly, the querystring was being ignored

## [4.24.1] - 2020-05-14

### Fixed

- Add vtex.rewriter as datasource for page editing.

## [4.24.0] - 2020-04-24

### Added

- `dataSource` field to save user routes as rewriter internal routes

## [4.23.1] - 2020-04-01

### Fix

- Uses new redirect list API

## [4.23.0] - 2020-03-24

## [4.22.0] - 2020-03-24

## [4.21.2-beta.2] - 2020-03-10

## [4.21.2-beta.1] - 2020-03-10

### Added

- Better feedback to redirects bulk upload.

### Changed

- Redirects admin uses `rewriter` instead of `pages` to read/write redirects, since `rewriter` has a higher limit to the number redirects that can be created.

## [4.21.0] - 2020-01-27

### Added

- "Not found (404)" category on pages.

## [4.20.2] - 2020-01-23

### Fixed

- The styles admin was displaying a loading in the right side. This loading
  animation was removed since there was nothing to be displayed there.

## [4.20.1] - 2020-01-16

### Fixed

- Bug in which changing to a binding with a default locale different than the current one wouldn't update the locale selector's value.

## [4.20.0] - 2020-01-13

### Added

- Bindings support.

### Fixed

- Preview mode toggle.

## [4.19.1] - 2020-01-10

### Fixed

- Layout instability when loading the site editor. The sidebar would take a few
  seconds to appear and the page would undesirably resize

## [4.19.0] - 2020-01-09

### Added

- Add Splash Screen image loading animation.

## [4.18.9] - 2020-01-08

### Changed

- Update `react-intl` to latest version.

## [4.18.8] - 2020-01-06

### Added

- Add styles menu item to GoCommerce sidebar too.

## [4.18.7] - 2020-01-06

## [4.18.6] - 2019-12-26

### Changed

- Decrease batch size AGAIN to make a timeout with messages service less probable.

## [4.18.5] - 2019-12-23

### Changed

- Move global CSS to scoped modules.

### Fixed

- Typescript errors.

### Removed

- Unused CSS classes from components and CSS files.

## [4.18.4] - 2019-12-20

### Changed

- Decrease batch size to make less probable a timeout with messages

## [4.18.3] - 2019-11-21

### Fixed

- Editor sidebar width.

## [4.18.2] - 2019-11-19

### Changed

- Small visual tweak: removed unwanted shadow from the card block list

## [4.18.1] - 2019-11-14

### Changed

- Improve the Site Editor's modals' texts.

## [4.18.0] - 2019-11-14

### Added

- Tooltips to Site Editor's topbar controls.

## [4.17.1] - 2019-11-13

### Fixed

- `HighlightOverlay` now appropriately updates its height as the block being edited changes.
- Missing `State` export from `HighlightOverlay`.

## [4.17.0] - 2019-11-13

### Added

- Store and Styles shortcuts to the admin sidebar.

### Changed

- Redesign the Site Editor's topbar and its components.
- Move the Store and Styles editors to separate admin pages.
- Move the viewport controls to the topbar.

### Fixed

- Unnecessary Y overflow on smaller viewports.

## [4.16.3] - 2019-11-07

### Changed

- Changed style of the editable input that goes in the block editor header

## [4.16.2] - 2019-11-07

### Changed

- Place app cards last in the configuration list.
- Place active card first in the configuration list.
- Place expired cards just before the app card in the configuration list.
- Mark expired configuration cards as inactive.

## [4.16.1] - 2019-11-07

### Changed

- Updated sidebar block editor header visual

## [4.16.0] - 2019-11-07

### Changed

- Use new translate API from vtex.messages

## [4.15.0] - 2019-11-01

### Added

- Add `On the first purchase` prompt event option in `PWAForm`.

## [4.14.3] - 2019-10-28

## [4.14.2] - 2019-10-25

### Fixed

- Race condition when more than one messages batch was fetched from the server

### Fixed

- Z-index issues with the date picker, which prevented users from scheduling content.
- Block editing's modals' messages.
- Issue where clicking children blocks in the sidebar would open their parents.

### Removed

- Unused i18n messages and the `SaveButton` component.

## [4.14.1] - 2019-10-23

### Fixed

- No option to "cancel" configuration delete

## [4.14.0] - 2019-10-23

### Added

- Status label to configuration cards.

### Changed

- Show the editing form with the active configuration when clicking to edit a block instead of the list of configurations.
- Refactor and improve the quality of a core part of our code base.

### Fixed

- When going back from edit a block, the blocks you expended before editing remain expanded.
- A bug in which, once a block was selected, the content would load forever.
- A few minor bugs.
- Many UX issues.

## [4.13.2] - 2019-10-23

### Fixed

- Highlighting last valid block when clicking to edit a block that isn't rendered or isn't valid, i.e., isn't editable.
- Highlighting block that isn't visible on the screen due to `overflow: hidden` (e.g., `Product Summary` on `Shelf`): Try to get the block closer to the middle of the window when selecting from a list of blocks (e.g.)

## [4.13.1] - 2019-10-18

### Fixed

- Bug in which the content would load forever.

## [4.13.0] - 2019-10-18

### Changed

- `HighlightOverlay` now has a new look: No more background color and dashed border, also added a label to show which block is selected. It stays visible when the user is editing a content.

## [4.12.7] - 2019-10-08

### Fixed

- Locale switcher's spanish and portuguese strings.

## [4.12.6] - 2019-09-30

### Added

- Suggest a path based on the page title when creating a new page.

## [4.12.5] - 2019-09-20

### Added

- Local cache to function `editorMessagesFromRuntime`.
- Localization to confirm prompt when attempting to navigate with open form.

## [4.12.4] - 2019-09-18

### Fixed

- Widgets' `onChange` and, consequently, v4.12.3's i18n solution.

## [4.12.3] - 2019-09-17

### Changed

- Replace the way i18n fields updates are handled with a (somewhat hacky) solution that doesn't use Runtime's `addMessages`.

### Fixed

- Some i18n editing inconsistencies.

## [4.12.2] - 2019-09-13

### Changed

- Where `__setHighlightTreePath` was typed: deleted old interface and add it to `Window` interface.

### Fixed

- Issue when hovering over an element that wasn't in the DOM, `HighlightOverlay` made the iframe height grow indefinitely.

## [4.12.1] - 2019-09-12

## Changed

- Improve rich text editor
- Save page slug based on page title

## [4.12.0] - 2019-09-11

### Changed

- Preview width

### Fixed

- Visibility of filters when editing an array item.

## [4.11.2] - 2019-09-11

### Added

- Missing messages that weren't being detected by babel plugin.

### Changed

- Always re-fetch content when opening a card.

### Removed

- `docs` from `.vtexignore`.
- Unused messages.

## [4.11.1] - 2019-09-09

### Added

- Changes from releases `v4.10.0` and `v4.10.1`.

### Fixed

- Editing nested arrays.

## [4.11.0] - 2019-09-09

### Added

- Docs builder.

## [4.10.5] - 2019-09-09

### Changed

- PWA splash screen title.

### Fixed

- PWA splash screen preview not found.

## [4.10.4] - 2019-09-03

### Fixed

- Rich text editor bug caused by wrong typings

## [4.10.3] - 2019-09-02

### Removed

- Temporarily revert releases v4.10.0 and v4.10.1.

## [4.10.2] - 2019-09-02

### Added

- Redirect from pages with `storefront` to `site-editor`.

### Changed

- Rename "Storefront" to "Site Editor".
- Make CI scripts run in parallel.

## [4.10.1] - 2019-08-29

### Fixed

- Array item editing's state stack logic.

## [4.10.0] - 2019-08-29

### Added

- Image preview for schemas that use the `image-uploader` widget.

### Changed

- Array item editing flow.

## [4.9.0] - 2019-08-29

### Added

- `promptOnCustomEvent` in `PWAForm`.

## [4.8.1] - 2019-08-29

### Fixed

- Content edition bug due to the usage of wrong tree paths in sitewide blocks.

## [4.8.0] - 2019-08-27

### Added

- `checkTypes` and `format` scripts to `react`'s `package.json`.

### Changed

- Replace TSLint with ESLint.
- Move linting and pre-commit configurations to the `react` folder.
- Update the Travis CI Node version.
- Update the Travis CI script.
- Update `react`'s `lint` script.

### Fixed

- All linting issues pointed out by VTEX's ESLint config, from typings to a11y.
- Typo in the Portuguese version of the production workspace warning text.

### Removed

- Unused scripts.

## [4.7.3] - 2019-08-27

## Fixed

- Make ContentIOMessage call newTranslate graphql resolver

## [4.7.2] - 2019-08-13

### Fixed

- Avoid crash when content translation fails

## [4.7.1] - 2019-08-06

### Fixed

- Responsiveness in content pages form and list

## [4.7.0] - 2019-08-01

### Removed

- Settings tab from the Pages admin.

## [4.6.1] - 2019-08-01

### Added

- Instructions to use content page.

### Fixed

- Avoid crash when trying to create a content page in a theme that doesn't support it.

## [4.6.0] - 2019-07-30

### Added

- Store's locale switcher at topbar

## [4.5.1] - 2019-07-29

### Fixed

- Send all route data when it's a user route.

## [4.5.0] - 2019-07-29

### Added

- Changes from `v3.17.0`.

## [3.17.0] - 2019-07-29

### Added

- It is now possible to edit the title of contextless routes.

### Changed

- Change title that is shown in pages list.
- Send partial route data to be saved.

## [4.4.0] - 2019-07-26

- Simplified form to create content pages.

## [4.3.1] - 2019-07-24

### Fixed

- Sidebar position in smaller windows.

## [4.3.0] - 2019-07-16

### Changed

- Changes from `v3.15.9`, `v3.16.0` and `v3.16.1`.

## [3.16.1] - 2019-07-16

### Fixed

- Properly hiding nested "layout" components.

## [3.16.0] - 2019-07-16

## [3.15.9] - 2019-07-11

### Fixed

- Add support to uiSchema from JSONSchema dependencies

## [4.2.7] - 2019-07-10

## [4.2.6] - 2019-07-09

### Changed

- Changes from `v3.15.8`.

## [3.15.8] - 2019-07-08

### Fixed

- Add `RichText` type to i18n Mapping

## [4.2.5] - 2019-07-04

### Changed

- Changes from `v3.15.7`.

## [3.15.7] - 2019-07-03

### Fixed

- Add allErrors to ajv validation

## [4.2.4] - 2019-07-03

### Changed

- Changes from `v3.15.6`.

## [3.15.6] - 2019-07-03

### Fixed

- Add empty field by type when form field is not modified

## [4.2.3] - 2019-07-03

### Changed

- Changes from `v3.15.5`.

## [3.15.5] - 2019-07-03

### Fixed

- Content save is now sending values properly.

## [4.2.2] - 2019-07-02

### Changed

- Changes from `v3.15.4`.

## [3.15.4] - 2019-07-02

### Changed

- Conditions to show extension on components list: stop considering block `composition` type, and uses whether they're editable or not.

### Fixed

- Showing nested components that are editable.
- Components list sort logic.

## [4.2.1] - 2019-07-02

### Changed

- Changes from `v3.15.3`.

## [4.2.0] - 2019-07-01

- Alert to inform the user in `master` workspace that his changes go to the production store.

## [4.1.3] - 2019-07-01

## [4.1.2] - 2019-06-27

### Changed

- Changes from `v3.15.2`.

## [4.1.1] - 2019-06-26

### Changed

- Prevent click on extensions that have `composition === 'children'`.
- Change style of items: `ExpandArrow` and `Item` hovers have been separated and no cursor and no hover on uneditable items.

## [4.1.0] - 2019-06-21

### Added

- Add warning to top of storefront when user is in development mode telling changes to content can't be promoted

## [4.0.0] - 2019-06-18

### Added

- Adds the ability to navigate to a specific URL by editing the storefront URL in the UI

## [4.0.0-beta] - 2019-06-10

### Changed

- [BREAKING] Change routes to be compliance with new admin 3.x architecture `/admin/app/<route>`.
- [BREAKING] Injects this admin in admin 3.x navigation (loosing compatibility with admin 2.x).
- Remove some context function calls that were previously injected by admin 2.x.

## [3.15.3] - 2019-07-02

### Fixed

- Properly handle `JSONSchema` dependencies and arrays

## [3.15.2] - 2019-06-27

### Fixed

- Create `onFileDrop` props on `ImageUploader` to make it work both as a `react-jsonschema-form` widget and a standalone component.

## [3.15.1] - 2019-06-26

### Changed

- Prevent click on extensions that have `composition === 'children'`.
- Change style of items: `ExpandArrow` and `Item` hovers have been separated and no cursor and no hover on uneditable items.

## [3.15.0] - 2019-06-18

## [3.14.4] - 2019-06-12

### Changed

- Improve `StoreForm` typing and refactor some parts of it.

## [3.14.3] - 2019-06-11

### Fixed

- Typo in the page creation form.

## [3.14.2] - 2019-06-11

### Changed

- Styles Editor feedback `Toast` is now positioned to the left.

## [3.14.1] - 2019-06-10

### Fixed

- When deleting a content configuration, the configuration list's `activeExtension` wasn't being updated and `updateRuntime` wasn't being run synchronously.

## [3.14.0] - 2019-06-06

### Added

- `RichText` widget, which, for now, is just a `TextArea` with i18n.

### Changed

- Rename `IOMessage` widget to `I18nInput`, and add a prop to replace `BaseInput` with `TextArea`.

### Fixed

- Prevent invalid values at `TextArea`.

### Removed

- `TextArea`'s horizontal resizing.

## [3.13.7] - 2019-06-06

### Fixed

- Typing issues.

## [3.13.6] - 2019-06-06

### Changed

- Simplify active content determination logic after saving a configuration.

### Fixed

- Handle edge case in which translatable fields' values are `undefined`.
- Prevent invalid values at `EditableText` and `BaseInput`.
- Add missing `contentMapId` field to the `Extension` interface.

### Security

- Upgrade `handlebars` to `^4.1.2`, since a vulnerability has been discovered in the previous version.

## [3.13.5] - 2019-06-06

### Fixed

- Use regex to replace all '/' to generate routeId.

## [3.13.4] - 2019-06-05

### Fixed

- `withPWASettings` condition to query the default colors from Styles GraphQL.

## [3.13.3] - 2019-06-04

### Fixed

- Deleting item when pressing Enter inside a carousel
- Navigation infinite loading when iframe runtime crashes.
- "Create new" message on pages portuguese translation.

## [3.13.2] - 2019-06-03

### Fixed

- `Scheduler`'s second `DatePicker`'s (`to`) position.

## [3.13.1] - 2019-05-29

### Fixed

- i18n mapping issues.

### Removed

- Unused CSS class from configuration card.

## [3.13.0] - 2019-05-29

### Added

- Loading overlay to content editor.
- Scope and condition information to configuration cards.

### Changed

- Make component editor's header editable.
- Configuration card layout.
- Size and color of the component editor's headers' back arrow.
- Standardize the component editor's headers.
- Move configuration creation button up and change its label.
- Increase spacing between form buttons.
- Use `EditorContext`'s loading state instead of `FormMetaContext`'s one.
- Use method to get `EditorContext`'s loading state instead of an attribute.

### Fixed

- `ModeButton` default messages.
- `vtex.native-types` typings.

## [3.12.1] - 2019-05-29

### Fixed

- Fixed style editor preview where tachyons was overriding components' css override.

## [3.12.0] - 2019-05-28

### Added

- Hint to Page Form.
- Validate if URL begins with '/'.
- Description and Keywords fields to Page Form when creating or editing a custom page.

### Fixed

- Image Uploader now has translated messages.
- Loading issue when navigating.
- Back button was updating the form before the user selected the discard option.

## [3.11.0] - 2019-05-28

## [3.10.5] - 2019-05-28

### Fixed

- Add format IO messages to radio button labels

## [3.10.4] - 2019-05-28

### Fixed

- Keep store editors state when hidden by store preview.

## [3.10.3] - 2019-05-28

### Fixed

- Add i18n to editor description field

## [3.10.2] - 2019-05-23

### Changed

- Check title type that is passed to component list item.

## [3.10.1] - 2019-05-23

### Changed

- When the page context can't be identified, set the configuration scope as "this template" and display a toast with a brief explanation.

### Fixed

- Page context evaluation logic in configuration cards' tags.

## [3.10.0] - 2019-05-23

### Added

- Support for `title` that comes from block.

### Changed

- `title` from block is also considered when deciding whether to show or hide the extension on the Sidebar.

## [3.9.1] - 2019-05-23

### Changed

- Reset content logic to improve UX.

### Added

- Add slight debounce to `formChange`.

### Fixed

- Typo on `HighlightOverlay` state.
- Only passing relevant schema, i.e., `layout` or `content` to Form.
- `useMemo` on some components instead of recreating an object every render.

## [3.9.0] - 2019-05-22

### Added

- `Other PWA settings` subsection so users can clearly see what really needs to be filled in the `Advanced Settings` form.

## [3.8.2] - 2019-05-21

### Changed

- When deleting a configuration, keep the loader until the configuration has been deleted.

### Fixed

- Inconsistent content edition caused by desynchronized Runtimes.
- Configuration list not being updated after creating/deleting configurations.

## [3.8.1] - 2019-05-17

### Fixed

- Highlight overlay assets being loaded on store

## [3.8.0] - 2019-05-10

### Changed

- Components are now nested on the list.

### Fixed

- Bug that was duplicating some blocks.

## [3.7.1] - 2019-05-10

### Fixed

- [Performance] `useMemo` on `Content` to get `initialComponents` so it isn't calculated every time.

## [3.7.0] - 2019-05-09

### Added

- Content i18n support.
- IOMessage widget.

### Changed

- Move Runtime update from configuration close to quit.
- Refactor `ConfigurationList` to – among other things – handle form data locally, only evaluating Runtime extensions when getting instantiated and opening a configuration;
- Only render `ConfigurationList` once the `ListContent` query is finished.
- Replace `editor` and `formMeta` props with `useEditorContext` and `useFormMetaContext` in some components.
- Rename `listContent` query to `listContentWithSchema`.

### Fixed

- Controlled/uncontrolled `BaseInput` issue.
- Null values at `LabelEditor`.
- Remove unused imports and props.

## [3.6.2] - 2019-05-09

### Added

- i18n default messages.

## [3.6.1] - 2019-05-06

### Fixed

- Split query to get messages in case there are too many components.

## [3.6.0] - 2019-05-03

### Added

- **EditorContainer**
  - Add `sticky` property to tabs at Store Settings menu.

## [3.5.2] - 2019-05-02

### Fixed

- Passing `blockId` on `SaveContent` mutation.

## [3.5.1] - 2019-05-02

### Removed

- **`editbar.global.css`**
  - Remove styles that changed elements globally: `html`, `body`, and `.render-provider`.

## [3.5.0] - 2019-04-28

### Changed

- Pass blockId to ListContent query.

### Removed

- Remove layout props editions.
- Disable reorder components.

### Fixed

- Correctly reset content when discarding.

## [3.4.2] - 2019-04-26

### Changed

- Refactor code to remove usage of `compose` from `react-apollo` as it shouldn't be used with Typescript.

## [3.4.1] - 2019-04-26

### Fixed

- **`__provideRuntime`**
  - Prevents query from stopping execution by using a try catch block.

### Changed

- **`PageEditor`**
  - Spread messages object instead of replacing.

## [3.4.0] - 2019-04-24

## [3.3.0] - 2019-04-24

## [3.2.1] - 2019-04-23

### Changed

- **`HighlightOverlay`**
  - Improve scroll behavior.

## [3.2.0] - 2019-04-23

## [3.1.1] - 2019-04-15

## [3.1.0] - 2019-04-11

### Changed

- **`EditorContainer`**
  - Change Store general/advanced settings logic to use tabs instead of buttons.

## [3.0.0] - 2019-04-10

### Added

- **`EditorContainer`**
  - Add toggle to allow disabling the "Add to Home Screen" prompt.

## [3.0.0-beta.9] - 2019-04-08

### Fixed

- Add settings button's intl id into `context.json`.

## [3.0.0-beta.8] - 2019-04-08

### Changed

- Bump to new `pwa-graphql` major.

## [3.0.0-beta.7] - 2019-04-08

### Added

- **`EditorContainer`**
  - Add the PWA settings to the `Store` settings.

## [3.0.0-beta.6] - 2019-04-04

### Added

- **`EditorContainer`**
  - Add the `settings` editor, named as `Store`.

## [3.0.0-beta.5] - 2019-03-26

## [3.0.0-beta.4] - 2019-03-19

### Added

- Redirect `type` support.

## [3.0.0-beta.3] - 2019-02-28

## [3.0.0-beta.2] - 2019-02-28

## [3.0.0-beta.1] - 2019-02-27

### Fixed

- Store sidebar did not have a fixed size.
- `IframeNavigationController` wasn't cleaning up when user decided to navigate.

## [3.0.0-beta.0] - 2019-02-22

### Changed

- [BREAKING] Make `admin-pages` compatible with new majors: `store-theme@2.x`, `pages-graphql@2.x`, `render@8.x`, `admin@2.x`.
- [BREAKING] Use `blocks` architecture.

### Added

- Users can reorder and delete blocks.
- Styles Editor

### Fixed

- Typescript errors ;)

### Changed

- **`EditorContainer`**
  - Move sidebar to it's own component.
  - Type IFrame on `highlightExtensionPoint`.
- **`Sidebar`**
  - Favour early returns instead of ternary operators.
  - Move component selector to it's own component.
- **`EditorProvider`**
  - Add `mode` (and `setMode`) to EditorContext.
- **`ComponentEditor`**
  - Remove `mode` from state.
  - Use `mode` from EditorContext.
- **`ModeSwitcher`**
  - Move inside of `Sidebar` folder.
  - Switching mode from `editor` instead of props.
- **Styleguide**
  - Update version to 9.x.

## [2.5.1] - 2019-01-02

### Fixed

- **`HighlightOverlay`**
  - Uncovered edge case where a component has two or more DOM elements that alternate visibility based on the user device.

## [2.5.0] - 2018-12-05

### Changed

- **Pages**

  - Rename "page list" to "pages".

- **`pages.json`**
  - Move admin links to CMS section.

## [2.4.0] - 2018-12-05

### Added

- **`render.d.ts`**
  - `Helmet` component.

### Changed

- **Redirects**
  - Rename some folders and reorganize components.

### Removed

- **Redirects**
  - Admin navbar link.

## [2.3.10] - 2018-12-05

### Fixed

- **`HighlightOverlay`**
  - Consider padding from iframe body to calculate offset.

## [2.3.9] - 2018-11-26

### Fixed

- **`ComponentEditor`**
  - `handleScopeChange` method signature updated.

### Added

- **`prettier` and `lint-staged`**
  - Standardized style.

## [2.3.8] - 2018-11-21

### Added

- **`Typings`**
  - Converted some `.js` components to `.tsx`.
  - Missing `vtex.styleguide` components exported to `vtex.styleguide.d.ts`.
  - Compatible types to work with external dependencies.
- **`SimpleFormattedMessage`**
  - Component that wraps `react-intl`'s `<FormattedMessage>` and returns only text instead of `<span>` (The lesser DOM nodes generated, the better).
- **`ArrayList`**
  - Component from `ArrayFieldTemplate` file.

### Changed

- **`ScopeSelector`**
  - Using `Dropdown` component from styleguide instead of component made for `react-jsonschema-form`.
- **`ComponentEditor`**
  - Move `Form` component to another file and implemented custom `shouldComponentUpdate` to prevent form stagger on update.
- **`DeviceSwitcher`**
  - Using `PureComponent` instead of `Component`.
  - Receives shallow props.

### Fixed

- **`ArrayFieldTemplateItem.tsx`**
  - Added `<SimpleFormattedMessage>` on label to solve i18n issues.

## [2.3.7] - 2018-11-16

### Added

- **`EditorProvider`**
  - `shouldUpdateRuntime` variable to conditionally call `updateRuntime`.

### Fixed

- **`ComponentEditor`**
  - Title size remains the same with or without save button.

## [2.3.6] - 2018-11-09

## [2.3.5] - 2018-11-07

### Added

- **`MessagesContext`**
  - Create context to pass iframe locale messages to `PageEditor`.
- **`EditorProvider`**
  - New component to wrap `EditorProvider` with `MessagesContext.Consumer`.
- **`PageEditor`**
  - static method `getCustomMessages`
  - `Message.Provider`

## [2.3.4] - 2018-11-06

### Changed

- **`pages.json`**
  - Set HighlightOverlay `ssr` as `false`.

### Fixed

- **`HighlightOverlay`**
  - Checking if `setHighlightTreePath` is defined before calling it.

## [2.3.3] - 2018-11-05

### Added

- **Typings**
  - `Window` interface with custom methods.
- **`EditorProvider`**
  - `emitLocaleEventToIframe` method to sync iframe locale.

### Fixed

- **`EditorProvider`**
  - I18n messages update logic.
  - Typing and formatting.

## [2.3.2] - 2018-11-05

### Added

- **`vtex.styleguide.d.ts`**
  - Typing for styleguide.
- **`react/package.json`**
  - Lint command.
- **`global.d.ts`**
  - Highlightable Iframe and Window.
  - ComponentSchema types.
- **`render.d.ts`**
  - RenderComponent related types.
- **`utils/components.ts`**
  - Used to be `components.js`

### Fixed

- **`lint.sh`**
  - Use lint command in react folder.
- **`EditorContainer.tsx`**
  - Type iframe.
- **`HighlightOverlay.tsx`**
  - Type window.
- **`ComponentEditor/index.tsx`**
  - Several type errors.

### Changed

- **`manifest.json`**
  - Use styleguide `7.x`.
- **`render.d.ts`**
  - Export pattern.

### Removed

- **`utils/components.js`**
  - Became `components.ts`.

## [2.3.1] - 2018-10-29

### Added

- **`editbar.global.css`**
  - Missing `calc--width` class.

## [2.3.0] - 2018-10-24

### Changed

- **`ComponentsList`**
  - Sort components by display order (top/left first).

## [2.2.9] - 2018-10-24

### Added

- **`PageForm`**
  - Loading logic.
  - I18n to buttons.

### Fixed

- **`PageForm`**
  - Error dialog on success bug.

### Removed

- **`PageForm`**
  - Unused classes from save button.
  - Some `console.log`s.

## [2.2.8] - 2018-10-24

### Fixed

- **`EditorContainer`**
  - Non-responsive behavior when admin sidebar gets expanded/collapsed.

## [2.2.7] - 2018-10-24

### Fixed

- **I18n (Spanish)**
  - Typo.

## [2.2.6] - 2018-10-24

### Fixed

- **`editbar.global.css`**
  - Tablet positioning on storefront editor.

## [2.2.5] - 2018-10-04

### Changed

- **`ImageUploader`**
  - Replace complete file URL with only its pathname.

## [2.2.4] - 2018-09-12

### Added

- **Admin**
  - I18n to tabs.

## [2.2.3] - 2018-09-11

### Added

- **Redirects Admin**
  - Periods to empty state i18n texts.

### Fixed

- **Redirects Admin**
  - Apollo cache/fetch logic.

### Removed

- **Redirects Admin**
  - Some `console.log`s.
  - Loading from remove button outside of modal.

## [2.2.2] - 2018-09-05

### Fixed

- Deep uiSchema now gets array items.

## [2.2.1] - 2018-09-04

### Changed

- **Redirects Admin**
  - Hide `Pagination` @ empty state.

### Fixed

- **Redirects Admin**
  - Pagination `to` edge case.

## [2.2.0] - 2018-09-04

### Added

- **Admins**

  - I18n to loading text.

- **Redirects Admin**
  - Pagination to redirect list.
  - Confirmation modal before deleting a redirect.
  - End date to redirect form and list.
  - Status to redirect list.
  - Sublink to redirect list to admin.

### Changed

- **Redirects Admin**
  - Split redirects components into separate routes.
  - Make `Modal` more generic and move it to `components/`.
  - Bump Styleguide to 6.x.

### Fixed

- **`ComponentEditor`**

  - Save button rendering behavior @ new configs.

- **`LabelEditor`**
  - Empty value bug.

## [2.1.3] - 2018-08-28

### Fixed

- Array of Array rendering.

## [2.1.2] - 2018-08-24

## [2.1.1] - 2018-08-24

## [2.1.0] - 2018-08-24

## [2.0.3] - 2018-08-21

## [2.0.2] - 2018-08-20

## [2.0.1] - 2018-08-17

## [2.0.0] - 2018-08-17

### Added

- Renaming repository.
- Rendering store inside iframe.

## [1.14.2] - 2018-08-10

## [1.14.1] - 2018-08-06

## [1.14.0] - 2018-08-06

## [1.14.0-beta] - 2018-08-03

### Fixed

- Rename to admin-pages.

## [1.13.1] - 2018-07-25

### Added

- Textarea widget.

### Fixed

- Use `enumNames` in a enum field when it exists, instead of only the name.
- `BaseInput` label being translated with `FormattedMessage`.

## [1.12.6] - 2018-07-25

### Added

- Site scope option when the component being edited is not defined only to the current page.

### Fixed

- Incorrect type of the max, min and value attibutes passed to the `Input`.

## [1.12.5] - 2018-07-19

### Fixed

- Remove `template` and `site` scope conditions.

## [1.12.4] - 2018-07-18

### Fixed

- Sidebar visibility bug on preview mode.

## [1.12.3] - 2018-07-18

### Fixed

- Attributes name in the svg icon.

## [1.12.2] - 2018-07-17

### Fixed

- Fix cancel bug in edit mode.

## [1.12.1] - 2018-07-17

### Changed

- Accordion behavior on the array fields.
- Animation on accordion items.

## [1.10.0] - 2018-6-28

### Changed

- Bump Styleguide's version to major 5.
- Replace custom `ModeSwitcher`'s tabs with Styleguide's `Tabs`.

## [1.9.2] - 2018-6-25

### Removed

- `border-top`, `margin-top` and `padding-top` from `ComponentEditor`'s first object field.

## [1.9.1] - 2018-6-20

### Fixed

- Fix `BaseInput` not passing min and max props to `Input` component.

## [1.9.0] - 2018-6-18

### Added

- Editor mode switcher.
- `placeholder` prop to `BaseInput`.

## [1.8.1] - 2018-6-13

### Changed

- Move remaining `object` field logic from `FieldTemplate` to `ObjectFieldTemplate`.

### Fixed

- `ComponentEditor`'s top bar height @ mobile.
- `ComponentEditor`'s Save & Cancel buttons height @ mobile.

### Removed

- Description from `object` fields.

## [1.8.0] - 2018-6-12

### Added

- Create wrappers for Styleguide components and replace some of RJSF's default widgets with them;
- Create custom `ErrorListTemplate`.

### Changed

- Restructure label logic;
- Move `ComponentEditor`'s top bar and buttons out of form;
- Make `ComponentEditor`'s close icon a button;
- Refactor `BaseInput`;
- Move error messages and handling to widgets.

### Fixed

- Fix `ComponentEditor`'s internal z-index;
- Fix `FieldTemplate`'s description logic;
- Fix `BaseInput`'s `onChange` edge case bug.

## [1.7.1] - 2018-6-11

### Fixed

- Fix bug of z-index in the EditableExtensionPoint when the treePath has many resources.

## [1.7.0] - 2018-6-6

### Added

- Dynamic parameter in the translated string via object values.

### Changed

- Translate `ui:placeholder`, `ui:help`, `ui:description`, and `ui:title` inside the `widget` property of the schema
- Translate `title`, `description` and `enumNames` properties in component schema.

## [1.6.0] - 2018-05-24

### Added

- Support for deep schema objects

### Changed

- Hide the input label when it's a checkbox.

## [1.5.1] - 2018-05-03

### Fixed

- Avoid setting everything as undefined
- Fix implementation of singleton `ComponentEditor` instance that affected the test environment

## [1.5.0] - 2018-05-03

- Added to the `ComponentEditor` support for `UiSchema` to be defined with the `Component Schema`

## [1.4.0] - 2018-04-24

### Added

- Added to the `ComponentEditor` support for dynamic component schemas.

### Fixed

- Fixed the `ComponentEditor` to save extension
