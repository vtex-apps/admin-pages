import React, { Component } from 'react'
import PropTypes from 'prop-types'
import pageIcon from '../images/single.svg'
import checkIcon from '../images/check-2.svg'

import Button from '@vtex/styleguide/lib/Button'

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
      <div className="w-100 fixed z-max top-0 left-0 right-0 bg-white h-3em bb bw1 flex justify-between-m items-center b--light-silver shadow-solid-y">
        <div className="flex items-center justify-between ph5 w-100 bg-white animated fadeIn" style={{animationDuration: '0.2s'}}>
          <div className="flex items-center">
            <div className="flex items-center br b--light-silver bw1 h-3em pr5">
              <img src={pageIcon} width={23} />
            </div>
            <div className="pl3 flex-ns items-center pl5">
              <div className="f6 ttu fw7 pt1 pr5-ns">
                {page}
              </div>
              <div className="dn di-ns h-3em bl bw1 b--light-silver"></div>
              <div className="f7 f5-ns fw3 truncate pt1 pb1 pl5-ns">
                {editTreePath
                  ? `editing: ${editTreePath}`
                  : editMode
                    ? 'Click a component to edit it'
                    : ''}
              </div>
            </div>
          </div>
          <div className="h-3em nr5 bl b--light-silver bw1 flex items-center">
            <Button onClick={this.handleClick}>
              <div className="flex items-center">
                DONE
                <img src={checkIcon} className="pl3"/>
              </div>
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
