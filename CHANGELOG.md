# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
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

## [2.3.8] - 2018-11-21
### Added
- **`Typings`**
  - Converted some `.js` components to `.tsx`.
  - Missing `vtex.styleguide` components exported to `vtex.styleguide.d.ts`.
  - Compatible types to work with external dependencies.
- **`SimpleFormattedMessage`**
  - Component that wraps `react-intl`'s `<FormattedMessage>` and  returns only text instead of `<span>` (The lesser DOM nodes generated, the better).
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
