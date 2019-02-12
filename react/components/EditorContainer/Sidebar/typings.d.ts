export interface FormMetaContext {
  getWasModified: () => FormMetaContext['wasModified']
  isLoading: boolean
  setWasModified: (newValue: boolean, callback?: () => void) => void
  toggleLoading: (callback?: () => void) => void
  wasModified: boolean
}

export interface ModalContext {
  actionHandler: () => void
  cancelHandler: () => void
  closeCallbackHandler?: () => void
  close: () => void
  isOpen: boolean
  open: () => void
  setHandlers: (
    handlers: {
      actionHandler?: ModalContext['actionHandler']
      cancelHandler?: ModalContext['cancelHandler']
      closeCallbackHandler?: ModalContext['closeCallbackHandler']
    },
  ) => void
}

export interface SidebarComponent {
  name: string
  treePath: string
}

export interface ComponentEditorFormContext {
  isLayoutMode: boolean
}
