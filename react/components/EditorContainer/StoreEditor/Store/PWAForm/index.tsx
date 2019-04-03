import React, { useState } from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'

import { ColorPicker, Input } from 'vtex.styleguide'

import withPWASettings, {
  Manifest,
  ManifestData,
} from './components/withPWASettings'

function fillManifest(manifest: Manifest): Manifest {
  return {
    ...manifest,
    start_url: manifest.start_url || '/',
  }
}

const PWAForm: React.FunctionComponent<ManifestData & InjectedIntlProps> = ({
  manifest: pwaManifest,
  intl,
}) => {
  const [manifest, setManifest] = useState(fillManifest(pwaManifest))
  const [colorHistory, setColorHistory] = useState([
    pwaManifest.theme_color,
    pwaManifest.background_color,
  ])
  return (
    <div className="flex flex-column justify-center">
      <span className="t-heading-5 db">PWA</span>
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
      <div className="pt2">
        <div className="flex flex-row items-center">
          <div className="w-100">
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
        </div>
      </div>
    </div>
  )
}

export default injectIntl(withPWASettings(PWAForm))
