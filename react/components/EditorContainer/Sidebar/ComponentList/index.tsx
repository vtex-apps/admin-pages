import { clone, equals, findIndex, last, path } from 'ramda'
import React, { Component, Fragment } from 'react'
import { compose, graphql, MutationFn } from 'react-apollo'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'
import { arrayMove, SortEndHandler } from 'react-sortable-hoc'
import { Button, ToastConsumerRenderProps } from 'vtex.styleguide'

import UndoIcon from '../../../icons/UndoIcon'
import Modal from '../../../Modal'
import SaveExtension from '../../../queries/SaveExtension.graphql'
import { SidebarComponent } from '../typings'

import SortableList from './SortableList'
import { NormalizedComponent, ReorderChange } from './typings'
import { getParentTreePath, normalizeComponents } from './utils'

interface CustomProps {
  components: SidebarComponent[]
  editor: EditorContext
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContextProps['runtime']
  onMouseEnterComponent: (
    event: React.MouseEvent<HTMLDivElement | HTMLLIElement>
  ) => void
  onMouseLeaveComponent: () => void
  saveExtension: MutationFn
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
        components: normalizeComponents(props.components),
        initialComponents: props.components,
      }
    }
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      changes: [],
      components: normalizeComponents(props.components),
      handleCancelModal: noop,
      initialComponents: props.components,
      isLoadingMutation: false,
      isModalOpen: false,
      modalCancelMessageId:
        'pages.editor.component-list.save.modal.button.cancel',
      modalTextMessageId: 'pages.editor.component-list.save.modal.text',
    }
  }

  public render() {
    const {
      editor,
      intl,
      onMouseEnterComponent,
      onMouseLeaveComponent,
      showToast,
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
            id: 'pages.editor.component-list.button.save',
          })}
          textButtonCancel={intl.formatMessage({
            id: this.state.modalCancelMessageId,
          })}
          textMessage={intl.formatMessage({
            id: this.state.modalTextMessageId,
          })}
        />
        <div className="bb bw1 b--light-silver" />
        <div className="flex flex-column justify-between flex-grow-1">
          <SortableList
            components={this.state.components}
            isSortable={isSortable}
            lockAxis="y"
            onEdit={this.handleEdit}
            onMouseEnter={onMouseEnterComponent}
            onMouseLeave={onMouseLeaveComponent}
            onSortEnd={this.handleSortEnd}
            showToast={showToast}
            useDragHandle={isSortable}
          />
          )}
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
                <FormattedMessage id="pages.editor.component-list.button.undo" />
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
      isModalOpen: false,
    })
  }

  private handleEdit = (event: React.MouseEvent<HTMLDivElement>) => {
    if (this.state.changes.length > 0) {
      const handleCancelModal = () => {
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

      this.setState({
        handleCancelModal,
        isModalOpen: true,
        modalCancelMessageId:
          'pages.editor.component-list.undo.modal.button.cancel',
        modalTextMessageId: 'pages.editor.component-list.undo.modal.text',
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
      modalTextMessageId: 'pages.editor.component-list.save.modal.text',
    })
  }

  private handleSaveReorder = async () => {
    const { iframeRuntime, intl, saveExtension } = this.props

    const iframeWindow = (document.getElementById(
      'store-iframe'
    ) as HTMLIFrameElement).contentWindow

    const iframeCurrentPage = iframeRuntime.page
    const extension = iframeRuntime.extensions[iframeCurrentPage]
    const configurationId = path(['configurationIds', 0])(extension)

    if (iframeWindow === null) {
      throw new Error('iframeWindow is null')
    }

    let changes = this.state.changes

    try {
      this.setState({
        isLoadingMutation: true,
      })

      await saveExtension({
        variables: {
          allMatches: true,
          conditions: [],
          configurationId,
          device: 'any',
          extensionName: iframeCurrentPage,
          label: null,
          path: iframeWindow.location.pathname,
          propsJSON: JSON.stringify(extension.props),
          routeId: 'store',
          scope: 'route',
        },
      })

      this.props.showToast(
        intl.formatMessage({
          id: 'pages.editor.component-list.save.toast.success',
        })
      )

      changes = []
    } catch (e) {
      this.props.showToast(
        intl.formatMessage({
          id: 'pages.editor.component-list.save.toast.error',
        })
      )
    } finally {
      this.handleCloseModal()

      this.setState({
        changes,
        isLoadingMutation: false,
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

    if (isSameTree && !isChangingSameExtensionPoint) {
      const extension: Extension = this.props.iframeRuntime.extensions[
        firstTargetParentTreePath
      ]

      const firstTargetIndex = findIndex(
        equals(firstTargetName),
        extension.props.elements
      )
      const secondTargetIndex = findIndex(
        equals(secondTargetName),
        extension.props.elements
      )

      const oldOrder = clone(extension.props.elements)

      const target = firstTargetParentTreePath

      const newOrder = arrayMove(
        extension.props.elements,
        firstTargetIndex,
        secondTargetIndex
      )

      this.props.iframeRuntime.updateExtension(firstTargetParentTreePath, {
        ...extension,
        props: {
          ...extension.props,
          elements: newOrder,
        },
      })

      this.setState(prevState => ({
        ...prevState,
        changes: [...prevState.changes, { order: oldOrder, target }],
        components: arrayMove(this.state.components, oldIndex, newIndex),
      }))
    }
  }

  private handleUndo = () => {
    const lastChange = last(this.state.changes)

    if (lastChange) {
      const { target, order } = lastChange

      const extension = this.props.iframeRuntime.extensions[target]

      const changes = this.state.changes.slice(
        0,
        this.state.changes.length - 1
      )

      this.props.iframeRuntime.updateExtension(target, {
        ...extension,
        props: {
          ...extension.props,
          elements: order,
        },
      })

      this.setState({ changes })
    }
  }
}

export default compose(
  injectIntl,
  graphql(SaveExtension, { name: 'saveExtension' })
)(ComponentList)
