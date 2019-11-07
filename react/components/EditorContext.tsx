import { createContext, useContext } from 'react'

export const initialEditorContextState: EditorContextType = {
  activeConditions: [],
  addCondition: () => {},
  allMatches: true,
  availableCultures: [],
  blockData: {},
  editExtensionPoint: () => {},
  editMode: false,
  editTreePath: null,
  getIsLoading: () => false,
  iframeWindow: window.self,
  isSidebarVisible: true,
  messages: {},
  mode: 'content',
  onChangeIframeUrl: () => {},
  setDevice: () => {},
  setIsLoading: () => {},
  setMode: () => {},
  setBlockData: () => {},
  setViewport: () => {},
  toggleEditMode: () => {},
  toggleSidebarVisibility: () => {},
  viewport: 'desktop',
}

export const EditorContext = createContext(initialEditorContextState)

EditorContext.displayName = 'EditorContext'

export const useEditorContext = () => useContext(EditorContext)
