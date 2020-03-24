import { defineMessages, IntlShape } from 'react-intl'

export function isRedirectType(obj: unknown): obj is Redirect {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'endDate' in obj &&
    'from' in obj &&
    'to' in obj &&
    'type' in obj &&
    typeof (obj as Record<string, string>).type === 'string'
  )
}

const messages = defineMessages({
  invalidTypeError: {
    defaultMessage:
      '[Line {line}] Invalid value "{type}" for redirect type. Allowed values are "PERMANENT" and "TEMPORARY".',
    id: 'admin/pages.admin.redirects.upload-modal.prompt.validation-error.type',
  },
})

export function validateRedirect(
  redirect: Redirect,
  line: number,
  intl: IntlShape
): string | undefined {
  const { type } = redirect
  return type.toUpperCase() !== 'PERMANENT' &&
    type.toUpperCase() !== 'TEMPORARY'
    ? intl.formatMessage(messages.invalidTypeError, {
        line,
        type,
      })
    : undefined
}
