import PropTypes from 'prop-types'
import { contains, map } from 'ramda'
import React, { Component, Fragment } from 'react'
import { FormattedMessage, injectIntl, intlShape  } from 'react-intl'
import { Radio, Checkbox } from 'vtex.styleguide'

interface ConditionSectionProps {
  multiple?: boolean
  type: string
}

class ConditionSection extends Component<ConditionSectionProps & EditorConditionSection> {
  public static propTypes = {
    activeConditions: PropTypes.arrayOf(PropTypes.string),
    addCondition: PropTypes.func,
    conditions: PropTypes.arrayOf(PropTypes.object),
    multiple: PropTypes.bool,
    removeCondition: PropTypes.func,
    type: PropTypes.string,
    intl: intlShape.isRequired,
    shouldEnable: PropTypes.bool
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
          {
            multiple
            ? <Checkbox
                checked={contains(id, activeConditions)}
                id={`condition-${id}`}
                name={type}
                onChange={this.handleInputChange}
                value={id}
                label={this.props.intl.formatMessage({id: message})}
              />
            : <Radio
                checked={contains(id, activeConditions)}
                disabled={!shouldEnable && id === 'site'}
                id={`condition-${id}`}
                name={type}
                onChange={this.handleInputChange}
                value={id}
                label={this.props.intl.formatMessage({id: message})}
              />
          }
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

export default injectIntl(ConditionSection)
