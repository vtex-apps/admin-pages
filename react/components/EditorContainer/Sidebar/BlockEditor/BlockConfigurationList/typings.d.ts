import { MutationUpdaterFn } from 'react-apollo'
import { ToastConsumerFunctions } from 'vtex.styleguide'

import { GetSchemaPropsOrContentFromRuntimeParams } from '../../../../../utils/components/typings'
import {
  DeleteContentData,
  DeleteContentMutationFn,
} from '../../../mutations/DeleteContent'
interface GetFormDataParams {
  componentImplementation: GetSchemaPropsOrContentFromRuntimeParams['component']
  content: GetSchemaPropsOrContentFromRuntimeParams['propsOrContent']
  contentSchema: GetSchemaPropsOrContentFromRuntimeParams['contentSchema']
  iframeRuntime: GetSchemaPropsOrContentFromRuntimeParams['runtime']
}

interface GetDeleteStoreUpdaterParams
  extends Pick<BlockData, 'serverTreePath' | 'template'> {
  blockId: EditorContextType['blockData']['id']
  iframeRuntime: RenderContext
  setBlockData: EditorContextType['setBlockData']
}

export type GetDeleteStoreUpdater = (
  params: GetDeleteStoreUpdaterParams
) => MutationUpdaterFn<DeleteContentData>

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
  handleConfigurationDelete: (
    configuration: ExtensionConfiguration
  ) => Promise<void>
  handleQuit: () => void
}
