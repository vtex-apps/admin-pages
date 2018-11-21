import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { withRuntimeContext } from 'render'
import { Box, Button } from 'vtex.styleguide'

import { FORM_PATHNAME, NEW_ROUTE_ID } from '../consts'
import Entry from './Entry'
import EntrySeparator from './EntrySeparator'

interface Props {
  hasCreateButton?: boolean
  routes: Route[]
  runtime: RenderContext
  titleId: string
}

const Section = ({ hasCreateButton, routes, runtime, titleId }: Props) => (
  <Box>
    <div className="relative flex items-center">
      <FormattedMessage id={titleId}>
        {title => <div className="b">{title}</div>}
      </FormattedMessage>
      {hasCreateButton && (
        <div className="absolute right-0">
          <Button
            onClick={() => {
              runtime.navigate({
                page: FORM_PATHNAME,
                params: { id: NEW_ROUTE_ID },
              })
            }}
            size="small"
            variation="primary"
          >
            <FormattedMessage id="pages.admin.pages.list.button.create" />
          </Button>
        </div>
      )}
    </div>
    {routes.map(route => (
      <Fragment key={route.id}>
        <EntrySeparator />
        <Entry route={route} />
      </Fragment>
    ))}
  </Box>
)

export default withRuntimeContext(Section)
