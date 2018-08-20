import React, { Component } from 'react'
import { canUseDOM } from 'render'

import { getIframeImplementation } from '../../utils/components'

import ComponentButton from './ComponentButton'

interface Props extends EditorContextProps, RenderContextProps {
  highlightExtensionPoint: (treePath: string | null) => void
}

class ComponentsList extends Component<Props> {
  public render() {
    const { runtime } = this.props

    return (
      <div>
        <div className="bb b--light-silver" />
        {Object.keys(runtime.extensions)
          .filter(this.validateExtension)
          .sort(this.sortComponents)
          .map(treePath => {
            const schema = this.getSchema(treePath)
            const title = schema && schema.title

            return (
              title && (
                <ComponentButton
                  onEdit={this.handleEdit}
                  onMouseEnter={this.handleMouseEnter}
                  onMouseLeave={this.handleMouseLeave}
                  title={title}
                  treePath={treePath}
                />
              )
            )
          })}
      </div>
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

  private getSchema(treePath: string) {
    const {
      runtime: { extensions },
    } = this.props

    const { component, props = {} } = extensions[treePath]

    return getComponentSchema(component, props)
  }

  private handleEdit = (event: any) => {
    const treePath = event.currentTarget.getAttribute('data-tree-path')

    this.props.editor.editExtensionPoint(treePath as string)
    this.props.highlightExtensionPoint(null)
  }

  private handleMouseEnter = (event: any) => {
    const treePath = event.currentTarget.getAttribute('data-tree-path')

    this.props.highlightExtensionPoint(treePath as string)
  }

  private handleMouseLeave = () => {
    this.props.highlightExtensionPoint(null)
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

    const schema = this.getSchema(treePath)

    return (
      schema &&
      schema.title &&
      !isDifferentPage(treePath, page, Object.keys(pages))
    )
  }
}

const getComponentSchema = (component: string | null, props: any) => {
  const ComponentImpl = component && getIframeImplementation(component)

  return (
    ComponentImpl &&
    ((ComponentImpl.hasOwnProperty('schema') && ComponentImpl.schema) ||
      (ComponentImpl.getSchema && ComponentImpl.getSchema(props)))
  )
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

export default ComponentsList
