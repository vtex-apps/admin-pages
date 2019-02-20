interface ColorInfo {
  path: string
  color: string
  configField: string
}

interface Colors {
  [token: string]: Array<ColorInfo>
}
