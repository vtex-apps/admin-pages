import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { canUseDOM } from 'render'

import { getIframeImplementation } from '../utils/components'

interface Props {
  highlightExtensionPoint: (treePath: string | null) => void
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
      runtime: { extensions },
    } = this.props

    return (
      <div>
        <div className="bb b--light-silver" />
        {Object.keys(extensions)
          .filter(this.validateExtension)
          .sort(this.sortComponents)
          .map(this.renderComponentButton)}
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

  private renderComponentButton = (treePath: string) => {
    const schema = this.getSchema(treePath)
    return (
      <button
        key={treePath}
        type="button"
        data-tree-path={treePath}
        onClick={this.onEdit}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        className={
          'dark-gray bg-white pt5 pointer hover-bg-light-silver w-100 tl bn ph0 pb0'
        }
        style={{ animationDuration: '0.2s' }}
      >
        <div className="bb b--light-silver w-100 pb5">
          <span className="f6 fw5 pl5 track-1">
            {schema && schema.title && <FormattedMessage id={schema.title} />}
          </span>
        </div>
      </button>
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

  private validateExtension = (treePath: string) => {
    const {
      runtime: { pages, page },
    } = this.props

    const schema = this.getSchema(treePath)

    return (
      schema &&
      schema.title &&
      (!isDifferentPage(treePath, page, Object.keys(pages)) ||
        /^store\/(header|footer)(\/.+)?$/.test(treePath))
    )
  }
}

export default ComponentsList
