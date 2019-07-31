import { createContext, useContext } from 'react'

export const initialEditorContextState: EditorContext = {
  activeConditions: [],
  addCondition: () => {},
  allMatches: true,
  availableCultures: [],
  editExtensionPoint: () => {},
  editMode: false,
  editTreePath: null,
  getIsLoading: () => false,
  iframeWindow: window,
  messages: {},
  mode: 'content',
  onChangeIframeUrl: () => {},
  setDevice: () => {},
  setIsLoading: () => {},
  setMode: () => {},
  setViewport: () => {},
  toggleEditMode: () => {},
  viewport: 'desktop',
}

export const EditorContext = createContext(initialEditorContextState)

EditorContext.displayName = 'EditorContext'

export const useEditorContext = () => useContext(EditorContext)
