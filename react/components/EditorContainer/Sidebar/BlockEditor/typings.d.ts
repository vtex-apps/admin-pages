import { MutationFn } from 'react-apollo'
import { InjectedIntl } from 'react-intl'
import { FormProps } from 'react-jsonschema-form'
import { ToastConsumerFunctions } from 'vtex.styleguide'

import { ListContentData } from '../queries/ListContent'

import { State as FormState } from './BlockEditor'

interface GetInitialEditingStateParams {
  data?: ListContentData
  editTreePath: EditorContextType['editTreePath']
  iframeRuntime: RenderContext
  isSitewide: boolean
}

export type GetInitialEditingState = (
  params: GetInitialEditingStateParams
) => {
  blockData: BlockData
  formState: FormState
}

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
