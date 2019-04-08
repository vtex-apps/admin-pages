interface DropdownOption {
  value: string
  label: string
}

export const ORIENTATION_OPTIONS: DropdownOption[] = [
  { value: 'any', label: 'pages.editor.store.settings.pwa.orientation.any' },
  {
    label: 'pages.editor.store.settings.pwa.orientation.natural',
    value: 'natural',
  },
  {
    label: 'pages.editor.store.settings.pwa.orientation.landscape',
    value: 'landscape',
  },
  {
    label: 'pages.editor.store.settings.pwa.orientation.landscape-primary',
    value: 'landscape-primary',
  },
  {
    label: 'pages.editor.store.settings.pwa.orientation.landscape-secondary',
    value: 'landscape-secondary',
  },
  {
    label: 'pages.editor.store.settings.pwa.orientation.portrait',
    value: 'portrait',
  },
  {
    label: 'pages.editor.store.settings.pwa.orientation.portrait-primary',
    value: 'portrait-primary',
  },
  {
    label: 'pages.editor.store.settings.pwa.orientation.portrait-secondary',
    value: 'portrait-secondary',
  },
]

export const DISPLAY_OPTIONS: DropdownOption[] = [
  {
    label: 'pages.editor.store.settings.pwa.display.fullscreen',
    value: 'fullscreen',
  },
  {
    label: 'pages.editor.store.settings.pwa.display.standalone',
    value: 'standalone',
  },
  {
    label: 'pages.editor.store.settings.pwa.display.minimal-ui',
    value: 'minimal-ui',
  },
  {
    label: 'pages.editor.store.settings.pwa.display.browser',
    value: 'browser',
  },
]

export const TOAST_DURATION = 4000
