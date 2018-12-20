import { equals, findIndex, last, path } from 'ramda'
import React, { Component, Fragment } from 'react'
import { compose, graphql, MutationFn } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { arrayMove, SortEndHandler } from 'react-sortable-hoc'
import { Button, ToastConsumerRenderProps } from 'vtex.styleguide'

import SaveExtension from '../../../queries/SaveExtension.graphql'
import Modal from '../../Modal'
import { NormalizedComponent, SidebarComponent } from '../typings'
import List from './List'
import { getParentTreePath, normalizeComponents } from './utils'

interface CustomProps {
  components: SidebarComponent[]
  editor: EditorContext
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContextProps['runtime']
  onMouseEnterComponent: (
    event: React.MouseEvent<HTMLDivElement | HTMLLIElement>,
  ) => void
  onMouseLeaveComponent: () => void
  saveExtension: MutationFn
}

type Props = CustomProps & ToastConsumerRenderProps & InjectedIntlProps

interface State {
  cancelMessageId: string
  components: NormalizedComponent[]
  initialComponents: SidebarComponent[]
  isLoadingMutation: boolean
  isModalOpen: boolean
  handleCancelModal: () => void
  handleCloseModal: () => void
  handleConfirmModal: () => void
}

const noop = () => console.log('noop')

class SortableList extends Component<Props, State> {
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
      cancelMessageId: 'pages.editor.component-list.modal.button.cancel',
      components: normalizeComponents(props.components),
      handleCancelModal: noop,
      handleCloseModal: noop,
      handleConfirmModal: noop,
      initialComponents: props.components,
      isLoadingMutation: false,
      isModalOpen: false
    }
  }

  public render() {
    const { onMouseEnterComponent, onMouseLeaveComponent, intl } = this.props
    const { cancelMessageId, handleCancelModal, handleCloseModal, handleConfirmModal, isLoadingMutation, isModalOpen } = this.state

    return (
      <Fragment>
        <Modal
          isActionLoading={isLoadingMutation}
          textButtonAction={intl.formatMessage({id: 'pages.editor.component-list.save.button'})}
          onClickAction={handleConfirmModal}
          textButtonCancel={intl.formatMessage({id: cancelMessageId})}
          onClickCancel={handleCancelModal}
          onClose={handleCloseModal}
          isOpen={isModalOpen}
          textMessage={
            <Fragment>
              <h1>(i18n) Save Template</h1>
                <p>
                  (i18n) Are you sure? The changes will be applied to all pages that are using this {'<<<<<'}template{'>>>>>'}
              </p>
            </Fragment>
          }
        />
        <div className="bb bw1 b--light-silver" />
        <div className="flex flex-column justify-between flex-grow-1">
          <List
            components={this.state.components}
            isSortable
            lockAxis="y"
            onEdit={this.handleEdit}
            onMouseEnter={onMouseEnterComponent}
            onMouseLeave={onMouseLeaveComponent}
            onSortEnd={this.handleSortEnd}
            useDragHandle
          />
          <div className="bt b--light-silver" />
          <div className="bt bw1 b--light-silver w-100" style={{ marginTop: 'auto' }}>
            <div className="w-50 fl tc bw1 br b--light-silver">
              <Button disabled={true} variation="tertiary">
                undo (i18n)
              </Button>
            </div>
            <div className="w-50 fl tc">
              <Button
                isLoading={isLoadingMutation}
                variation="tertiary"
                onClick={this.handleOpenSaveChangesModal}
              >
                {intl.formatMessage({
                  id: 'pages.editor.component-list.save.button',
                })}
              </Button>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }

  private handleEdit = (event: React.MouseEvent<HTMLDivElement>) => {
    const { editor, highlightHandler } = this.props

    const treePath = event.currentTarget.getAttribute('data-tree-path')

    editor.editExtensionPoint(treePath)

    highlightHandler(null)
  }

  private handleOpenSaveChangesModal = () => {
    this.setState({
      cancelMessageId: 'pages.editor.component-list.modal.button.cancel',
      handleCancelModal: this.handleCloseModal,
      handleCloseModal: this.handleCloseModal,
      handleConfirmModal: this.handleSaveReorder,
      isModalOpen: true,
    })
  }

  private handleCloseModal = () => {
    this.setState({
      cancelMessageId: 'pages.editor.component-list.modal.button.cancel',
      handleCancelModal: noop,
      handleCloseModal: noop,
      handleConfirmModal: noop,
      isModalOpen: false,
    })
  }

  private handleSaveReorder = async () => {
    const { iframeRuntime, intl, saveExtension } = this.props

    const iframeWindow = (document.getElementById(
      'store-iframe',
    ) as HTMLIFrameElement).contentWindow

    const iframeCurrentPage = iframeRuntime.page
    const extension = iframeRuntime.extensions[iframeCurrentPage]
    const configurationId = path(['configurationIds', 0])(extension)
    let toastMessage = ''

    try {
      if (iframeWindow === null) {
        throw new Error('iframeWindow is null')
      }

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

      toastMessage = intl.formatMessage({ id: 'pages.editor.component-list.save.success' })
    } catch (e) {
      toastMessage = intl.formatMessage({ id: 'pages.editor.component-list.save.error' })
    } finally {
      this.handleCloseModal()
      this.setState({
        isLoadingMutation: false,
      })

      this.props.showToast(toastMessage)

    }
  }

  private handleSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
    const firstTargetParentTreePath = getParentTreePath(
      this.state.components[oldIndex].treePath,
    )
    const secondTargetParentTreePath = getParentTreePath(
      this.state.components[newIndex].treePath,
    )

    const firstTargetName = last(
      this.state.components[oldIndex].treePath.split('/'),
    )
    const secondTargetName = last(
      this.state.components[newIndex].treePath.split('/'),
    )

    const isSameTree = firstTargetParentTreePath === secondTargetParentTreePath
    const isChangingSameExtensionPoint = firstTargetName === secondTargetName

    if (isSameTree && !isChangingSameExtensionPoint) {
      const extension: Extension = this.props.iframeRuntime.extensions[
        firstTargetParentTreePath
      ]

      const firstTargetIndex = findIndex(
        equals(firstTargetName),
        extension.props.elements,
      )
      const secondTargetIndex = findIndex(
        equals(secondTargetName),
        extension.props.elements,
      )

      const newOrder = arrayMove(
        extension.props.elements,
        firstTargetIndex,
        secondTargetIndex,
      )

      this.props.iframeRuntime.updateExtension(firstTargetParentTreePath, {
        ...extension,
        props: {
          ...extension.props,
          elements: newOrder,
        },
      })

      this.setState({
        components: arrayMove(this.state.components, oldIndex, newIndex),
      })
    }
  }
}

export default compose(
  injectIntl,
  graphql(SaveExtension, { name: 'saveExtension' }),
)(SortableList)
