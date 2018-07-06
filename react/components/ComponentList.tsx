import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { NoSSR } from 'render'

import CloseIcon from '../images/CloseIcon.js'
import EditIcon from '../images/EditIcon.js'

class ComponentList extends Component<{} & RenderContextProps & EditorContextProps> {
  public static propTypes = {
    page: PropTypes.string,
    pages: PropTypes.object,
  }

  public render() {
    const { runtime: { extensions } } = this.props

    return (
      <NoSSR>
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
            {this.props.editor.editMode ? 'Stop editing' : 'Start editing'}
          </span>
        </button>
        <div className="pa4">Components on this page:</div>
        {JSON.stringify(Object.keys(extensions))}
      </NoSSR>
    )
  }
}

export default ComponentList
