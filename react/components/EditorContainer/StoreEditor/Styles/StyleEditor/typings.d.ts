interface BackButtonInfo {
  action: () => void
  text: string
}

interface NavigationInfo {
  backButton: BackButtonInfo
  title: string
}

interface NavigationUpdate {
  type: 'push' | 'pop' | 'update'
  info?: NavigationInfo
}
