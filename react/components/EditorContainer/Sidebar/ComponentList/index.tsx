import { clone, equals, findIndex, last } from 'ramda'
import React, { Component, Fragment } from 'react'
import { compose, graphql, MutationFn } from 'react-apollo'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'
import { arrayMove, SortEndHandler } from 'react-sortable-hoc'
import { Button, ToastConsumerRenderProps } from 'vtex.styleguide'

import UpdateBlock from '../../../../queries/UpdateBlock.graphql'
import { getBlockPath, getRelativeBlocksIds } from '../../../../utils/blocks'
import { getExtension } from '../../../../utils/components'
import UndoIcon from '../../../icons/UndoIcon'
import Modal from '../../../Modal'
import { SidebarComponent } from '../typings'

import SortableList from './SortableList'
import { NormalizedComponent, ReorderChange } from './typings'
import { getParentTreePath, normalize } from './utils'

interface CustomProps {
  components: SidebarComponent[]
  editor: EditorContext
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContextProps['runtime']
  onMouseEnterComponent: (
    event: React.MouseEvent<HTMLDivElement | HTMLLIElement>
  ) => void
  onMouseLeaveComponent: () => void
  updateBlock: MutationFn
}

type Props = CustomProps & InjectedIntlProps & ToastConsumerRenderProps

interface State {
  changes: ReorderChange[]
  components: NormalizedComponent[]
  handleCancelModal: () => void
  initialComponents: SidebarComponent[]
  isLoadingMutation: boolean
  isModalOpen: boolean
  modalCancelMessageId: string
  modalTextMessageId: string
}

const noop = () => {
  return
}

class ComponentList extends Component<Props, State> {
  public static getDerivedStateFromProps(props: Props, state: State) {
    if (!equals(props.components, state.initialComponents)) {
      return {
        components: normalize(props.components),
        initialComponents: props.components
      }
    }
  }

  private block: Extension

  constructor(props: Props) {
    super(props)

    const { iframeRuntime } = props

    this.block = getExtension(iframeRuntime.page, iframeRuntime.extensions)

    this.state = {
      changes: [],
      components: normalize(props.components),
      handleCancelModal: noop,
      initialComponents: props.components,
      isLoadingMutation: false,
      isModalOpen: false,
      modalCancelMessageId:
        'pages.editor.component-list.save.modal.button.cancel',
      modalTextMessageId: 'pages.editor.component-list.save.modal.text'
    }
  }

  public render() {
    const {
      editor,
      intl,
      onMouseEnterComponent,
      onMouseLeaveComponent,
      showToast
    } = this.props

    const hasChanges = this.state.changes.length > 0

    const isSortable = editor.mode === 'layout'

    return (
      <Fragment>
        <Modal
          isActionLoading={this.state.isLoadingMutation}
          onClickAction={this.handleSaveReorder}
          onClickCancel={this.state.handleCancelModal}
          onClose={this.handleCloseModal}
          isOpen={this.state.isModalOpen}
          textButtonAction={intl.formatMessage({
            id: 'pages.editor.component-list.button.save'
          })}
          textButtonCancel={intl.formatMessage({
            id: this.state.modalCancelMessageId
          })}
          textMessage={intl.formatMessage({
            id: this.state.modalTextMessageId
          })}
        />
        <div className="bb bw1 b--light-silver" />
        <div className="flex flex-column justify-between flex-grow-1">
          <SortableList
            components={this.state.components}
            editor={editor}
            isSortable={isSortable}
            lockAxis="y"
            onEdit={this.handleEdit}
            onMouseEnter={onMouseEnterComponent}
            onMouseLeave={onMouseLeaveComponent}
            onSortEnd={this.handleSortEnd}
            showToast={showToast}
            useDragHandle={isSortable}
          />
          <div className="bt b--light-silver" />
          <div
            className="bt bw1 b--light-silver w-100"
            style={{ marginTop: 'auto' }}
          >
            <div className="w-50 fl tc bw1 br b--light-silver">
              <Button
                disabled={!hasChanges}
                onClick={this.handleUndo}
                variation="tertiary"
              >
                <UndoIcon color={!hasChanges ? '#979899' : undefined} />
                <FormattedMessage id="pages.editor.component-list.button.undo">
                  {text => <span className="pl3">{text}</span>}
                </FormattedMessage>
              </Button>
            </div>
            <div className="w-50 fl tc">
              <Button
                disabled={!hasChanges}
                isLoading={this.state.isLoadingMutation}
                onClick={this.handleOpenSaveChangesModal}
                variation="tertiary"
              >
                <FormattedMessage id="pages.editor.component-list.button.save" />
              </Button>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }

  private handleCloseModal = () => {
    this.setState({
      handleCancelModal: noop,
      isModalOpen: false
    })
  }

  private handleEdit = (event: React.MouseEvent<HTMLDivElement>) => {
    if (this.state.changes.length > 0) {
      const handleCancelModal = () => {
        this.setState(
          prevState => ({
            ...prevState,
            changes: [prevState.changes[0]],
            isModalOpen: false
          }),
          () => {
            this.handleUndo()
          }
        )
      }

      this.setState({
        handleCancelModal,
        isModalOpen: true,
        modalCancelMessageId:
          'pages.editor.component-list.undo.modal.button.cancel',
        modalTextMessageId: 'pages.editor.component-list.undo.modal.text'
      })
    } else {
      const { editor, highlightHandler } = this.props

      const treePath = event.currentTarget.getAttribute('data-tree-path')

      editor.editExtensionPoint(treePath)

      highlightHandler(null)
    }
  }

  private handleOpenSaveChangesModal = () => {
    this.setState({
      handleCancelModal: this.handleCloseModal,
      isModalOpen: true,
      modalCancelMessageId:
        'pages.editor.component-list.save.modal.button.cancel',
      modalTextMessageId: 'pages.editor.component-list.save.modal.text'
    })
  }

  private handleSaveReorder = async () => {
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
      isLoadingMutation: true
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
            after: parsedRelativeBlocks.after,
            around: parsedRelativeBlocks.around,
            before: parsedRelativeBlocks.before,
            blocks: extension.blocks,
            propsJSON: JSON.stringify(extension.props),
          },
          blockPath: getBlockPath(
            iframeRuntime.extensions,
            iframeCurrentPage
          ),
        }
      })

      this.props.showToast(
        intl.formatMessage({
          id: 'pages.editor.component-list.save.toast.success'
        })
      )

      changes = []
    } catch (e) {
      this.props.showToast(
        intl.formatMessage({
          id: 'pages.editor.component-list.save.toast.error'
        })
      )
    } finally {
      this.handleCloseModal()

      this.setState({
        changes,
        isLoadingMutation: false
      })
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
      const extensionPoints = extension.blocks.map(block => block.extensionPointId)

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
        changes: [
          ...prevState.changes,
          { blocks: newBlocks, components: prevState.components, target },
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
      this.props.iframeRuntime.updateExtension(target, {
        ...extension,
          blocks,
      })

      this.setState(prevState => ({
        ...prevState,
        changes: prevState.changes.slice(0, prevState.changes.length - 1),
          components,
      }))
    }
  }
}
}

export default compose(
  injectIntl,
  graphql(UpdateBlock, { name: 'updateBlock' })
)(ComponentList)
