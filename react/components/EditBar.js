import React, { Component } from 'react'
import PropTypes from 'prop-types'
import pageIcon from '../images/single.svg'

import '../editbar.global.css'

// eslint-disable-next-line
export default class EditBar extends Component {
  static propTypes = {
    editTreePath: PropTypes.string,
    editMode: PropTypes.bool,
    onToggleEditMode: PropTypes.func,
    page: PropTypes.string,
  }

  componentDidMount() {
    document.getElementById('render-container').classList.add('edit-mode')
  }

  componentWillUnmount() {
    document.getElementById('render-container').classList.remove('edit-mode')
  }

  handleClick = () => {
    this.props.onToggleEditMode()
  }

  render() {
    const { editTreePath, editMode, page } = this.props
    return (
      <div className="fixed top-0 left-0 z-max shadow-5 w-100 bg-white">
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
      </div>
    )
  }
}
