export interface State {
  editExtensionPoint: (treePath: string | null) => void
  editMode: boolean
  openBlockTreePath: string | null
  highlightHandler: (treePath: string | null) => void
  highlightTreePath: string | null
  sidebarBlocksMap: Record<string, { title?: string; isEditable: boolean }>
}
