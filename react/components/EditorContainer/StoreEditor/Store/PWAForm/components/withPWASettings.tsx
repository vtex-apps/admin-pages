import { path } from 'ramda'
import React from 'react'
import { Query } from 'react-apollo'

import { handleCornerCases } from '../../utils/utils'
import Manifest from '../queries/Manifest.graphql'
import Styles from '../queries/Styles.graphql'

export interface PWAImage {
  src: string
  type: string
  sizes: string
}

export interface Manifest {
  start_url?: string
  theme_color: string
  background_color: string
  display?: string
  orientation?: string
  icons?: PWAImage[]
}

export interface ManifestData {
  manifest: Manifest
  iOSIcons: PWAImage[]
  splashes: PWAImage[]
}

class ManifestQuery extends Query<ManifestData, {}> {}

interface StylesData {
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
// tslint:disable-next-line:max-classes-per-file
class StylesQuery extends Query<StylesData, {}> {}

const options = {
  error: {
    description: 'pages.editor.store.settings.error.title',
    title: 'pages.editor.store.settings.pwa.error',
  },
}

const withPWASettings = (
  WrappedComponent: React.ComponentType<ManifestData & any>
) => (props: any) => (
  <ManifestQuery query={Manifest}>
    {handleCornerCases(options, ({ data: PWAData, ...restPWAQuery }) => {
      if (!PWAData.manifest) {
        return (
          <StylesQuery query={Styles}>
            {handleCornerCases(options, ({ data: stylesData }) => {
              const color = path(
                [
                  'selectedStyle',
                  'config',
                  'semanticColors',
                  'background',
                  'base',
                ],
                stylesData
              )
              return (
                <WrappedComponent
                  {...props}
                  {...PWAData}
                  {...restPWAQuery}
                  manifest={{
                    background_color: color,
                    theme_color: color,
                  }}
                />
              )
            })}
          </StylesQuery>
        )
      }
      return <WrappedComponent {...props} {...PWAData} {...restPWAQuery} />
    })}
  </ManifestQuery>
)

export default withPWASettings
