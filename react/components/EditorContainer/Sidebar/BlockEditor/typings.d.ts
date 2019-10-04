import { MutationFn } from 'react-apollo'
import { InjectedIntl } from 'react-intl'
import { FormProps } from 'react-jsonschema-form'
import { ToastConsumerFunctions } from 'vtex.styleguide'

import { ListContentQueryResult } from '../../queries/ListContent'
import { GetDefaultConditionParams } from '../typings'

import { State as FormState } from './index'

export interface EditingState
  extends Partial<Omit<ExtensionConfiguration, 'contentJSON'>> {
  content?: Extension['content']
  formData?: Extension['content']
}

export interface GetDefaultConditionParams {
  iframeRuntime: RenderContext
  isSitewide: boolean
}

export type GetDefaultCondition = ({
  iframeRuntime,
  isSitewide,
}) => ExtensionConfiguration['condition']

export type GetDefaultConfiguration = (
  params: GetDefaultConditionParams
) => ExtensionConfiguration

interface GetFormDataParams {
  componentImplementation: GetSchemaPropsOrContentFromRuntimeParams['component']
  content: GetSchemaPropsOrContentFromRuntimeParams['propsOrContent']
  contentSchema: GetSchemaPropsOrContentFromRuntimeParams['contentSchema']
  iframeRuntime: GetSchemaPropsOrContentFromRuntimeParams['runtime']
}

export type GetFormData = (params: GetFormDataParams) => Extension['content']

export interface UseFormHandlersParams {
  iframeRuntime: RenderContext
  intl: InjectedIntl
  isSitewide: boolean
  query: ListContentQueryResult
  saveContent: MutationFn<SaveContentData, SaveContentVariables>
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
  handleFormBack: () => void
  handleFormChange: FormProps<FormDataContainer>['onChange']
  handleFormSave: () => Promise<void>
  handleInactiveConfigurationOpen: (
    configuration: ExtensionConfiguration
  ) => Promise<void>
  handleInitialStateSet: () => void
  handleLabelChange: React.ChangeEventHandler<HTMLInputElement>
  handleListOpen: () => void
}
