export interface FormMetaContext {
  getWasModified: () => boolean
  setWasModified: (newValue: boolean, callback?: () => void) => void
}

export interface ModalContext {
  actionHandler: () => void
  cancelHandler: () => void
  closeCallbackHandler?: () => void
  close: () => void
  isOpen: boolean
  open: () => void
  setHandlers: (handlers: {
    actionHandler?: ModalContext['actionHandler']
    cancelHandler?: ModalContext['cancelHandler']
    closeCallbackHandler?: ModalContext['closeCallbackHandler']
  }) => void
}

export interface SidebarComponent {
  name: string
  isEditable: boolean
  treePath: string
}

export interface ModifiedSidebarComponent extends SidebarComponent {
  modifiedTreePath: string
}

export interface ComponentEditorFormContext {
  isLayoutMode: boolean
}

// eslint-disable-next-line @typescript-eslint/prefer-interface
export type FormDataContainer = {
  formData: object
}
