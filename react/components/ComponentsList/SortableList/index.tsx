import { equals, findIndex, last, path } from 'ramda'
import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { arrayMove, SortEndHandler } from 'react-sortable-hoc'
import { Button, ToastConsumerRenderProps } from 'vtex.styleguide'

import SaveExtension from '../../../queries/SaveExtension.graphql'
import { NormalizedComponent, SidebarComponent } from '../typings'
import List from './List'
import { getParentTreePath, normalizeComponents } from './utils'

interface CustomProps {
  components: SidebarComponent[]
  editor: EditorContext
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContextProps['runtime']
  onMouseEnterComponent: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeaveComponent: () => void
  saveExtension: any
}

type Props = CustomProps & ToastConsumerRenderProps & InjectedIntlProps

interface State {
  components: NormalizedComponent[]
  initialComponents: SidebarComponent[]
  loadingMutation: boolean
}

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
      components: normalizeComponents(props.components),
      initialComponents: props.components,
      loadingMutation: false,
    }
  }

  public render() {
    const { onMouseEnterComponent, onMouseLeaveComponent, intl } = this.props
    const { loadingMutation } = this.state
    return (
      <Fragment>
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
          <div className="bt bw1 b--light-silver" style={{ marginTop: 'auto' }}>
            <Button disabled={true} variation="tertiary">
              undo (i18n)
            </Button>
            <Button
              isLoading={loadingMutation}
              variation="tertiary"
              onClick={this.handleSaveReorder}
            >
              {intl.formatMessage({
                id: 'pages.editor.component-list.save.button',
              })}
            </Button>
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
      'store-iframe',
    ) as HTMLIFrameElement).contentWindow as Window

    const iframeCurrentPage = iframeRuntime.page
    const extension = iframeRuntime.extensions[iframeCurrentPage]
    const configurationId = path(['configurationIds', 0])(extension)

    try {
      this.setState({
        loadingMutation: true,
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
        loadingMutation: false,
      })

      this.props.showToast(
        intl.formatMessage({ id: 'pages.editor.component-list.save.success' }),
      )
    } catch (e) {
      this.props.showToast(
        intl.formatMessage({ id: 'pages.editor.component-list.save.error' }),
      )
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
