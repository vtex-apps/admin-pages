import Toggle from '@vtex/styleguide/lib/Toggle'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import '../theme.css'

// eslint-disable-next-line
export default class EditToggle extends Component {
  static propTypes = {
    editTreePath: PropTypes.string,
    editMode: PropTypes.bool,
    toggleEditMode: PropTypes.func,
    page: PropTypes.string,
  }

  handleClick = () => {
    this.props.toggleEditMode()
  }

  render() {
    const {editTreePath, editMode, page} = this.props
    return (
      <div className="fixed z-999 shadow-4 bg-white flex justify-between w-100 pv3 ph3 pv5-ns ph5-ns top-0">
        <div>
          <div className="f5 fw5 self-center ttu">
            {page}
          </div>
          <div className="f7 fw3 ttu pt2">
            {editTreePath ? `editing: ${editTreePath}` : 'click a component to start editing it'}
          </div>
        </div>
        <div className="flex items-center">
          <label htmlFor="toggle1" className="pr4 pl2">Edit Mode</label>
          <Toggle id="toggle1" checked={editMode} onClick={this.handleClick} />
        </div>
      </div>
    )
  }
}
