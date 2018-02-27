import React, {Component} from 'react'
import PropTypes from 'prop-types'

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
    const className = `${editMode ? 'ba b--silver b--dashed mv6 pv6 tc' : 'dn'}`

    return (
      <div className={className}>
        <div className="fw3 f3">This is an empty extension point</div>
        <div className="fw7 f6 pt4">Click to add a component</div>
      </div>
    )
  }
}

EmptyExtensionPoint.schema = {
  type: 'object',
  properties: {},
}

export default EmptyExtensionPoint
