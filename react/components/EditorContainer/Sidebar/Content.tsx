import React, { Component } from 'react'
import { canUseDOM } from 'render'
import { Spinner } from 'vtex.styleguide'

import { getIframeImplementation } from '../../../utils/components'

import ComponentSelector from './ComponentSelector'
import ConfigurationList from './ConfigurationList'
import { SidebarComponent } from './typings'

interface Props {
  editor: EditorContext
  highlightHandler: (treePath: string | null) => void
  runtime: RenderContext
}

class Content extends Component<Props> {
  public render() {
    const { editor, highlightHandler, runtime } = this.props

    if (!runtime) {
      return (
        <div className="mt5 flex justify-center">
          <Spinner />
        </div>
      )
    }

    return editor.editTreePath === null ? (
      <ComponentSelector
        components={this.getComponents(runtime)}
        editor={editor}
        highlightHandler={highlightHandler}
      />
    ) : (
      <ConfigurationList editor={editor} runtime={runtime} />
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

  private getComponents(runtime: RenderContext) {
    return Object.keys(runtime.extensions)
      .filter(this.isValidExtension)
      .sort(this.sortComponents)
      .map<SidebarComponent>(treePath => ({
        name: this.getComponentSchema(treePath)!.title!,
        treePath,
      }))
  }

  private isValidExtension = (treePath: string) => {
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

export default Content
