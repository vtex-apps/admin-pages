import Toggle from '@vtex/styleguide/lib/Toggle'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

// eslint-disable-next-line
export default class EditToggle extends Component {
  static propTypes = {
    editTreePath: PropTypes.string,
    editMode: PropTypes.bool,
    toggleEditMode: PropTypes.func,
  }

  handleClick = () => {
    this.props.toggleEditMode()
  }

  render() {
    const {editTreePath, editMode} = this.props
    if (editTreePath) {
      return null
    }
    return (
      <div className="fixed z-999 bg-white br2 shadow-4 pa5" style={{top: '30px', right: '30px'}}>
        <div className="flex items-center">
          <label htmlFor="toggle1" className="pr4 pl2">Edit Mode</label>
          <Toggle semantic id="toggle1" checked={editMode} onClick={this.handleClick} />
        </div>
      </div>
    )
  }
}
