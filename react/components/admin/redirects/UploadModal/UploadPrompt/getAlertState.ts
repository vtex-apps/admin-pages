import { defineMessages, IntlShape } from 'react-intl'

import { AlertState } from '../../typings'

interface GetAlertStateArgs {
  isSave: boolean
  failedRedirects: Redirect[]
  fileName: string
  intl: IntlShape
  mutation: (data: Redirect[] | string[]) => Promise<void>
  total: number
}

const messages = defineMessages({
  bulkUploadAllFailed: {
    defaultMessage: `We couldn't process all {lines} lines from file {fileName}. Please try again.`,
    id: 'admin/pages.admin.redirects.bulk.failed',
  },
  bulkUploadErrorButtonLabel: {
    defaultMessage: 'See errors',
    id: 'admin/pages.admin.redirects.bulk.failed.button',
  },
  bulkUploadPartial: {
    defaultMessage:
      'Import of file {fileName} was partially successful: {success} successful, {failed} failed.',
    id: 'admin/pages.admin.redirects.bulk.partial',
  },
  bulkUploadSuccess: {
    defaultMessage:
      'All done. {lines} lines were successfully processed from file "{fileName}"',
    id: 'admin/pages.admin.redirects.bulk.success',
  },
})

export function getAlertState({
  isSave,
  total,
  failedRedirects,
  intl,
  fileName,
  mutation,
}: GetAlertStateArgs): AlertState {
  if (failedRedirects.length > 0 && failedRedirects.length === total) {
    return {
      type: 'error',
      message: intl.formatMessage(messages.bulkUploadAllFailed, {
        fileName,
        lines: intl.formatNumber(total),
      }),
    }
  } else if (failedRedirects.length === 0) {
    return {
      type: 'success',
      message: intl.formatMessage(messages.bulkUploadSuccess, {
        fileName,
        lines: intl.formatNumber(total),
      }),
    }
  }
  return {
    type: 'warning',
    message: intl.formatMessage(messages.bulkUploadPartial, {
      fileName,
      success: intl.formatNumber(total - failedRedirects.length),
      failed: intl.formatNumber(failedRedirects.length),
    }),
    meta: {
      failedRedirects: failedRedirects,
      mutation,
      isSave,
    },
    action: {
      label: intl.formatMessage(messages.bulkUploadErrorButtonLabel),
    },
  }
}
