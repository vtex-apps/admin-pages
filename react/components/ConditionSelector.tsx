import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { NoSSR } from 'render'

const dynamicPageRegex = new RegExp(/\/:/)

class ConditionSelector extends Component<{} & RenderContextProps & EditorContextProps> {
  public static propTypes = {
    page: PropTypes.string,
    pages: PropTypes.object,
  }

  public render() {
    const { editor: { conditions, activeConditions } } = this.props

    return (
      <NoSSR>
        <h1 className="pa4">Edit context:</h1>
        {JSON.stringify(conditions)}
        {activeConditions}
      </NoSSR>
    )
  }
}

export default ConditionSelector
