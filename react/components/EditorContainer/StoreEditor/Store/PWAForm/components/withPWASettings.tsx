import { path } from 'ramda'
import React from 'react'
import { Query } from 'react-apollo'

import { handleCornerCases } from '../../utils/utils'
import PWA from '../queries/PWA.graphql'
import { ManifestMutationData } from './withPWAMutations'

export interface PWAImage {
  src: string
  type: string
  sizes: string
}

export interface PWASettings {
  disablePrompt: boolean
}

export interface Manifest extends ManifestMutationData {
  icons?: PWAImage[]
}

export interface PWAData {
  manifest: Manifest
  iOSIcons: PWAImage[]
  splashes: PWAImage[]
  pwaSettings: PWASettings
  selectedStyle: {
    config: {
      semanticColors: {
        background: {
          base: string
        }
      }
    }
  }
}

class PWAQuery extends Query<PWAData, {}> {}

const options = {
  error: {
    description: 'pages.editor.store.settings.error.title',
    title: 'pages.editor.store.settings.pwa.error',
  },
}

const withPWASettings = (WrappedComponent: React.ComponentType<PWAData & any>) => (
  props: any
) => (
  <PWAQuery query={PWA}>
    {handleCornerCases(options, ({ data, ...restPWAQuery }) => {
      if (!data.manifest) {
        const color = path(
          ['selectedStyle', 'config', 'semanticColors', 'background', 'base'],
          data
        )
        return (
          <WrappedComponent
            {...props}
            {...data}
            {...restPWAQuery}
            manifest={{
              background_color: color,
              theme_color: color,
            }}
          />
        )
      }
      return <WrappedComponent {...props} {...data} {...restPWAQuery} />
    })}
  </PWAQuery>
)

export default withPWASettings
