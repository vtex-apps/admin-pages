import { path } from 'ramda'
import React from 'react'
import { Query, QueryResult } from 'react-apollo'

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

export interface Manifest {
  icons?: PWAImage[]
  background_color: string
  theme_color: string
  orientation?: string
  start_url?: string
  display?: string
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

function withPWASettings<T>(
  WrappedComponent: React.ComponentType<
    T & PWAData & Omit<QueryResult<PWAData, {}>, 'data' | 'loading'>
  >
) {
  return (props: T) => (
    <PWAQuery query={PWA}>
      {handleCornerCases<PWAData, {}>(options, ({ data, ...restPWAQuery }) => {
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
                background_color: color as string,
                theme_color: color as string,
              }}
            />
          )
        }
        return <WrappedComponent {...props} {...data} {...restPWAQuery} />
      })}
    </PWAQuery>
  )
}

export default withPWASettings
