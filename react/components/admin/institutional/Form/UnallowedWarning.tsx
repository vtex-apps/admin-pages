import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, EmptyState } from 'vtex.styleguide'

const UnallowedWarning = () => (
  <EmptyState
    title={
      <FormattedMessage
        id="admin/pages.admin.content.not-supported.title"
        defaultMessage="This feature is not available :/"
      />
    }
  >
    <FormattedMessage id="admin/pages.admin.content.not-supported.description">
      {message => <p>{message}</p>}
    </FormattedMessage>
    <div className="pt5">
      <Button
        variation="secondary"
        size="small"
        href="https://github.com/vtex-apps/admin-pages/blob/master/docs/CONTENT_PAGE.md"
        target="_blank"
      >
        <FormattedMessage
          id="admin/pages.admin.content.not-supported.action"
          defaultMessage="See instructions"
        />
      </Button>
    </div>
  </EmptyState>
)

export default UnallowedWarning
