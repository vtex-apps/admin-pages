import React from 'react'
import { withRuntimeContext } from 'render'
import { IconEdit } from 'vtex.styleguide'

interface Props {
  route: Route
  runtime: RenderContext
}

const Entry = ({ route, runtime }: Props) => {
  const routeName = route.id.split('store/')[1]
  const capitalizedRouteName =
    routeName.charAt(0).toUpperCase() + routeName.slice(1)

  return (
    <div className="flex justify-between items-center">
      <div className="f6">{capitalizedRouteName}</div>
      <div
        className="flex pointer"
        onClick={() => {
          runtime.navigate({
            page: 'admin/cms/page-detail',
            params: { id: route.id },
          })
        }}
      >
        <IconEdit color="silver" />
      </div>
    </div>
  )
}

export default withRuntimeContext(Entry)
