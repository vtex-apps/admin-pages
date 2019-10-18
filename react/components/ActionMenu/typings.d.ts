export interface ActionMenuOption {
  isDangerous?: boolean
  label: string
  onClick: (e: ActionMenuOption) => void
}
