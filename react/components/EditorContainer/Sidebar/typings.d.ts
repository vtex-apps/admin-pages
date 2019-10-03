import { GetInitialEditingStateParams } from './BlockEditor/typings'

export interface FormMetaContext {
  getWasModified: () => boolean
  setWasModified: (newValue: boolean, callback?: () => void) => void
}

export interface ModalContext {
  actionHandler?: () => void
  cancelHandler?: () => void
  close: () => void
  getIsOpen: () => boolean
  open: (handlers?: {
    actionHandler?: ModalContext['actionHandler']
    cancelHandler?: ModalContext['cancelHandler']
    closeCallbackHandler?: () => void
  }) => void
}

export interface SidebarComponent {
  name: string
  isEditable: boolean
  treePath: string
}

export interface ModifiedSidebarComponent extends SidebarComponent {
  modifiedTreePath: string
}

// eslint-disable-next-line @typescript-eslint/prefer-interface
export type FormDataContainer = {
  formData: object
}

export interface GetDefaultConditionParams {
  iframeRuntime: RenderContext
  isSitewide: boolean
}

export type GetDefaultCondition = ({
  iframeRuntime,
  isSitewide,
}) => ExtensionConfiguration['condition']

export type UpdateEditorBlockData = (
  params: Omit<GetInitialEditingStateParams, 'editTreePath'> &
    Pick<BlockData, 'id' | 'serverTreePath' | 'template'> & {
      editor: EditorContextType
    }
) => void
