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
      <div className="near-black f5 mb5">
        <h3 className="mt0 mb5 bb b--light-silver pa5"><FormattedMessage id="pages.editor.info.title"/></h3>
        <span className="pl5"><FormattedMessage id="pages.editor.info.page"/></span>: <span>{page}</span>
      </div>
    )
  }
}

export default PageInfo
