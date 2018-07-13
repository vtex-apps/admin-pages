import PropTypes from 'prop-types'
import { groupBy, prop } from 'ramda'
import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import ConditionSection from './ConditionSection'
import DeviceSwitcher from '../DeviceSwitcher';

const scopeConditions = [
  {
    id: 'url',
    message: 'pages.conditions.scope.url',
  },
  {
    id: 'route',
    message: 'pages.conditions.scope.route',
  },
  {
    id: 'template',
    message: 'pages.conditions.scope.template',
  },
  {
    id: 'site',
    message: 'pages.conditions.scope.site',
  },
]

const deviceConditions = [
  {
    id: 'any',
    message: 'pages.conditions.device.any',
  },
  {
    id: 'mobile',
    message: 'pages.conditions.device.mobile',
  },
  {
    id: 'desktop',
    message: 'pages.conditions.device.desktop',
  },
]

class ConditionSelector extends Component<{} & RenderContextProps & EditorContextProps> {
  public static propTypes = {
    page: PropTypes.string,
    pages: PropTypes.object,
  }

  public render() {
    const { editor: { conditions, activeConditions, addCondition, removeCondition, setScope, scope, setDevice}, runtime: { device } } = this.props

    return (
      <div className="near-black">
        <h3 className="bt bw1 b--light-silver pa5 mv0"><FormattedMessage id="pages.editor.conditions.title"/></h3>
        <div className="bt b--light-silver mb5"></div>
        <div className="dark-gray">
          <div className="pl5 mb5">
            <ConditionSection type="scope"
              conditions={scopeConditions as any}
              activeConditions={[scope]}
              addCondition={setScope as any}
              multiple={false}
              />
          </div>
          <div className="pl5 mb5">
            <ConditionSection type="device"
                conditions={deviceConditions as any}
                activeConditions={[device]}
                addCondition={setDevice as any}
                multiple={false}
                />
          </div>
          <div className="pl5 mb5">
            <ConditionSection type="custom"
              conditions={conditions}
              activeConditions={activeConditions}
              addCondition={addCondition}
              removeCondition={removeCondition}
              multiple={true}
              />
          </div>
        </div>
      </div>
    )
  }
}

export default ConditionSelector
