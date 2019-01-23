import { equals, findIndex, last, path } from 'ramda'
import React, { Component, Fragment } from 'react'
import { compose, graphql, MutationFn } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { arrayMove, SortEndHandler } from 'react-sortable-hoc'
import { Button, ToastConsumerRenderProps } from 'vtex.styleguide'

import SaveExtension from '../../../queries/SaveExtension.graphql'
import { SidebarComponent } from '../typings'

import SortableList from './SortableList'
import { NormalizedComponent } from './typings'
import { getParentTreePath, normalizeComponents } from './utils'

interface CustomProps {
  components: SidebarComponent[]
  editor: EditorContext
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContextProps['runtime']
  onMouseEnterComponent: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeaveComponent: () => void
  saveExtension: MutationFn
}

type Props = CustomProps & InjectedIntlProps & ToastConsumerRenderProps

interface State {
  components: NormalizedComponent[]
  initialComponents: SidebarComponent[]
  isLoadingMutation: boolean
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
      components: normalizeComponents(props.components),
      initialComponents: props.components,
      isLoadingMutation: false,
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

    const isSortable = editor.mode === 'layout'

    return (
      <Fragment>
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
              <Button disabled variation="tertiary">
                undo (i18n)
              </Button>
            </div>
            <div className="w-50 fl tc">
              <Button
                isLoading={this.state.isLoadingMutation}
                variation="tertiary"
                onClick={this.handleSaveReorder}
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

    editor.editExtensionPoint(treePath as string)

    highlightHandler(null)
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

      this.setState({
        isLoadingMutation: false,
      })

      this.props.showToast(
        intl.formatMessage({ id: 'pages.editor.component-list.save.success' })
      )
    } catch (e) {
      this.props.showToast(
        intl.formatMessage({ id: 'pages.editor.component-list.save.error' })
      )
    } finally {
      this.setState({
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

      this.setState({
        components: arrayMove(this.state.components, oldIndex, newIndex),
      })
    }
  }
}

export default compose(
  injectIntl,
  graphql(SaveExtension, { name: 'saveExtension' })
)(ComponentList)
