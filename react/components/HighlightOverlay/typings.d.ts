import { CSSProperties } from 'react'

export interface State {
  editExtensionPoint: (treePath: string | null) => void
  editMode: boolean
  elementHeight?: HTMLElement['clientHeight']
  highlightStyle?: CSSProperties
  labelStyle?: CSSProperties
  maskStyle?: CSSProperties
  openBlockTreePath: string | null
  highlightHandler: (treePath: string | null) => void
  highlightTreePath: string | null
  sidebarBlocksMap: Record<string, { title?: string; isEditable: boolean }>
}
