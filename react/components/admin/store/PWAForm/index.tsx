import { useKeydownFromClick } from 'keydown-from-click'
import { equals, last, path, pick } from 'ramda'
import React, { useContext, useState } from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'
import {
  Button,
  ColorPicker,
  Dropdown,
  IconCaretDown,
  IconCaretUp,
  Input,
  ToastContext,
  Toggle,
  Spinner,
} from 'vtex.styleguide'

import ImageUploader from '../../../form/ImageUploader'
import withPWAMutations, {
  ManifestMutationData,
  PWAMutationProps,
} from './components/withPWAMutations'
import withPWASettings, {
  Manifest,
  PWAImage,
  PWASettingsProps,
} from './components/withPWASettings'
import { messages } from './messages'
import {
  DISPLAY_OPTIONS,
  ORIENTATION_OPTIONS,
  TOAST_DURATION,
  INSTALL_PROMPT_OPTIONS,
} from './utils/constants'

const fillManifest = (manifest: Manifest): Manifest => ({
  ...manifest,
  display: manifest.display || 'standalone',
  orientation: manifest.orientation || 'portrait',
  ['start_url']: manifest.start_url || '/',
})

const isManifestValid = (manifest: Manifest): boolean =>
  Boolean(
    manifest.start_url &&
      manifest.background_color &&
      manifest.display &&
      manifest.orientation &&
      manifest.theme_color
  )

type Props = InjectedIntlProps & PWAMutationProps & PWASettingsProps

const PWAForm: React.FunctionComponent<Props> = ({
  manifest: pwaManifest,
  splashes,
  iOSIcons,
  pwaSettings,
  updateManifest,
  updateManifestIcon,
  updatePWASettings,
  intl,
  refetch,
}) => {
  const [manifest, setManifest] = useState(fillManifest(pwaManifest))
  const [settings, setSettings] = useState(pwaSettings)
  const [colorHistory, setColorHistory] = useState([
    pwaManifest.theme_color,
    pwaManifest.background_color,
  ])
  const [submitting, setSubmitting] = useState(false)
  const [showSpecific, setShowSpecific] = useState(false)
  const [splashLoading, setSplashLoading] = useState(true)

  const toggleSpecific = React.useCallback(
    () => setShowSpecific(!showSpecific),
    [showSpecific]
  )

  const toggleSpecificByKeyDown = useKeydownFromClick(toggleSpecific)

  const { showToast } = useContext(ToastContext)

  const [splash = null] = splashes || []
  const androidIcon = manifest.icons && last(manifest.icons)
  const iOSIcon = last(iOSIcons)

  async function uploadIcon({
    icon,
    iOS = false,
  }: {
    icon: File
    iOS?: boolean
  }): Promise<void> {
    setSubmitting(true)
    try {
      const result = await updateManifestIcon.mutate({
        variables: { icon, iOS },
      })
      // If the iOS icon changed, show the new iOS splash screen
      if (iOS) {
        await refetch()
      } else {
        const icons: PWAImage[] | undefined = path(
          ['data', 'updateManifestIcon', 'icons'],
          result || {}
        )
        setManifest({ ...manifest, icons })
      }
      showToast({
        duration: TOAST_DURATION,
        message: intl.formatMessage(messages.updateManifestIconSuccess),
      })
    } catch (err) {
      console.error('Error updating manifest icon: ', err)
      showToast({
        duration: Infinity,
        message: intl.formatMessage(messages.updateManifestIconError),
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function saveSettings(): Promise<void> {
    await updatePWASettings.mutate({ variables: { settings } })
  }

  async function saveManifest(): Promise<ManifestMutationData | undefined> {
    const manifestData = pick(
      [
        'start_url',
        'theme_color',
        'background_color',
        'display',
        'orientation',
      ],
      manifest
    ) as ManifestMutationData
    const result = await updateManifest.mutate({
      variables: { manifest: manifestData },
    })
    return path(['data', 'updateManifest'], result || {})
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const mutations: Promise<ManifestMutationData | void>[] = [saveManifest()]
      if (!equals(settings, pwaSettings)) {
        mutations.push(saveSettings())
      }
      const [newManifest] = await Promise.all(mutations)
      // If background color changed, show the new iOS splash screen
      if (
        newManifest &&
        pwaManifest.background_color !== newManifest.background_color
      ) {
        await refetch()
      }
      showToast({
        duration: TOAST_DURATION,
        message: intl.formatMessage({
          id: 'admin/pages.admin.pages.form.save.success',
        }),
      })
    } catch (err) {
      console.error(err)
      showToast({
        duration: Infinity,
        message: intl.formatMessage({
          id: 'admin/pages.admin.pages.form.save.error',
        }),
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-column justify-center">
      <div className="flex flex-row items-center">
        <div className="t-heading-7 w-40">
          <FormattedMessage id="admin/pages.editor.store.settings.pwa.theme_color" />
        </div>
        <div className="w-100">
          <ColorPicker
            disabled={submitting}
            color={{ hex: manifest.theme_color }}
            colorHistory={colorHistory}
            onChange={(color: { hex: string }) => {
              setManifest({ ...manifest, ['theme_color']: color.hex })
              setColorHistory([...colorHistory, color.hex])
            }}
          />
        </div>
      </div>
      <div className="pt2">
        <div className="flex flex-row items-center">
          <div className="t-heading-7 w-40">
            <FormattedMessage id="admin/pages.editor.store.settings.pwa.background_color" />
          </div>
          <div className="w-100">
            <ColorPicker
              disabled={submitting}
              color={{ hex: manifest.background_color }}
              colorHistory={colorHistory}
              onChange={(color: { hex: string }) => {
                setManifest({ ...manifest, ['background_color']: color.hex })
                setColorHistory([...colorHistory, color.hex])
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-column items-center justify-center">
        <div className="w-100 pt4">
          <ImageUploader
            disabled={submitting}
            value={
              androidIcon
                ? new URL(`https://${location.hostname}/${androidIcon.src}`)
                    .href
                : ''
            }
            schema={{
              title: 'admin/pages.editor.store.settings.pwa.android-logo-icon',
            }}
            onFileDrop={(icon: File) => uploadIcon({ icon })}
          />
        </div>
        <div className="w-100 pt4">
          <ImageUploader
            disabled={submitting}
            value={
              iOSIcon
                ? new URL(`https://${location.hostname}/${iOSIcon.src}`).href
                : ''
            }
            schema={{
              title: 'admin/pages.editor.store.settings.pwa.ios-logo-icon',
            }}
            onFileDrop={(icon: File) => uploadIcon({ icon, iOS: true })}
          />
        </div>
      </div>
      {splash && (
        <div className="pt6">
          <div className="t-heading-7 mb4">
            <FormattedMessage id="admin/pages.editor.store.settings.pwa.splash-screen" />
          </div>
          <div className="w-100 flex justify-center items-center">
            {splashLoading && <Spinner/>}
            <img
              alt={intl.formatMessage({
                id: 'admin/pages.editor.store.settings.pwa.splash-screen',
              })}
              className="h5 shadow-1 mb3"
              src={`${splash.src}?v=${Date.now()}`}
              onLoad={() => { setSplashLoading(false) }}
              style={{display: splashLoading ? 'none': 'block'}}
            />
          </div>
        </div>
      )}
      <div className="pv7">
        <div className="w-100 bb b--muted-4" />
      </div>
      <div
        aria-checked={showSpecific}
        className="pb3 link pointer c-muted-1 outline-0"
        onClick={toggleSpecific}
        onKeyDown={toggleSpecificByKeyDown}
        role="switch"
        tabIndex={0}
      >
        <span className="pr4">
          <FormattedMessage id="admin/pages.editor.store.settings.pwa.app-settings" />
        </span>
        {showSpecific ? <IconCaretUp /> : <IconCaretDown />}
      </div>
      {showSpecific && (
        <>
          <div className="pt4 w-100">
            <Input
              disabled={submitting}
              size="small"
              label={intl.formatMessage(messages.startUrl)}
              value={manifest.start_url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setManifest({ ...manifest, ['start_url']: e.target.value })
              }
            />
          </div>
          <div className="pt4 w-100">
            <Dropdown
              disabled={submitting}
              value={manifest.orientation}
              label={intl.formatMessage(messages.screenOrientation)}
              options={ORIENTATION_OPTIONS.map(option => ({
                ...option,
                label: intl.formatMessage({ id: option.label }),
              }))}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setManifest({
                  ...manifest,
                  orientation: e.target.value,
                })
              }
            />
          </div>
          <div className="pt4">
            <Dropdown
              disabled={submitting}
              value={manifest.display}
              label={intl.formatMessage(messages.pwaDisplay)}
              options={DISPLAY_OPTIONS.map(option => ({
                ...option,
                label: intl.formatMessage({ id: option.label }),
              }))}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setManifest({
                  ...manifest,
                  display: e.target.value,
                })
              }
            />
          </div>
          <div className="pt6">
            <Toggle
              label={intl.formatMessage(messages.disablePrompt)}
              checked={!settings.disablePrompt}
              disabled={submitting}
              onChange={() =>
                setSettings({
                  ...settings,
                  disablePrompt: !settings.disablePrompt,
                })
              }
            />
          </div>
          {!settings.disablePrompt && (
            <div className="pt4">
              <Dropdown
                disabled={submitting}
                value={settings.promptOnCustomEvent}
                label={intl.formatMessage(messages.pwaPrompt)}
                options={INSTALL_PROMPT_OPTIONS.map(option => ({
                  ...option,
                  label: intl.formatMessage({ id: option.label }),
                }))}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSettings({
                    ...settings,
                    promptOnCustomEvent: e.target.value,
                  })
                }
              />
            </div>
          )}
        </>
      )}
      <div className="w-100 mt7 tr">
        <Button
          size="small"
          type="submit"
          variation="primary"
          onClick={handleSubmit}
          disabled={!isManifestValid(manifest)}
          isLoading={submitting}
        >
          <FormattedMessage id="admin/pages.admin.pages.form.button.save" />
        </Button>
      </div>
    </div>
  )
}

export default injectIntl(
  withPWASettings<InjectedIntlProps>(
    withPWAMutations<InjectedIntlProps & PWASettingsProps>(PWAForm)
  )
)
