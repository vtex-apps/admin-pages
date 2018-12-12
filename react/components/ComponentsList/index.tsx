import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { canUseDOM } from 'render'
import { ToastConsumer, ToastProvider } from 'vtex.styleguide'

import { getIframeImplementation } from '../../utils/components'

import SortableList from './SortableList'
import { SidebarComponent } from './typings'

interface Props {
  highlightExtensionPoint: (treePath: string | null) => void
}

const isDifferentPage = (treePath: string, page: string, pages: string[]) => {
  if (treePath.startsWith(page)) {
    return false
  }

  const currentPageLevel = page.split('/').length
  const sameLevelPages = pages.filter(
    (p: string) => p.split('/').length === currentPageLevel,
  )
  return !!sameLevelPages.find((p: string) => treePath.startsWith(p))
}

class ComponentsList extends Component<
  Props & RenderContextProps & EditorContextProps
  > {
  public static propTypes = {
    editor: PropTypes.object,
    runtime: PropTypes.object,
  }

  public onEdit = (event: any) => {
    const treePath = event.currentTarget.getAttribute('data-tree-path')
    this.props.editor.editExtensionPoint(treePath as string)
    this.props.highlightExtensionPoint(null)
  }

  public handleMouseEnter = (event: any) => {
    const treePath = event.currentTarget.getAttribute('data-tree-path')
    this.props.highlightExtensionPoint(treePath as string)
  }

  public handleMouseLeave = () => {
    this.props.highlightExtensionPoint(null)
  }

  public render() {
    const {
      editor,
      highlightExtensionPoint,
      runtime: iframeRuntime,
    } = this.props

    return (
      <ToastProvider positioning="parent">
        <ToastConsumer>
          {({ showToast }) => (
            <SortableList
              components={this.getComponents()}
              editor={editor}
              iframeRuntime={iframeRuntime}
              highlightExtensionPoint={highlightExtensionPoint}
              onMouseEnterComponent={this.handleMouseEnter}
              onMouseLeaveComponent={this.handleMouseLeave}
              showToast={showToast}
            />
          )}
        </ToastConsumer>
      </ToastProvider>
    )
  }

  private getComponentElement = (treePath: string) => {
    const {
      editor: { iframeWindow },
    } = this.props

    if (!canUseDOM) {
      return undefined
    }

    return iframeWindow.document.querySelector(
      `[data-extension-point="${treePath}"]`,
    )
  }

  private getComponentSchema(treePath: string) {
    const {
      runtime: { extensions },
    } = this.props

    const { component, props = {} } = extensions[treePath]

    const ComponentImpl =
      (component && getIframeImplementation(component)) || undefined

    return (
      ComponentImpl &&
      ((ComponentImpl.hasOwnProperty('schema') && ComponentImpl.schema) ||
        (ComponentImpl.getSchema && ComponentImpl.getSchema(props)))
    )
}

  private getComponents() {
    const { runtime } = this.props

    return Object.keys(runtime.extensions)
      .filter(this.validateExtension)
      .sort(this.sortComponents)
      .map<SidebarComponent>(treePath => ({
        name: this.getComponentSchema(treePath)!.title!,
        treePath,
      }))
  }

  private sortComponents = (treePathA: string, treePathB: string) => {
    const componentA = this.getComponentElement(treePathA)

    if (!componentA) {
      return 1
    }

    const componentB = this.getComponentElement(treePathB)

    if (!componentB) {
      return -1
    }

    const { x: xA, y: yA } = componentA.getBoundingClientRect() as DOMRect
    const { x: xB, y: yB } = componentB.getBoundingClientRect() as DOMRect

    if (yA > yB || (yA === yB && xA > xB)) {
      return 1
    }

    return -1
  }

  private validateExtension = (treePath: string) => {
    const {
      runtime: { pages, page },
    } = this.props

    const schema = this.getComponentSchema(treePath)

    return (
      schema &&
      schema.title &&
      !isDifferentPage(treePath, page, Object.keys(pages))
    )
  }
}

export default ComponentsList
