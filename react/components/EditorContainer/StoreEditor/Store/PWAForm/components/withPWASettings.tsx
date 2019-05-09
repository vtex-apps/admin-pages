import { path } from 'ramda'
import React from 'react'
import { Query, QueryResult } from 'react-apollo'
import { defineMessages } from 'react-intl'

import { handleCornerCases } from '../../utils/utils'
import PWA from '../queries/PWA.graphql'

export interface PWAImage {
  src: string
  type: string
  sizes: string
}

export interface PWASettings {
  disablePrompt: boolean
  promptOnCustomEvent: boolean
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

defineMessages({
  description: {
    defaultMessage: `Couldn't load store settings.`,
    id: 'admin/pages.editor.store.settings.error',
  },
  title: {
    defaultMessage: `Couldn't load PWA settings.`,
    id: 'admin/pages.editor.store.settings.pwa.error',
  },
})

const options = {
  error: {
    description: 'admin/pages.editor.store.settings.error.title',
    title: 'admin/pages.editor.store.settings.pwa.error',
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
