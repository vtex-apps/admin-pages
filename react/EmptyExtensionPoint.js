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
    const className = `${editMode ? 'w-100 flex items-center ph4 ph6-ns absolute pointer w2 h2 z-999' : 'dn'}`

    return (
      <div className={className}>
        <div className="br-100 bg-blue w2 h2 f4 white flex items-center justify-center flex-none">
          +
        </div>
        <div className="bb b--blue bw1 w-100 empty-line bw2 br-pill nl5">
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
