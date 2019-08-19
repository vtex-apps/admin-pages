import { useKeydownFromClick } from 'keydown-from-click'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { RouteComponentProps, withRouter } from 'react-router-dom'

interface Props extends RouteComponentProps {
  path: string
  titleId: string
  widget?: React.ReactNode
}

const AvailableEditor: React.FunctionComponent<Props> = ({
  history,
  path,
  titleId,
  widget,
}) => {
  const redirect = React.useCallback(() => history.push(path), [history, path])

  const redirectByKeyDown = useKeydownFromClick(redirect)

  return (
    <div
      className="pointer flex justify-between items-center pv6 bb b--muted-4"
      onClick={redirect}
      onKeyDown={redirectByKeyDown}
    >
      <span className="f4">
        <FormattedMessage id={titleId} />
      </span>
      {widget}
    </div>
  )
}

export default withRouter(AvailableEditor)
