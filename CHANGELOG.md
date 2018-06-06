# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
