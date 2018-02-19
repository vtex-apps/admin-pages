import Toggle from '@vtex/styleguide/lib/Toggle'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import ComponentEditor from './components/ComponentEditor'

// eslint-disable-next-line
export default class EditBar extends Component {
  static propTypes = {
    editTreePath: PropTypes.string,
    toggleEditMode: PropTypes.func,
  }

  handleClick = () => {
    this.props.toggleEditMode()
  }

  render() {
    const {editTreePath, toggleEditMode, editMode } = this.props
    return (
      <div className="fixed z-999 bg-white br2 shadow-4 pa5" style={{top: '30px', right: '30px'}}>
        {editTreePath == null &&
          <div className="flex items-center">
            <label htmlFor="toggle1" className="pr4 pl2">Edit Mode</label>
            <Toggle semantic id='toggle1' checked={editMode} onClick={this.handleClick} />
          </div>
        }
        {editTreePath && <ComponentEditor editTreePath={editTreePath} />}
      </div>
    )
  }
}
