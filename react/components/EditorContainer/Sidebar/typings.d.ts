import { FormProps } from 'react-jsonschema-form'

import { ListContentData } from '../queries/ListContent'

import { State as FormState } from './Content'

export interface FormMetaContext {
  getWasModified: () => boolean
  setWasModified: (newValue: boolean, callback?: () => void) => void
}

export interface ModalContext {
  actionHandler: () => void
  cancelHandler: () => void
  closeCallbackHandler?: () => void
  close: () => void
  getIsOpen: () => boolean
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

interface GetInitialFormStateParams {
  data?: ListContentData
  editTreePath: EditorContextType['editTreePath']
  iframeRuntime: RenderContext
}

export type GetInitialFormState = (
  params: GetInitialFormStateParams
) => FormSTate

interface UseFormHandlersParams {
  iframeRuntime: RenderContext
  setState: React.Dispatch<SetStateAction<FormState>>
  state: FormState
}

export type UseFormHandlers = (
  params: UseFormHandlersParams
) => {
  handleFormChange: FormProps<FormDataContainer>['onChange']
  handleFormClose: () => void
}
