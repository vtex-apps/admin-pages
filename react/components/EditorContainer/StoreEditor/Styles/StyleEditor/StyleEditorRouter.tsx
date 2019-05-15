import React from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router'

import ColorsEditor from './ColorsEditor'
import EditorSelector from './EditorSelector'
import FontFamilyList from './typography/FontFamilyList'
import TypographyEditor from './typography/TypographyEditor'

import { GenerateStyleSheetData } from './queries/GenerateStyleSheet'
import CustomFont from './typography/FontEditor'
import TypeToken from './typography/TypeToken'
import TypeTokensList from './typography/TypeTokensList'

export const IdParam = ':id'

export enum EditorPath {
  selector = '/',
  colors = '/colors/:id',
  typography = '/typography',
  fontFamily = '/font-family',
  typeToken = '/type-token/:id',
  typeTokens = '/type-tokens',
  customFont = '/custom-font/:id',
  customFontFile = '/custom-font/file/:id',
  customFontLink = '/custom-font/link/:id',
}

interface Props {
  data: GenerateStyleSheetData | null
  hooks: {
    config: [TachyonsConfig, React.Dispatch<DeepPartial<TachyonsConfig>>]
    editing: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    name: [string, React.Dispatch<React.SetStateAction<string>>]
  }
  onSave: () => void
  setStyleAsset: (asset: StyleAssetInfo) => void
  stopEditing: () => void
  style: Style
}

const StyleEditorRouter: React.FunctionComponent<Props> = ({
  data,
  hooks: {
    config: [config, updateConfig],
    name: [name],
  },
  onSave,
  setStyleAsset,
  stopEditing,
  style,
}) => {
  const stylesheet = data && data.generateStyleSheet
  if (stylesheet) {
    setStyleAsset({ type: 'stylesheet', value: stylesheet })
  }

  const renderEditorSelector = (_: RouteComponentProps) => (
    <EditorSelector {...{ config, name, onSave, stopEditing }} />
  )

  const colorsPaths = [
    EditorPath.colors,
    EditorPath.colors.replace(IdParam, ''),
  ]
  const renderColorsEditor = (props: RouteComponentProps<ColorRouteParams>) => (
    <ColorsEditor
      {...{ ...props, updateStyle: updateConfig, config, onSave }}
    />
  )

  const customFontPaths = [
    EditorPath.customFont,
    EditorPath.customFont.replace(IdParam, ''),
  ]

  const renderTypeTokensList = (props: RouteComponentProps) => (
    <TypeTokensList {...props} style={style} />
  )

  const renderTypeToken = (props: RouteComponentProps<TypeTokenParams>) => (
    <TypeToken
      {...props}
      config={config}
      updateConfig={updateConfig}
      onSave={onSave}
    />
  )

  return (
    <div className="h-100 flex flex-column flex-grow-1 overflow-y-auto overflow-x-hidden">
      <Switch>
        <Route exact path={EditorPath.selector} render={renderEditorSelector} />
        <Route exact path={colorsPaths} render={renderColorsEditor} />
        <Route
          exact
          path={EditorPath.typography}
          component={TypographyEditor}
        />
        <Route exact path={EditorPath.fontFamily} component={FontFamilyList} />

        <Route path={customFontPaths} component={CustomFont} />
        <Route
          exact
          path={EditorPath.typeTokens}
          render={renderTypeTokensList}
        />
        <Route exact path={EditorPath.typeToken} render={renderTypeToken} />
      </Switch>
    </div>
  )
}

export default StyleEditorRouter
