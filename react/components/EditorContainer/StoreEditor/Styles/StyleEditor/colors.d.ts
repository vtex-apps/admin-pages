interface ColorInfo {
  path: string
  color: string
  configField: string
}

type Colors = Record<string, ColorInfo[]>
