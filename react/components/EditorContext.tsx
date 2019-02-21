import { createContext, useContext } from 'react'

export const EditorContext = createContext<EditorContext>({} as any)
export const useEditorContext = () => useContext(EditorContext)
