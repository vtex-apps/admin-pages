import PropTypes from 'prop-types'
import { filter, flatten, init, last, sort } from 'ramda'
import React, { Component } from 'react'
import { compose, DataProps, graphql } from 'react-apollo'
import { Link } from 'render'
import { Button } from 'vtex.styleguide'

import EditorProvider from './EditorProvider'
import ShareIcon from './images/ShareIcon'
import AvailableConditions from './queries/AvailableConditions.graphql'
import AvailableTemplates from './queries/AvailableTemplates.graphql'
import Routes from './queries/Routes.graphql'


// eslint-disable-next-line
class PageEditor extends Component {
  public static propTypes = {
    children: PropTypes.element,
    data: PropTypes.object,
  }

  public static contextTypes = {
    prefetchPage: PropTypes.func,
    startLoading: PropTypes.func,
    stopLoading: PropTypes.func,
  }

  public componentDidMount() {
    this.toggleLoading()
  }

  public componentDidUpdate() {
    this.toggleLoading()
  }

  public toggleLoading = () => {
    this.context.stopLoading()
  }

  public render() {

    return (
      <div className="mw8 mr-auto ml-auto mv6 ph6">
        <EditorProvider>
          <iframe src="/" />
        </EditorProvider>
      </div>
    )
  }
}

export default PageEditor
