import React from 'react'
import { withRuntimeContext } from 'vtex.render-runtime'
import { IconEdit } from 'vtex.styleguide'

import { ROUTES_FORM } from '../consts'
import { getRouteTitle } from '../utils'

interface Props {
  route: Route
  runtime: RenderContext
}

const Entry = ({ route, runtime }: Props) => (
  <div className="flex justify-between items-center">
    <div className="f6">{getRouteTitle(route)}</div>
    <div
      className="flex pointer"
      onClick={() => {
        runtime.navigate({
          page: ROUTES_FORM,
          params: { id: encodeURIComponent(route.routeId) },
        })
      }}
    >
      <IconEdit color="silver" />
    </div>
  </div>
)

export default withRuntimeContext(Entry)
