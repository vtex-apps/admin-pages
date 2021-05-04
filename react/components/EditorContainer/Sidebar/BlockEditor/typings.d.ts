import { MutationFn } from 'react-apollo'
import { InjectedIntl } from 'react-intl'
import { FormProps } from 'react-jsonschema-form'
import { ToastConsumerFunctions } from 'vtex.styleguide'

import { GetDefaultConditionParams } from '../typings'
import { ConfigurationStatus, State as FormState } from './index'

export type GetDefaultConfiguration = (
  params: GetDefaultConditionParams
) => ExtensionConfiguration

export interface GetDefaultConditionParams {
  iframeRuntime: RenderContext
  isSitewide: boolean
}

interface GetConfigurationTypeParams {
  configuration: ExtensionConfiguration
  activeContentId: ExtensionConfiguration['contentId']
}

type ConfigurationType = 'active' | 'inactive' | 'app'

type GetConfigurationType = (
  params: GetConfigurationTypeParams
) => ConfigurationType

export interface UseFormHandlersParams {
  iframeRuntime: RenderContext
  intl: InjectedIntl
  saveContent: MutationFn<SaveContentData, SaveContentVariables>
  setState: React.Dispatch<Partial<FormState>>
  showToast: ToastConsumerFunctions['showToast']
  state: FormState
  statusFromRuntime?: ConfigurationStatus
}

export type UseFormHandlers = (
  params: UseFormHandlersParams
) => {
  handleStatusChange: () => void
  handleConfigurationActivate: (
    configuration: ExtensionConfiguration
  ) => Promise<void>
  handleConditionChange: (changes: Partial<FormState['condition']>) => void
  handleConfigurationCreate: () => ReturnType<
    ReturnType<UseFormHandlers>['handleInactiveConfigurationOpen']
  >
  handleConfigurationOpen: (
    configuration: ExtensionConfiguration
  ) => Promise<void>
  handleFormBack: () => void
  handleFormChange: FormProps<FormDataContainer>['onChange']
  handleFormSave: () => Promise<void>
  handleLabelChange: React.ChangeEventHandler<HTMLInputElement>
  handleListClose: () => void
  handleListOpen: () => void
}
