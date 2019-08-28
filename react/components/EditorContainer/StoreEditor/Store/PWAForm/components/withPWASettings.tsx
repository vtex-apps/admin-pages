import { pathOr } from 'ramda'
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
  disablePrompt: boolean,
  promptOnCustomEvent: string
}

export interface Manifest {
  icons?: PWAImage[]
  background_color: string
  theme_color: string
  orientation?: string
  start_url?: string
  display?: string
}

interface PWAData {
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

export type PWASettingsProps = PWAData & Pick<QueryResult<PWAData>, 'refetch'>

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
  WrappedComponent: React.ComponentType<T & PWASettingsProps>
) {
  const ComponentWithPWASettings = (props: T) => (
    <PWAQuery query={PWA}>
      {handleCornerCases<PWAData, {}>(options, ({ data, refetch }) => {
        if (
          !data.manifest ||
          !data.manifest.background_color ||
          !data.manifest.theme_color
        ) {
          const color: string = pathOr(
            '',
            ['selectedStyle', 'config', 'semanticColors', 'background', 'base'],
            data
          )

          return (
            <WrappedComponent
              {...props}
              {...data}
              manifest={{
                ...(data.manifest || {}),
                ['background_color']: color,
                ['theme_color']: color,
              }}
              refetch={refetch}
            />
          )
        }
        return <WrappedComponent {...props} {...data} refetch={refetch} />
      })}
    </PWAQuery>
  )

  return ComponentWithPWASettings
}

export default withPWASettings
