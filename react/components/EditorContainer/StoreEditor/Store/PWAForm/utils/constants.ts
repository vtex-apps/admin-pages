interface DropdownOption {
  value: string
  label: string
}

export const ORIENTATION_OPTIONS: DropdownOption[] = [
  {
    value: 'any',
    label: 'admin/pages.editor.store.settings.pwa.orientation.any',
  },
  {
    label: 'admin/pages.editor.store.settings.pwa.orientation.natural',
    value: 'natural',
  },
  {
    label: 'admin/pages.editor.store.settings.pwa.orientation.landscape',
    value: 'landscape',
  },
  {
    label:
      'admin/pages.editor.store.settings.pwa.orientation.landscape-primary',
    value: 'landscape-primary',
  },
  {
    label:
      'admin/pages.editor.store.settings.pwa.orientation.landscape-secondary',
    value: 'landscape-secondary',
  },
  {
    label: 'admin/pages.editor.store.settings.pwa.orientation.portrait',
    value: 'portrait',
  },
  {
    label: 'admin/pages.editor.store.settings.pwa.orientation.portrait-primary',
    value: 'portrait-primary',
  },
  {
    label:
      'admin/pages.editor.store.settings.pwa.orientation.portrait-secondary',
    value: 'portrait-secondary',
  },
]

export const DISPLAY_OPTIONS: DropdownOption[] = [
  {
    label: 'admin/pages.editor.store.settings.pwa.display.fullscreen',
    value: 'fullscreen',
  },
  {
    label: 'admin/pages.editor.store.settings.pwa.display.standalone',
    value: 'standalone',
  },
  {
    label: 'admin/pages.editor.store.settings.pwa.display.minimal-ui',
    value: 'minimal-ui',
  },
  {
    label: 'admin/pages.editor.store.settings.pwa.display.browser',
    value: 'browser',
  },
]


export const INSTALL_PROMPT_OPTIONS: DropdownOption[] = [
  {
    label: 'admin/pages.editor.store.settings.pwa.prompt-custom-event.default',
    value: 'default',
  },
  {
    label: 'admin/pages.editor.store.settings.pwa.prompt-custom-event.addToCart',
    value: 'addToCart',
  },
]

export const TOAST_DURATION = 4000
