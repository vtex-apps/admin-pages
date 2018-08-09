import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import { getIframeImplementation } from '../utils/components'

const getComponentSchema = (component: string, props: any) => {
  const ComponentImpl = component && getIframeImplementation(component)
  return (
    ComponentImpl &&
    ((ComponentImpl.hasOwnProperty('schema') && ComponentImpl.schema) ||
      (ComponentImpl.hasOwnProperty('getSchema') &&
        ComponentImpl.getSchema(props)))
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

interface Props {
  highlightExtensionPoint: (treePath: string | null) => void
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

  public renderComponentButton = (treePath: string) => {
    const {
      runtime: { extensions, page, pages },
    } = this.props
    const { component, props = {} } = extensions[treePath]
    const schema = getComponentSchema(component, props)

    if (
      !schema ||
      !schema.title ||
      isDifferentPage(treePath, page, Object.keys(pages))
    ) {
      return null
    }

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
            <FormattedMessage id={schema.title} />
          </span>
        </div>
      </button>
    )
  }

  public render() {
    const {
      runtime: { extensions },
    } = this.props

    return (
      <div>
        <div className="bb b--light-silver" />
        {Object.keys(extensions).map(this.renderComponentButton)}
      </div>
    )
  }
}

export default ComponentsList
