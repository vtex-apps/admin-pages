import { MutationFn } from 'react-apollo'
import { InjectedIntl } from 'react-intl'
import { FormProps } from 'react-jsonschema-form'
import { ToastConsumerFunctions } from 'vtex.styleguide'

import {
  ListContentData,
  ListContentQueryResult,
} from '../../queries/ListContent'
import { GetDefaultConditionParams } from '../typings'

import { State as FormState } from './index'

export interface EditingState
  extends Partial<Omit<ExtensionConfiguration, 'contentJSON'>> {
  content?: Extension['content']
  formData?: Extension['content']
}

export type GetDefaultConfiguration = (
  params: GetDefaultConditionParams
) => ExtensionConfiguration

export type GetFormData = (params: GetFormDataParams) => Extension['content']

interface GetInitialEditingStateParams {
  data?: ListContentData
  editTreePath: EditorContextType['editTreePath']
  iframeRuntime: RenderContext
  intl: InjectedIntl
  isSitewide: boolean
}

export type GetInitialEditingState = (
  params: GetInitialEditingStateParams
) => {
  formState: EditingState
  partialBlockData: Pick<
    BlockData,
    | 'componentImplementation'
    | 'componentSchema'
    | 'configurations'
    | 'contentSchema'
    | 'title'
  >
}

interface UseFormHandlersParams {
  iframeRuntime: RenderContext
  intl: InjectedIntl
  query: ListContentQueryResult
  saveMutation: MutationFn<SaveContentData, SaveContentVariables>
  setState: React.Dispatch<Partial<FormState>>
  showToast: ToastConsumerFunctions['showToast']
  state: FormState
}

export type UseFormHandlers = (
  params: UseFormHandlersParams
) => {
  handleActiveConfigurationOpen: () => void
  handleConditionChange: (changes: Partial<FormState['condition']>) => void
  handleConfigurationCreate: () => ReturnType<
    ReturnType<UseFormHandlers>['handleInactiveConfigurationOpen']
  >
  handleFormChange: FormProps<FormDataContainer>['onChange']
  handleFormClose: () => void
  handleFormSave: () => Promise<void>
  handleInactiveConfigurationOpen: (
    configuration: ExtensionConfiguration
  ) => Promise<void>
  handleLabelChange: React.ChangeEventHandler<HTMLInputElement>
  handleListOpen: () => void
}
