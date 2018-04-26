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
    const className = `${editMode ? 'ma7-ns ma4' : 'dn'}`

    return (
      <div className={className}>
        <div className="w-100 ba b--blue br9 b--dashed pa6-ns pa4 blue w7">
          Isso é um empty extension point
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
