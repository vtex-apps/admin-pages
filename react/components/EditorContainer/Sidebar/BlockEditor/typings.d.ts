import { MutationFn } from 'react-apollo'
import { InjectedIntl } from 'react-intl'
import { FormProps } from 'react-jsonschema-form'
import { ToastConsumerFunctions } from 'vtex.styleguide'

import { GetDefaultConditionParams } from '../typings'

import { State as FormState } from './index'

export type GetDefaultConfiguration = (
  params: GetDefaultConditionParams
) => ExtensionConfiguration

export interface GetDefaultConditionParams {
  iframeRuntime: RenderContext
  isSitewide: boolean
}

export interface UseFormHandlersParams {
  iframeRuntime: RenderContext
  intl: InjectedIntl
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
  handleLabelChange: React.ChangeEventHandler<HTMLInputElement>
  handleListOpen: () => void
}
