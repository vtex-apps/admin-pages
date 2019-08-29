import { defineMessages } from 'react-intl'

export const messages = defineMessages({
  androidLogoIcon: {
    defaultMessage: 'Android Logo Icon (512x512)',
    id: 'admin/pages.editor.store.settings.pwa.android-logo-icon',
  },
  disablePrompt: {
    defaultMessage: 'Add to Home Screen',
    id: 'admin/pages.editor.store.settings.pwa.disable-prompt',
  },
  iosLogoIcon: {
    defaultMessage: 'iOS Logo Icon (512x512)',
    id: 'admin/pages.editor.store.settings.pwa.ios-logo-icon',
  },
  // ORIENTATION_OPTIONS messages
  orientationAny: {
    defaultMessage: 'Any',
    id: 'admin/pages.editor.store.settings.pwa.orientation.any',
  },
  orientationLandscape: {
    defaultMessage: 'Landscape',
    id: 'admin/pages.editor.store.settings.pwa.orientation.landscape',
  },
  orientationLandscapePrimary: {
    defaultMessage: 'Landscape (Primary)',
    id: 'admin/pages.editor.store.settings.pwa.orientation.landscape-primary',
  },
  orientationLandscapeSecondary: {
    defaultMessage: 'Landscape (Secondary)',
    id: 'admin/pages.editor.store.settings.pwa.orientation.landscape-secondary',
  },
  orientationNatural: {
    defaultMessage: 'Natural',
    id: 'admin/pages.editor.store.settings.pwa.orientation.natural',
  },
  orientationPortrait: {
    defaultMessage: 'Portrait',
    id: 'admin/pages.editor.store.settings.pwa.orientation.portrait',
  },
  orientationPortraitPrimary: {
    defaultMessage: 'Portrait (Primary)',
    id: 'admin/pages.editor.store.settings.pwa.orientation.portrait-primary',
  },
  orientationPortraitSecondary: {
    defaultMessage: 'Portrait (Secondary)',
    id: 'admin/pages.editor.store.settings.pwa.orientation.portrait-secondary',
  },

  // DISPLAY_OPTIONS messages
  pwaDisplay: {
    defaultMessage: 'Display',
    id: 'admin/pages.editor.store.settings.pwa.display',
  },
  pwaDisplayBrowser: {
    defaultMessage: 'Browser',
    id: 'admin/pages.editor.store.settings.pwa.display.browser',
  },
  pwaDisplayFullscreen: {
    defaultMessage: 'Fullscreen',
    id: 'admin/pages.editor.store.settings.pwa.display.fullscreen',
  },
  pwaDisplayMinimalUi: {
    defaultMessage: 'Minimal-UI (Not supported by Chrome)',
    id: 'admin/pages.editor.store.settings.pwa.display.minimal-ui',
  },
  pwaDisplayStandalone: {
    defaultMessage: 'Standalone (Add to Home Screen)',
    id: 'admin/pages.editor.store.settings.pwa.display.standalone',
  },

  screenOrientation: {
    defaultMessage: 'Screen Orientation',
    id: 'admin/pages.editor.store.settings.pwa.screen-orientation',
  },
  startUrl: {
    defaultMessage: 'Start URL',
    id: 'admin/pages.editor.store.settings.pwa.start_url',
  },
  updateManifestIconError: {
    defaultMessage: 'Something wrong occurred while updating the App icon…',
    id: 'admin/pages.editor.store.settings.pwa.update-manifest-icon.error',
  },
  updateManifestIconSuccess: {
    defaultMessage: 'App icon successfuly updated!',
    id: 'admin/pages.editor.store.settings.pwa.update-manifest-icon.success',
  },

  // Install prompt
  pwaPrompt: {
    defaultMessage: 'Prompt "Add to Home Screen"',
    id: 'admin/pages.editor.store.settings.pwa.prompt-custom-event'
  }
})
