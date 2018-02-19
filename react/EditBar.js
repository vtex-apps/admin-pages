import Button from '@vtex/styleguide/lib/Button'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import ComponentEditor from './components/ComponentEditor'

// eslint-disable-next-line
export default class EditBar extends Component {
  static propTypes = {
    editTreePath: PropTypes.string,
    editMode: PropTypes.bool,
    toggleEditMode: PropTypes.func,
  }

  render() {
    const {editTreePath, toggleEditMode, editMode} = this.props
    return (
      <div className="mw6 center bg-near-white fixed br2 z-999" style={{top: '30px', right: '30px'}}>
        {editTreePath == null && <Button htmlProps={{onClick: toggleEditMode}} primary>
          Edit Mode {editMode ? 'On' : 'Off'}
        </Button>}
        {editTreePath && <ComponentEditor editTreePath={editTreePath} />}
      </div>
    )
  }
}
