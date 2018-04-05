import React, {Component} from 'react'
import PropTypes from 'prop-types'
import pageIcon from '../images/single.svg'
import editIcon from '../images/pen-01.svg'

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
      <div className="fixed top-0 left-0 z-max shadow-5 w-100 bg-white">
        {editMode
          ?
          <div className="flex items-center justify-between pv3 ph5">
            <div className="flex items-center">
              <div className="flex items-center">
                <img src={pageIcon} width={23} />
              </div>
              <div className="pl3">
                <div className="f7 fw5 ttu pt1">
                  {page}
                </div>
                <div className="f7 fw3 truncate pt1 pb1">
                  {editTreePath
                    ? `editing: ${editTreePath}`
                    : editMode
                      ? 'Click a component to edit it'
                      : ''}
                </div>
              </div>
            </div>
            <button onClick={this.handleClick} className="blue pr0">
              DONE
            </button>
          </div>
          :
          <button onClick={this.handleClick} className="bg-blue br-100 bn shadow-1 flex items-center justify-center z-max fixed bottom-1 bottom-2-ns right-1 right-2-ns" style={{ height: '56px', width: '56px' }}>
            <img src={editIcon} />
          </button>
        }
      </div>
    )
  }
}
