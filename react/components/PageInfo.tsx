import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {FormattedMessage} from 'react-intl'

class PageInfo extends Component<{} & RenderContextProps & EditorContextProps> {
  public static propTypes = {
    page: PropTypes.string,
    pages: PropTypes.object,
  }

  public render() {
    const { runtime: { page } } = this.props

    return (
      <div>
        <h3><FormattedMessage id="pages.editor.info.title"/></h3>
        <FormattedMessage id="pages.editor.info.page"/>: <span>{page}</span>
      </div>
    )
  }
}

export default PageInfo
