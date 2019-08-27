import { useKeydownFromClick } from 'keydown-from-click'
import React from 'react'
import { withRuntimeContext } from 'vtex.render-runtime'
import { IconEdit } from 'vtex.styleguide'

import { INSTITUTIONAL_ROUTES_FORM } from '../../pages/consts'
import { getRouteTitle } from '../../pages/utils'

interface Props {
  route: Route
  runtime: RenderContext
}

const Entry = ({ route, runtime }: Props) => {
  const handleClick = React.useCallback(() => {
    runtime.navigate({
      page: INSTITUTIONAL_ROUTES_FORM,
      params: { id: encodeURIComponent(route.routeId) },
    })
  }, [route.routeId, runtime])

  const handleKeyDown = useKeydownFromClick(handleClick)

  return (
    <div className="flex justify-between items-center">
      <div className="f6">{getRouteTitle(route)}</div>
      <div
        className="flex pointer outline-0"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <IconEdit color="silver" />
      </div>
    </div>
  )
}

export default withRuntimeContext(Entry)
