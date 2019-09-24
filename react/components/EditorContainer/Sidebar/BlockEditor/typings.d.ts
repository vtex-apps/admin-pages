import { MutationFn } from 'react-apollo'
import { InjectedIntl } from 'react-intl'
import { FormProps } from 'react-jsonschema-form'
import { ToastConsumerFunctions } from 'vtex.styleguide'

import { ListContentData } from '../queries/ListContent'

import { State as FormState } from './index'

export interface EditingState
  extends Partial<Omit<ExtensionConfiguration, 'contentJSON'>> {
  content?: Extension['content']
  formData?: Extension['content']
}

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
  formState: EditingState
}

interface UseFormHandlersParams {
  iframeRuntime: RenderContext
  intl: InjectedIntl
  saveMutation: MutationFn<SaveContentData, SaveContentVariables>
  serverTreePath: string
  setState: React.Dispatch<Partial<FormState>>
  showToast: ToastConsumerFunctions['showToast']
  state: FormState
  template: string
}

export type UseFormHandlers = (
  params: UseFormHandlersParams
) => {
  handleActiveConfigurationOpen: () => void
  handleConditionChange: (changes: Partial<FormState['condition']>) => void
  handleFormChange: FormProps<FormDataContainer>['onChange']
  handleFormClose: () => void
  handleFormSave: () => Promise<void>
  handleLabelChange: React.ChangeEventHandler<HTMLInputElement>
  handleListOpen: () => void
}
