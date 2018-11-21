import React from 'react'
import { withRuntimeContext } from 'render'
import { IconEdit } from 'vtex.styleguide'

import { FORM_PATHNAME } from '../consts'
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
          page: FORM_PATHNAME,
          params: { id: route.id },
        })
      }}
    >
      <IconEdit color="silver" />
    </div>
  </div>
)

export default withRuntimeContext(Entry)
