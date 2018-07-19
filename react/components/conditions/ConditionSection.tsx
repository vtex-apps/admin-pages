import PropTypes from 'prop-types'
import { contains, map } from 'ramda'
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
    const { conditions, activeConditions, multiple, type, shouldEnable } = this.props

    return map(c => {
      const message = c.message || c.conditionId
      const id = c.id || c.conditionId

      return (
        <div className="dark-gray mb3" key={id}>
          <input className="mr3" type={multiple ? 'checkbox' : 'radio'}
            checked={contains(id, activeConditions)}
            disabled={(!shouldEnable && id==='site')?true:false}
            id={`condition-${id}`}
            name={type}
            onChange={this.handleInputChange}
            value={id}
              />
          <label htmlFor={`condition-${id}`}>
            <FormattedMessage id={message} />
          </label>
        </div>
      )
    }, conditions)
  }

  public render() {
    const { type } = this.props

    return (
      <Fragment>
        <h4 className="near-black f5 fw5 mt0 mb5"><FormattedMessage id={`pages.conditions.${type}.title`}/></h4>
        {this.renderConditions()}
      </Fragment>
    )
  }
}
