interface ButtonInfo {
  action?: () => void
  text: string
}

interface RouteInfo {
  backButton: ButtonInfo
  auxButton?: ButtonInfo
  title: string
}

interface NavigationUpdate {
  type: 'push' | 'pop' | 'update'
  route: EditorRoute
}

interface ColorRouteParams {
  id: string
}

interface CustomFontParams {
  id: string
}
