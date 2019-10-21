import { InjectedIntl } from 'react-intl'
import { ToastConsumerFunctions } from 'vtex.styleguide'

import { GetSchemaPropsOrContentFromRuntimeParams } from '../../../utils/components/typings'
import { ListContentData } from '../queries/ListContent'

export interface FormMetaContext {
  getWasModified: () => boolean
  setWasModified: (newValue: boolean, callback?: () => void) => void
}

export interface ModalContext {
  actionHandler?: () => void
  cancelHandler?: () => void
  close: () => void
  getIsOpen: () => boolean
  getTextButtonAction: () => string
  getTextButtonCancel: () => string
  getTextMessage: () => string
  isActionDanger: boolean
  open: (handlers?: {
    actionHandler?: ModalContext['actionHandler']
    cancelHandler?: ModalContext['cancelHandler']
    closeCallbackHandler?: () => void
    isActionDanger?: ModalContext['isActionDanger']
    textButtonAction?: ModalContext['textButtonAction']
    textButtonCancel?: ModalContext['textButtonCancel']
    textMessage?: ModalContext['textMessage']
  }) => void
  textButtonAction: string
  textButtonCancel: string
  textMessage: string
}

export interface SidebarComponent {
  name: string
  isEditable: boolean
  treePath: string
}

export interface ModifiedSidebarComponent extends SidebarComponent {
  modifiedTreePath: string
}

export interface EditingState
  extends Partial<Omit<ExtensionConfiguration, 'contentJSON'>> {
  content?: Extension['content']
  formData?: Extension['content']
}

// eslint-disable-next-line @typescript-eslint/prefer-interface
export type FormDataContainer = {
  formData: object
}

interface GetInitialEditingStateParams {
  data: ListContentData
  editor: EditorContextType
  iframeRuntime: RenderContext
}

export type GetInitialEditingState = (
  params: GetInitialEditingStateParams
) => EditingState

export type GetDefaultCondition = ({
  iframeRuntime,
  isSitewide,
}) => ExtensionConfiguration['condition']

interface GetFormDataParams {
  componentImplementation: GetSchemaPropsOrContentFromRuntimeParams['component']
  content: GetSchemaPropsOrContentFromRuntimeParams['propsOrContent']
  contentSchema: GetSchemaPropsOrContentFromRuntimeParams['contentSchema']
  iframeRuntime: GetSchemaPropsOrContentFromRuntimeParams['runtime']
}

export type GetFormData = (params: GetFormDataParams) => Extension['content']

export type UpdateEditorBlockData = (
  params: Pick<BlockData, 'id' | 'serverTreePath' | 'template'> & {
    data?: ListContentData
    editor: EditorContextType
    iframeRuntime: RenderContext
    intl: InjectedIntl
    isSitewide: boolean
  }
) => void

interface UseInitialEditingStateParams {
  client: ApolloClient
  iframeRuntime: RenderContext
  intl: InjectedIntl
  showToast: ToastConsumerFunctions['showToast']
}

export type UseInitialEditingState = (
  params: UseInitialEditingStateParams
) => EditingState | undefined
