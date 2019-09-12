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
  messages: {},
  mode: 'content',
  onChangeIframeUrl: () => {},
  setDevice: () => {},
  setIsLoading: () => {},
  setMode: () => {},
  setBlockData: () => {},
  setViewport: () => {},
  toggleEditMode: () => {},
  viewport: 'desktop',
}

export const EditorContext = createContext(initialEditorContextState)

EditorContext.displayName = 'EditorContext'

export const useEditorContext = () => useContext(EditorContext)
