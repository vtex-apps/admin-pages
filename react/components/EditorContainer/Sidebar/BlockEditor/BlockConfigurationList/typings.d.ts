import { MutationUpdaterFn } from 'react-apollo'
import { ToastConsumerFunctions } from 'vtex.styleguide'

import {
  DeleteContentData,
  DeleteContentMutationFn,
} from '../../../mutations/DeleteContent'
import { SendEventToAuditMutationFn } from '../../../mutations/SendEventToAudit'

interface GetDeleteStoreUpdaterParams
  extends Pick<BlockData, 'serverTreePath' | 'template'> {
  action: 'reset' | 'delete'
  blockId: EditorContextType['blockData']['id']
  iframeRuntime: RenderContext
  setBlockData: EditorContextType['setBlockData']
}

export type GetDeleteStoreUpdater = (
  params: GetDeleteStoreUpdaterParams
) => MutationUpdaterFn<DeleteContentData>

export interface UseListHandlersParams {
  activeContentId: ExtensionConfiguration['contentId']
  deleteContent: DeleteContentMutationFn
  sendEventToAudit: SendEventToAuditMutationFn
  iframeRuntime: RenderContext
  intl: ReactIntl.InjectedIntl
  showToast: ToastConsumerFunctions['showToast']
}

export type UseListHandlers = (
  params: UseListHandlersParams
) => {
  handleConfirmConfigurationDelete: (
    configuration: ExtensionConfiguration
  ) => void
  handleConfigurationDelete: (
    configuration: ExtensionConfiguration
  ) => Promise<void>
}
