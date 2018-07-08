import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import CloseIcon from '../images/CloseIcon.js'
import EditIcon from '../images/EditIcon.js'
import { getImplementation } from '../utils/components'

const getComponentSchema = (component: string, props: any) => {
  const ComponentImpl = component && getImplementation(component)
  return ComponentImpl
    && ((ComponentImpl.hasOwnProperty('schema') && ComponentImpl.schema)
    || (ComponentImpl.hasOwnProperty('getSchema') && ComponentImpl.getSchema(props)))
}

const isDifferentPage = (treePath: string, page: string, pages: string[]) => {
  if (treePath.startsWith(page)) {
    return false
  }

  const currentPageLevel = page.split('/').length
  const sameLevelPages = pages.filter((p: string) => p.split('/').length === currentPageLevel)
  return !!sameLevelPages.find((p: string) => treePath.startsWith(p))
}

class ComponentList extends Component<{} & RenderContextProps & EditorContextProps> {
  public static propTypes = {
    editor: PropTypes.object,
    runtime: PropTypes.object,
  }

  public onEdit = (event: any) => {
    const treePath = event.currentTarget.getAttribute('data-tree-path')
    this.props.editor.editExtensionPoint(treePath as string)
  }

  public handleMouseOver = (event: any) => {
    const treePath = event.currentTarget.getAttribute('data-tree-path')
    this.props.editor.mouseOverExtensionPoint(treePath as string)
  }

  public handleMouseOut = (event: any) => {
    this.props.editor.mouseOverExtensionPoint(null)
  }

  public renderComponentButton = (treePath: string) => {
    const { runtime: { extensions, page, pages } } = this.props
    const { component, props = {} } =  extensions[treePath]
    const schema = getComponentSchema(component, props)

    if (!schema || !schema.title || isDifferentPage(treePath, page, Object.keys(pages))) {
      return null
    }

    return (
      <button
        key={treePath}
        type="button"
        data-tree-path={treePath}
        onClick={this.onEdit}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        className={
          'bg-white pa4 bn pointer hover-bg-light-blue w-100 tl'
        }
        style={{ animationDuration: '0.2s' }}
      >
        <FormattedMessage id={schema.title}/>
      </button>
    )
  }

  public render() {
    const { runtime: { extensions } } = this.props

    return (
      <div>
        <h4><FormattedMessage id="pages.editor.components.title"/></h4>
        {Object.keys(extensions).map(this.renderComponentButton)}

        <button
          type="button"
          onClick={this.props.editor.toggleEditMode}
          className={
            'bg-blue br3 pa4 bn shadow-1 flex mv4 items-center justify-center pointer hover-bg-heavy-blue animated fadeIn'
          }
          style={{ animationDuration: '0.2s' }}
        >
          {this.props.editor.editMode ? <CloseIcon /> : <EditIcon />}
          <span className="white pl4">
            <FormattedMessage id="pages.editor.components.select"/>
          </span>
        </button>
      </div>
    )
  }
}

export default ComponentList
