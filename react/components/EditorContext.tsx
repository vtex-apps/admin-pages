import { createContext, useContext } from 'react'

export const EditorContext = createContext<EditorContext>({} as any)
EditorContext.displayName = 'EditorContext'

export const useEditorContext = () => useContext(EditorContext)
