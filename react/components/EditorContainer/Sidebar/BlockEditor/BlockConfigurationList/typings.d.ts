import { ToastConsumerFunctions } from 'vtex.styleguide'

import { DeleteContentMutationFn } from '../../mutations/DeleteContent'
import { GetDefaultCondition } from '../../typings'

export type GetDefaultConfiguration = (
  params: Parameters<GetDefaultCondition>[0]
) => ExtensionConfiguration

export interface UseListHandlersParams {
  deleteContent: DeleteContentMutationFn
  iframeRuntime: RenderContext
  intl: ReactIntl.InjectedIntl
  isSitewide: boolean
  onBack: () => void
  serverTreePath: string
  showToast: ToastConsumerFunctions['showToast']
  template: string
}

export type UseListHandlers = (
  params: UseListHandlersParams
) => {
  handleConfigurationCreation: () => void
  handleConfigurationDeletion: (
    configuration: ExtensionConfiguration
  ) => Promise<void>
  handleConfigurationOpen: (configuration: ExtensionConfiguration) => void
  handleQuit: () => void
}
