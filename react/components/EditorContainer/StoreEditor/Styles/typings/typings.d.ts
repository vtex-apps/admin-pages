interface BasicStyle {
  id: string
  app: string
  name: string
}

interface Style extends BasicStyle {
  editable: boolean
  selected: boolean
  path: string
  config: TachyonsConfig
}

interface ActionMenuOption {
  label: string
  onClick: (style: Style) => void
}

interface StyleAssetInfo {
  type: 'path' | 'stylesheet'
  keepSheet?: boolean
  value: string
}
