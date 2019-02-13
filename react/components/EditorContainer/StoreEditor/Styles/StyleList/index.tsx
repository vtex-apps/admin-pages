import React, { Component } from 'react'
import { compose, graphql, withApollo, WithApolloClient } from 'react-apollo'
import { ButtonWithIcon, Spinner } from 'vtex.styleguide'

import CreateStyle from './queries/CreateStyle.graphql'
import DeleteStyle from './queries/DeleteStyle.graphql'
import ListStyles from './queries/ListStyles.graphql'
import SaveSelectedStyle from './queries/SaveSelectedStyle.graphql'

import CreateNewIcon from './icons/CreateNewIcon'
import StyleCard from './StyleCard'

interface ListStylesQuery {
  listStyles: Style[]
  loading: boolean
  refetch: (variables?: object) => void
}

interface CustomProps {
  iframeWindow: Window
  listStylesQuery: ListStylesQuery
}

type Props = WithApolloClient<CustomProps>

class StyleList extends Component<Props, {}> {
  public render() {
    const {
      listStylesQuery: { listStyles, loading },
    } = this.props

    return loading ? (
      <div className="pt7 flex justify-around">
        <Spinner />
      </div>
    ) : (
      <div className="flex flex-column ph3 h-100">
        <div className="flex justify-between mv5 ml5 items-center">
          <span className="f3">Styles</span>
          <ButtonWithIcon
            icon={<CreateNewIcon />}
            variation="tertiary"
            onClick={() => this.createStyle()}
          >
            New
          </ButtonWithIcon>
        </div>
        <div className="flex flex-column flex-grow-1 overflow-scroll">
          {listStyles.map(style => (
            <StyleCard
              key={style.id}
              style={style}
              selectStyle={this.selectStyle}
              deleteStyle={this.deleteStyle}
              duplicateStyle={this.duplicateStyle}
            />
          ))}
        </div>
      </div>
    )
  }

  private selectStyle = async (style: Style) => {
    const {
      iframeWindow,
      client,
      listStylesQuery: { refetch },
    } = this.props

    const styleLinkElement =
      iframeWindow &&
      iframeWindow.document &&
      iframeWindow.document.getElementById('style_link')
    if (styleLinkElement) {
      styleLinkElement.setAttribute('href', style.path)
    }

    try {
      await client.mutate<{ saveSelectedStyle: BasicStyle }>({
        mutation: SaveSelectedStyle,
        variables: {
          id: style.id,
        },
      })
      refetch()
    } catch (err) {
      console.error(err)
    }
  }

  private deleteStyle = async (style: Style) => {
    // TODO: open a modal before deleting
    const {
      client,
      listStylesQuery: { refetch },
    } = this.props

    try {
      await client.mutate<{ deleteStyle: BasicStyle }>({
        mutation: DeleteStyle,
        variables: {
          id: style.id,
        },
      })
      refetch()
    } catch (err) {
      console.error(err)
    }
  }

  private duplicateStyle = async (style: Style) => {
    await this.createStyle(`Copy of ${style.name}`, style.config)
  }

  private createStyle = async (name?: string, config?: TachyonsConfig) => {
    const {
      client,
      listStylesQuery: { refetch },
    } = this.props

    try {
      await client.mutate<{ createStyle: BasicStyle }>({
        mutation: CreateStyle,
        variables: {
          config: config || {},
          name: name || 'Untitled',
        },
      })
      refetch()
    } catch (err) {
      console.error(err)
    }
  }
}

export default compose(
  graphql(ListStyles, { name: 'listStylesQuery' }),
  withApollo
)(StyleList)