import { last, path, pick } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import { MutationFn, QueryResult } from 'react-apollo'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'

import {
  Button,
  ColorPicker,
  Dropdown,
  Input,
  ToastContext,
} from 'vtex.styleguide'

import ImageUploader from '../../../../form/ImageUploader'
import withPWAMutations, {
  ManifestMutationData,
  MutationProps,
} from './components/withPWAMutations'
import withPWASettings, {
  Manifest,
  ManifestData,
  PWAImage,
} from './components/withPWASettings'
import {
  DISPLAY_OPTIONS,
  ORIENTATION_OPTIONS,
  TOAST_DURATION,
} from './utils/constants'

const fillManifest = (manifest: Manifest): Manifest => ({
  ...manifest,
  display: manifest.display || 'standalone',
  orientation: manifest.orientation || 'portrait',
  start_url: manifest.start_url || '/',
})

const isManifestValid = (manifest: Manifest): boolean =>
  Boolean(
    manifest.start_url &&
      manifest.background_color &&
      manifest.display &&
      manifest.orientation &&
      manifest.theme_color
  )

type Props = ManifestData & InjectedIntlProps & MutationProps & QueryResult

const PWAForm: React.FunctionComponent<Props> = ({
  manifest: pwaManifest,
  splashes,
  iOSIcons,
  updateManifest,
  updateManifestIcon,
  intl,
  refetch,
}) => {
  const [manifest, setManifest] = useState(fillManifest(pwaManifest))
  const [colorHistory, setColorHistory] = useState([
    pwaManifest.theme_color,
    pwaManifest.background_color,
  ])
  const [submitting, setSubmitting] = useState(false)
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
        message: intl.formatMessage({
          id: 'pages.editor.store.settings.pwa.update-manifest-icon.success',
        }),
      })
    } catch (err) {
      console.error('Error updating manifest icon: ', err)
      showToast({
        duration: Infinity,
        message: intl.formatMessage({
          id: 'pages.editor.store.settings.pwa.update-manifest-icon.error',
        }),
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function saveManifest() {
    setSubmitting(true)
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

    try {
      const result = await updateManifest.mutate({
        variables: { manifest: manifestData },
      })
      const backgroundColor: string | undefined = path(
        ['data', 'updateManifest', 'background_color'],
        result || {}
      )
      // If background color changed, show the new iOS splash screen
      if (pwaManifest.background_color !== backgroundColor) {
        await refetch()
      }
      showToast({
        duration: TOAST_DURATION,
        message: intl.formatMessage({
          id: 'pages.editor.store.settings.pwa.update-manifest.success',
        }),
      })
    } catch (_) {
      showToast({
        duration: Infinity,
        message: intl.formatMessage({
          id: 'pages.editor.store.settings.pwa.update-manifest.error',
        }),
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-column justify-center">
      <span className="t-heading-5 db">
        <FormattedMessage id="pages.editor.store.settings.pwa.title" />
      </span>
      <div className="pt2">
        <div className="flex flex-row items-center">
          <span className="t-heading-7 db w-40">
            <FormattedMessage id="pages.editor.store.settings.pwa.theme_color" />
          </span>
          <div className="w-100">
            <ColorPicker
              color={{ hex: manifest.theme_color }}
              colorHistory={colorHistory}
              onChange={(color: { hex: string }) => {
                setManifest({ ...manifest, theme_color: color.hex })
                setColorHistory([...colorHistory, color.hex])
              }}
            />
          </div>
        </div>
      </div>
      <div className="pt2">
        <div className="flex flex-row items-center">
          <span className="t-heading-7 db w-40">
            <FormattedMessage id="pages.editor.store.settings.pwa.background_color" />
          </span>
          <div className="w-100">
            <ColorPicker
              color={{ hex: manifest.background_color }}
              colorHistory={colorHistory}
              onChange={(color: { hex: string }) => {
                setManifest({ ...manifest, background_color: color.hex })
                setColorHistory([...colorHistory, color.hex])
              }}
            />
          </div>
        </div>
      </div>
      <div className="pt2 w-100">
        <Input
          size="small"
          label={intl.formatMessage({
            id: 'pages.editor.store.settings.pwa.start_url',
          })}
          value={manifest.start_url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setManifest({ ...manifest, start_url: e.target.value })
          }
        />
      </div>
      <div className="pt4 w-100">
        <Dropdown
          value={manifest.orientation}
          label={intl.formatMessage({
            id: 'pages.editor.store.settings.pwa.screen-orientation',
          })}
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
          value={manifest.display}
          label={intl.formatMessage({
            id: 'pages.editor.store.settings.pwa.display',
          })}
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
      <div className="flex flex-column items-center justify-center pt5">
        <div className="w-100 pt4">
          <ImageUploader
            value={
              androidIcon
                ? new URL(`https://${location.hostname}/${androidIcon.src}`)
                    .href
                : ''
            }
            schema={{
              title: 'pages.editor.store.settings.pwa.android-logo-icon',
            }}
            shouldMutate={false}
            onChange={(_: any, icon: File) => uploadIcon({ icon })}
          />
        </div>
        <div className="w-100 pt4">
          <ImageUploader
            value={
              iOSIcon
                ? new URL(`https://${location.hostname}/${iOSIcon.src}`).href
                : ''
            }
            schema={{ title: 'pages.editor.store.settings.pwa.ios-logo-icon' }}
            shouldMutate={false}
            onChange={(_: any, icon: File) => uploadIcon({ icon, iOS: true })}
          />
        </div>
      </div>
      {splash && (
        <div className="pt6">
          <div className="t-heading-7 mb4">
            <FormattedMessage id="pages.editor.store.settings.pwa.splash-screen" />
          </div>
          <div className="w-100 flex justify-center items-center">
            <img
              className="h5 shadow-1 mb3"
              src={`../../${splash.src}?v=${Date.now()}`}
            />
          </div>
        </div>
      )}
      <div className="w-100 mt7 tr">
        <Button
          size="small"
          type="submit"
          variation="primary"
          onClick={saveManifest}
          disabled={!isManifestValid(manifest)}
          isLoading={submitting}
        >
          <FormattedMessage id="pages.admin.pages.form.button.save" />
        </Button>
      </div>
    </div>
  )
}

export default injectIntl(withPWASettings(withPWAMutations(PWAForm)))
