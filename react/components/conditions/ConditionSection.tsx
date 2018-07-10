import PropTypes from 'prop-types'
import { contains } from 'ramda'
import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

interface ConditionSectionProps {
  multiple?: boolean
  type: string
}

export default class ConditionSection extends Component<ConditionSectionProps & EditorConditionSection> {
  public static propTypes = {
    activeConditions: PropTypes.arrayOf(PropTypes.string),
    addCondition: PropTypes.func,
    conditions: PropTypes.arrayOf(PropTypes.object),
    multiple: PropTypes.bool,
    removeCondition: PropTypes.func,
    type: PropTypes.string,
  }

  public static defaultProps = {
    conditions: [],
    multiple: false,
  }

  public handleInputChange = (event: any) => {
    const {addCondition, removeCondition} = this.props
    const target = event.target
    const {checked, value} = target

    if (checked) {
      addCondition(value)
    } else if (removeCondition) {
      removeCondition(value)
    }
  }

  public renderConditions () {
    const { conditions, activeConditions, multiple} = this.props
    return conditions.map((c: Condition) => (
      <div key={c.id}>
        <input type={multiple ? 'checkbox' : 'radio'}
          id={`condition-${c.id}`}
          value={c.id}
          checked={contains(c.id, activeConditions)}
          onChange={this.handleInputChange}
           />
        <label htmlFor={`condition-${c.id}`}>
          <FormattedMessage id={c.message} />
        </label>
      </div>
    ))
  }

  public render() {
    const { type } = this.props

    return (
      <Fragment>
        <h4><FormattedMessage id={`pages.conditions.${type}.title`}/></h4>
        {this.renderConditions()}
      </Fragment>
    )
  }
}
