import { MutationFn } from 'react-apollo'
import { InjectedIntl } from 'react-intl'
import { FormProps } from 'react-jsonschema-form'
import { ToastConsumerFunctions } from 'vtex.styleguide'

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
) => FormState

interface UseFormHandlersParams {
  iframeRuntime: RenderContext
  intl: InjectedIntl
  saveMutation: MutationFn<SaveContentData, SaveContentVariables>
  serverTreePath: string
  setState: React.Dispatch<FormState>
  showToast: ToastConsumerFunctions['showToast']
  state: FormState
  template: string
}

export type UseFormHandlers = (
  params: UseFormHandlersParams
) => {
  handleFormChange: FormProps<FormDataContainer>['onChange']
  handleFormClose: () => void
  handleFormSave: () => void
  handleLabelChange: React.ChangeEventHandler<HTMLInputElement>
}
