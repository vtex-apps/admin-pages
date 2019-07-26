import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import { Box, Button } from 'vtex.styleguide'

import { INSTITUTIONAL_ROUTES_FORM, NEW_ROUTE_ID } from '../../pages/consts'
import SeparatorWithLine from '../../pages/SeparatorWithLine'

import Entry from './Entry'

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
                page: INSTITUTIONAL_ROUTES_FORM,
                params: { id: NEW_ROUTE_ID },
              })
            }}
            size="small"
            variation="primary"
          >
            <FormattedMessage
              id="admin/pages.admin.pages.list.button.create"
              defaultMessage="Create New"
            />
          </Button>
        </div>
      )}
    </div>
    {routes.map(route => (
      <Fragment key={route.path}>
        <SeparatorWithLine />
        <Entry route={route} />
      </Fragment>
    ))}
  </Box>
)

export default withRuntimeContext(Section)
