import React, { Component } from 'react'
import PropTypes from 'prop-types'

// eslint-disable-next-line
class EmptyExtensionPoint extends Component {
  static contextTypes = {
    editMode: PropTypes.bool,
    emitter: PropTypes.object,
    getEditMode: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      editMode: context.editMode,
    }
  }

  update = (state) => {
    this.setState(state)
  }

  subscribeToEditor = () => {
    const { emitter } = this.context
    emitter.addListener('editor:update', this.update)
  }

  unsubscribeToEditor = () => {
    const { emitter } = this.context
    emitter.removeListener('editor:update', this.update)
  }

  componentDidMount() {
    this.subscribeToEditor()
  }

  componentWillUnmount() {
    this.unsubscribeToEditor()
  }

  render() {
    const { getEditMode } = this.context
    const editMode = getEditMode()
    const className = `${editMode ? 'pa7-ns pa5 mw7 center' : 'dn'}`

    return (
      <div className={className}>
        <div className="w-100 ba b--blue br2 b--dashed pa6-ns pa6 blue tc bg-washed-blue bw1">
          This is an empty extension point
          <div className="fw7 pt2">CLICK TO EDIT</div>
        </div>
      </div>
    )
  }
}

EmptyExtensionPoint.schema = {
  type: 'object',
  properties: {},
}

export default EmptyExtensionPoint
