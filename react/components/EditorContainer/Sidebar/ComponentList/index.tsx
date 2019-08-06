import { clone, equals, findIndex, last } from 'ramda'
import React, { Component, Fragment } from 'react'
import {
  defineMessages,
  FormattedMessage,
  InjectedIntlProps,
  injectIntl,
} from 'react-intl'
import { arrayMove, SortEndHandler } from 'react-sortable-hoc'
import { Button, ButtonWithIcon, ToastConsumerFunctions } from 'vtex.styleguide'

import { getBlockPath, getRelativeBlocksIds } from '../../../../utils/blocks'
import { getExtension } from '../../../../utils/components'
import UndoIcon from '../../../icons/UndoIcon'
import Modal from '../../../Modal'
import { UpdateBlockMutationFn } from '../../mutations/UpdateBlock'
import ContentContainer from '../ContentContainer'
import { SidebarComponent } from '../typings'

import SortableList from './SortableList'
import { NormalizedComponent, ReorderChange } from './typings'
import { getParentTreePath, normalize, pureSplice } from './utils'

interface CustomProps {
  components: SidebarComponent[]
  editor: EditorContext
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContextProps['runtime']
  onMouseEnterComponent: (
    event: React.MouseEvent<HTMLDivElement | HTMLLIElement>
  ) => void
  onMouseLeaveComponent: () => void
  updateBlock: UpdateBlockMutationFn
  updateSidebarComponents: (components: SidebarComponent[]) => void
}

type Props = CustomProps &
  InjectedIntlProps &
  Pick<ToastConsumerFunctions, 'showToast'>

interface State {
  blocks: Extension['blocks']
  changes: ReorderChange[]
  components: NormalizedComponent[]
  initialComponents: SidebarComponent[]
  isLoadingMutation: boolean
  isModalOpen: boolean
}

const messages = defineMessages({
  cancel: {
    defaultMessage: 'Discard',
    id: 'admin/pages.editor.component-list.modal.button.cancel',
  },
  save: {
    defaultMessage: 'Save',
    id: 'admin/pages.editor.component-list.modal.button.save',
  },
  saveFail: {
    defaultMessage: 'Could not be saved.',
    id: 'admin/pages.editor.component-list.toast.error',
  },
  saveSuccessful: {
    defaultMessage: 'Saved successfully.',
    id: 'admin/pages.editor.component-list.toast.success',
  },
  text: {
    defaultMessage: 'You have unsaved modifications',
    id: 'admin/pages.editor.component-list.modal.text',
  },
})

class ComponentList extends Component<Props, State> {
  public static getDerivedStateFromProps(props: Props, state: State) {
    if (!equals(props.components, state.initialComponents)) {
      return {
        ...state,
        components: normalize(props.components),
        initialComponents: props.components,
      }
    }
    return null
  }

  private block: Extension

  public constructor(props: Props) {
    super(props)

    const { iframeRuntime } = props

    this.block = getExtension(iframeRuntime.page, iframeRuntime.extensions)

    this.state = {
      blocks: this.block.blocks,
      changes: [],
      components: normalize(props.components),
      initialComponents: props.components,
      isLoadingMutation: false,
      isModalOpen: false,
    }
  }

  public render() {
    const { intl, onMouseEnterComponent, onMouseLeaveComponent } = this.props

    const hasChanges = this.state.changes.length > 0

    return (
      <Fragment>
        <Modal
          isActionLoading={this.state.isLoadingMutation}
          onClickAction={this.handleSave}
          onClickCancel={this.handleDiscard}
          onClose={this.handleCloseModal}
          isOpen={this.state.isModalOpen}
          textButtonAction={intl.formatMessage(messages.save)}
          textButtonCancel={intl.formatMessage(messages.cancel)}
          textMessage={intl.formatMessage(messages.text)}
        />

        <ContentContainer containerClassName="relative flex flex-column flex-grow-1">
          {hasChanges && (
            <div className="bb bw1 b--light-silver w-100">
              <div className="w-50 fl tc bw1 br b--light-silver">
                <ButtonWithIcon
                  block
                  disabled={!hasChanges}
                  icon={
                    <UndoIcon color={!hasChanges ? '#979899' : undefined} />
                  }
                  onClick={this.handleUndo}
                  variation="tertiary"
                >
                  <FormattedMessage
                    id="admin/pages.editor.component-list.button.undo"
                    defaultMessage="Undo"
                  >
                    {text => <span className="pl3">{text}</span>}
                  </FormattedMessage>
                </ButtonWithIcon>
              </div>

              <div className="w-50 fl tc">
                <Button
                  block
                  disabled={!hasChanges}
                  isLoading={this.state.isLoadingMutation}
                  onClick={this.handleSave}
                  variation="tertiary"
                >
                  <FormattedMessage
                    id="admin/pages.editor.component-list.button.save"
                    defaultMessage="Save"
                  />
                </Button>
              </div>
            </div>
          )}

          <SortableList
            components={this.state.components}
            lockAxis="y"
            onDelete={this.handleDelete}
            onEdit={this.handleEdit}
            onMouseEnter={onMouseEnterComponent}
            onMouseLeave={onMouseLeaveComponent}
            onSortEnd={this.handleSortEnd}
            useDragHandle
          />
        </ContentContainer>
      </Fragment>
    )
  }

  private handleCloseModal = () => {
    this.setState({
      isModalOpen: false,
    })
  }

  private handleDelete = async (treePath: string) => {
    if (!this.state.isLoadingMutation) {
      const { iframeRuntime } = this.props

      const splitTreePath = treePath.split('/')

      const parentTreePath = splitTreePath
        .slice(0, splitTreePath.length - 1)
        .join('/')

      const parentExtension = iframeRuntime.extensions[parentTreePath]

      const targetExtensionPointId = splitTreePath[splitTreePath.length - 1]

      const parentBlocks = parentExtension.blocks

      if (parentBlocks) {
        const targetBlockIndex = parentBlocks.findIndex(
          block => block.extensionPointId === targetExtensionPointId
        )

        const newParentBlocks = pureSplice(targetBlockIndex, parentBlocks)

        const newParentExtension = {
          ...parentExtension,
          blocks: newParentBlocks,
        }

        iframeRuntime.updateExtension(parentTreePath, newParentExtension)

        const targetComponentIndex = this.state.components.findIndex(
          component => component.treePath === treePath
        )

        const newParentComponents = pureSplice(
          targetComponentIndex,
          this.state.components
        )

        this.setState(prevState => ({
          ...prevState,
          blocks: newParentBlocks,
          changes: [
            ...prevState.changes,
            {
              blocks: prevState.blocks,
              components: prevState.components,
              target: parentTreePath,
            },
          ],
          components: newParentComponents,
        }))

        this.props.updateSidebarComponents(newParentComponents)
      }
    }
  }

  private handleDiscard = () => {
    this.setState(
      prevState => ({
        ...prevState,
        changes: [prevState.changes[0]],
        isModalOpen: false,
      }),
      () => {
        this.handleUndo()
      }
    )
  }

  private handleEdit = (component: NormalizedComponent) => {
    if (this.state.changes.length > 0) {
      this.setState({
        isModalOpen: true,
      })
    } else {
      const { editor, highlightHandler } = this.props
      const { treePath, isEditable } = component

      if (isEditable) {
        editor.editExtensionPoint(treePath)
        highlightHandler(null)
      }
    }
  }

  private handleSave = async (
    _?: Event,
    blocks?: Extension['blocks'],
    successCallback?: () => void
  ) => {
    const { iframeRuntime, intl, updateBlock } = this.props

    const iframeWindow = (document.getElementById(
      'store-iframe'
    ) as HTMLIFrameElement).contentWindow

    const iframeCurrentPage = iframeRuntime.page

    const extension = iframeRuntime.extensions[iframeCurrentPage]

    if (iframeWindow === null) {
      throw new Error('iframeWindow is null')
    }

    let changes = this.state.changes

    this.setState({
      isLoadingMutation: true,
    })

    const parsedRelativeBlocks = getRelativeBlocksIds(
      iframeCurrentPage,
      iframeRuntime.extensions,
      {
        after: this.block.after,
        around: this.block.around,
        before: this.block.before,
      }
    )

    try {
      await updateBlock({
        variables: {
          block: {
            after: parsedRelativeBlocks.after || [],
            around: parsedRelativeBlocks.around || [],
            before: parsedRelativeBlocks.before || [],
            blocks: blocks || extension.blocks || [],
            propsJSON: JSON.stringify(extension.props),
          },
          blockPath: getBlockPath(iframeRuntime.extensions, iframeCurrentPage),
        },
      })

      this.props.showToast(intl.formatMessage(messages.saveSuccessful))

      changes = []
    } catch (e) {
      this.props.showToast(intl.formatMessage(messages.saveFail))
    } finally {
      this.handleCloseModal()

      this.setState({
        changes,
        isLoadingMutation: false,
      })

      if (successCallback) {
        successCallback()
      }
    }
  }

  private handleSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
    const firstTargetParentTreePath = getParentTreePath(
      this.state.components[oldIndex].treePath
    )
    const secondTargetParentTreePath = getParentTreePath(
      this.state.components[newIndex].treePath
    )

    const firstTargetName = last(
      this.state.components[oldIndex].treePath.split('/')
    )
    const secondTargetName = last(
      this.state.components[newIndex].treePath.split('/')
    )

    const isSameTree = firstTargetParentTreePath === secondTargetParentTreePath
    const isChangingSameExtensionPoint = firstTargetName === secondTargetName

    const extension = this.props.iframeRuntime.extensions[
      firstTargetParentTreePath
    ]

    if (isSameTree && !isChangingSameExtensionPoint && extension.blocks) {
      const extensionPoints = extension.blocks.map(
        block => block.extensionPointId
      )

      const firstTargetIndex = findIndex(
        equals(firstTargetName),
        extensionPoints
      )
      const secondTargetIndex = findIndex(
        equals(secondTargetName),
        extensionPoints
      )

      const target = firstTargetParentTreePath

      const oldBlocks = clone(extension.blocks)

      const newBlocks = arrayMove(
        oldBlocks,
        firstTargetIndex,
        secondTargetIndex
      )

      this.props.iframeRuntime.updateExtension(firstTargetParentTreePath, {
        ...extension,
        blocks: newBlocks,
      })

      this.setState(prevState => ({
        ...prevState,
        blocks: newBlocks,
        changes: [
          ...prevState.changes,
          {
            blocks: prevState.blocks,
            components: prevState.components,
            target,
          },
        ],
        components: arrayMove(prevState.components, oldIndex, newIndex),
      }))
    }
  }

  private handleUndo = () => {
    const lastChange = last(this.state.changes)

    if (lastChange) {
      const { blocks, components, target } = lastChange

      const extension = this.props.iframeRuntime.extensions[target]

      if (extension.blocks) {
        const { iframeRuntime, updateSidebarComponents } = this.props

        iframeRuntime.updateExtension(target, {
          ...extension,
          blocks,
        })

        this.setState(prevState => ({
          ...prevState,
          blocks,
          changes: prevState.changes.slice(0, prevState.changes.length - 1),
          components,
        }))

        updateSidebarComponents(components)
      }
    }
  }
}

export default injectIntl(ComponentList)
