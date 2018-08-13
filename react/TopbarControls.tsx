import React, {Fragment, PureComponent} from 'react'

import SelectionIcon from './images/SelectionIcon.js'
import ShowIcon from './images/ShowIcon.js'

interface State {
  editMode: boolean
}

export default class TopbarControls extends PureComponent<{}, State> {

  constructor(props: any) {
    super(props)

    this.state = {
      editMode: false,
    }
  }

  public handleToggleEditMode = () => {
    console.log('send event')
  }

  public handleToggleShowAdminControls = () => {
    console.log('send event')
  }

  public render() {
    return (
      <Fragment>
        <button
          type="button"
          onClick={this.handleToggleEditMode}
          className="bg-white bn link pl3 pv3 dn flex-ns items-center justify-center self-right z-max pointer animated fadeIn"
        >
          <span className="pr5 b--light-gray flex items-center"><SelectionIcon stroke={this.state.editMode ? '#368df7' : '#979899'} /></span>
        </button>
        <button
          type="button"
          onClick={this.handleToggleShowAdminControls}
          className="bg-white bn link pl3-ns pv3 flex items-center justify-center self-right z-max pointer animated fadeIn"
        >
          <span className="pr5 b--light-gray flex items-center"><ShowIcon /></span>
        </button>
      </Fragment>
    )
  }
}
