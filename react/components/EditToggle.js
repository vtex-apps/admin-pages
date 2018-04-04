import Toggle from '@vtex/styleguide/lib/Toggle'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import pageIcon from '../images/single.svg'

import '../theme.css'

// eslint-disable-next-line
export default class EditToggle extends Component {
  static propTypes = {
    editTreePath: PropTypes.string,
    editMode: PropTypes.bool,
    toggleEditMode: PropTypes.func,
    page: PropTypes.string,
    hasEditableExtensionPoints: PropTypes.bool,
  }

  handleClick = () => {
    this.props.toggleEditMode()
  }

  render() {
    const {editTreePath, editMode, page, hasEditableExtensionPoints} = this.props
    return (
      <div className="fixed shadow-4 bg-white flex justify-between w-100 pv3 ph3 pv5-ns ph5-ns top-0 left-0 z-max near-black">
        <div className="flex">
          <div className="flex items-center pr3">
            <img width={28} src={pageIcon} />
          </div>
          <div className="flex items-center di-ns">
            <div className="f5-ns f7 fw5 ttu">
              {page}
            </div>
            <div className="f7 fw3 ttu pt2 truncate dn di-ns">
              {editTreePath
                ? `editing: ${editTreePath}`
                : editMode
                  ? 'click a component to edit it'
                  : 'Enable edit mode to start editing'}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <label htmlFor="toggle1" className="pr4 pl2">Edit Mode</label>
          <Toggle id="toggle1" disabled={!hasEditableExtensionPoints} checked={editMode} onClick={this.handleClick} />
        </div>
      </div>
    )
  }
}
