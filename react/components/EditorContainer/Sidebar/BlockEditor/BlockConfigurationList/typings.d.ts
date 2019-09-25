import { ToastConsumerFunctions } from 'vtex.styleguide'

import { GetSchemaPropsOrContentFromRuntimeParams } from '../../../../../utils/components/typings'
import { DeleteContentMutationFn } from '../../mutations/DeleteContent'

interface GetFormDataParams {
  componentImplementation: GetSchemaPropsOrContentFromRuntimeParams['component']
  content: GetSchemaPropsOrContentFromRuntimeParams['propsOrContent']
  contentSchema: GetSchemaPropsOrContentFromRuntimeParams['contentSchema']
  iframeRuntime: GetSchemaPropsOrContentFromRuntimeParams['runtime']
}

export interface UseListHandlersParams {
  deleteContent: DeleteContentMutationFn
  iframeRuntime: RenderContext
  intl: ReactIntl.InjectedIntl
  onBack: () => void
  showToast: ToastConsumerFunctions['showToast']
}

export type UseListHandlers = (
  params: UseListHandlersParams
) => {
  handleConfigurationDeletion: (
    configuration: ExtensionConfiguration
  ) => Promise<void>
  handleQuit: () => void
}
