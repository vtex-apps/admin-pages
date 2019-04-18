import React from 'react'
import { InjectedIntl, injectIntl } from 'react-intl'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { EditorPath } from './StyleEditorRouter'

interface Props extends RouteComponentProps {
  intl: InjectedIntl
  path: string
  titleId: string
  widget?: React.ReactNode
}

const AvailableEditor: React.FunctionComponent<Props> = ({
  history,
  intl,
  path,
  titleId,
  widget,
}) => {
  const title = intl.formatMessage({ id: titleId })
  const redirect = () => history.push(path)
  return (
    <div
      className="pointer flex justify-between items-center pv6 bb b--muted-4"
      onClick={redirect}
    >
      <span className="f4">{title}</span>
      {widget}
    </div>
  )
}

export default withRouter(injectIntl(AvailableEditor))
