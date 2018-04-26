import React, {Component} from 'react'
import PropTypes from 'prop-types'

import EmptyPoint from './images/EmptyPoint.js'

// eslint-disable-next-line
class EmptyExtensionPoint extends Component {
  static contextTypes = {
    editMode: PropTypes.bool,
    emitter: PropTypes.object,
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
    const {emitter} = this.context
    emitter.addListener('editor:update', this.update)
  }

  unsubscribeToEditor = () => {
    const {emitter} = this.context
    emitter.removeListener('editor:update', this.update)
  }

  componentDidMount() {
    this.subscribeToEditor()
  }

  componentWillUnmount() {
    this.unsubscribeToEditor()
  }

  render() {
    const {editMode} = this.state
    const className = `${editMode ? 'flex items-center ph4 ph6-ns absolute pointer z-999 grow' : 'dn'}`

    return (
      <div className={className}>
        <div>
          <EmptyPoint />
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
