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

const ComponentIcon = () => (<svg width="16px" height="16px" viewBox="0 0 16 16">
   <g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
       <g id="path-minus" stroke="#727273" stroke-width="1.4">
           <polyline id="Shape" points="0.5 7.5 0.5 5.5 2.5 5.5"></polyline>
           <path d="M0.5,11.531 L0.5,9.5" id="Shape"></path>
           <polyline id="Shape" points="2.5 15.5 0.5 15.5 0.5 13.5"></polyline>
           <path d="M6.5,15.5 L4.5,15.5" id="Shape"></path>
           <polyline id="Shape" points="10.5 13.5 10.5 15.5 8.5 15.5"></polyline>
           <path d="M10.5,9.5 L10.5,11.5" id="Shape"></path>
           <polyline id="Shape" points="8.5 5.5 10.5 5.5 10.5 7.5"></polyline>
           <path d="M4.5,5.5 L6.5,5.5" id="Shape"></path>
           <polyline id="Shape" points="5.5 3.5 5.5 0.5 15.5 0.5 15.5 10.5 12.5 10.5"></polyline>
       </g>
   </g>
</svg>)

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
            'dark-gray bg-white pt5 pointer hover-bg-light-silver w-100 tl bn ph0 pb0'
          }
          style={{ animationDuration: '0.2s' }}
        >
          <div className="bb b--light-silver w-100 pb5">
            <span className="pl5"><ComponentIcon/></span><span className="f6 fw5 pl5 track-1 ttu"><FormattedMessage id={schema.title}/></span>
          </div>
        </button>
    )
  }

  public render() {
    const { runtime: { extensions } } = this.props

    return (
      <div>
        <h3 className="near-black mv0 bt bw1 b--light-silver pa5"><FormattedMessage id="pages.editor.components.title"/></h3>
        <div className="bb b--light-silver"></div>
        {Object.keys(extensions).map(this.renderComponentButton)}

        <button
          type="button"
          onClick={this.props.editor.toggleEditMode}
          className={
            'bg-blue br3 pa5 bn shadow-1 flex mv4 items-center justify-center pointer hover-bg-heavy-blue animated fadeIn'
          }
          style={{ animationDuration: '0.2s' }}
        >
          {this.props.editor.editMode ? <CloseIcon /> : <EditIcon />}
          <span className="white pl5">
            <FormattedMessage id="pages.editor.components.select"/>
          </span>
        </button>
      </div>
    )
  }
}

export default ComponentList
