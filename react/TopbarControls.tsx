import React, { Fragment, PureComponent } from 'react'

import SelectionIcon from './images/SelectionIcon'
import ShowIcon from './images/ShowIcon'

interface State {
  editMode: boolean
}

export default class TopbarControls extends PureComponent<{}, State> {
  public constructor(props: {}) {
    super(props)

    this.state = {
      editMode: false,
    }
  }

  public render() {
    return (
      <Fragment>
        <button
          type="button"
          className="bg-white bn link pl3 pv3 dn flex-ns items-center justify-center self-right z-max pointer animated fadeIn"
        >
          <span className="pr5 b--light-gray flex items-center">
            <SelectionIcon
              stroke={this.state.editMode ? '#368df7' : '#979899'}
            />
          </span>
        </button>
        <button
          type="button"
          className="bg-white bn link pl3-ns pv3 flex items-center justify-center self-right z-max pointer animated fadeIn"
        >
          <span className="pr5 b--light-gray flex items-center">
            <ShowIcon />
          </span>
        </button>
      </Fragment>
    )
  }
}
