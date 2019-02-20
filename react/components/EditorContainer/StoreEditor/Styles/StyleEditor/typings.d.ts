interface BackButtonInfo {
  action: () => void
  text: string
}

interface NavigationInfo {
  backButton: BackButtonInfo
  title: string
}
