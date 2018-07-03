import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { NoSSR, RenderContextConsumer } from 'render'
import { Dropdown } from 'vtex.styleguide'

const dynamicPageRegex = new RegExp(/\/:/)

class ConditionSelector extends Component {
  static contextTypes = {
    activeCondition: PropTypes.object,
    onConditionSelection: PropTypes.func,
  }

  render() {
    const { activeCondition, onConditionSelection } = this.context

    return (
      <NoSSR>
        <RenderContextConsumer>
          {runtime => {
            const conditions = [
              {
                label: `All ${runtime.page} pages`,
                value: JSON.stringify({ name: '', params: {} }),
              },
              {
                label: 'Only this page',
                value: JSON.stringify({
                  name: 'path',
                  params: {
                    path: window.location.pathname,
                  },
                }),
              },
            ]

            const value = conditions.find(
              condition =>
                JSON.parse(condition.value).name === activeCondition.name,
            ).value

            const currPagePath = runtime.page
            const currPagePathTemplate = runtime.pages[currPagePath].path

            const isDynamicPage = dynamicPageRegex.exec(currPagePathTemplate)

            return (
              <div>
                <div className="pa4">Edit Context:</div>
                <Dropdown
                  disabled={!isDynamicPage}
                  label=""
                  onChange={e => {
                    onConditionSelection(JSON.parse(e.target.value))
                  }}
                  options={conditions}
                  value={value}
                />
              </div>
            )
          }}
        </RenderContextConsumer>
      </NoSSR>
    )
  }
}

export default ConditionSelector
