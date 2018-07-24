import PropTypes from 'prop-types'
import { PureComponent } from 'react'

// Backwards compatibility, we can delete this file upon releasing the next render-runtime.
class EditableExtensionPoint extends PureComponent {
  public static propTypes = {
    children: PropTypes.node
  }

  public render() {
    return this.props.children
  }
}

export default EditableExtensionPoint
