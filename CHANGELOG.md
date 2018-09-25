# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
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
