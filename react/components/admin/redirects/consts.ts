export const BASE_URL = '/admin/app/cms/redirects'
export const CSV_SEPARATOR = ';'

export const getCSVHeader = (hasMultipleBindings: boolean) =>
  hasMultipleBindings ? 'from;to;type;binding;endDate' : 'from;to;type;endDate'

const CSV_SINGLE_BINDING_TEMPLATE = `/temporary;/;TEMPORARY;
/temporary-with-date;/;TEMPORARY;2025-01-01T00:00:00.000Z;
/permanent;/;PERMANENT;
`
const CSV_MULTIPLE_BINDING_TEMPLATE = `/temporary;/;TEMPORARY;
/temporary-with-date;/;TEMPORARY;1234_binding_id;2025-01-01T00:00:00.000Z;
/permanent;/;PERMANENT;123_binding_id;
`

export const getCSVTemplate = (hasMultipleBindings: boolean) =>
  `${getCSVHeader(hasMultipleBindings)}
    ${
      hasMultipleBindings
        ? CSV_MULTIPLE_BINDING_TEMPLATE
        : CSV_SINGLE_BINDING_TEMPLATE
    }`

export const NEW_REDIRECT_ID = 'new'

export const PAGINATION_START = 0
export const PAGINATION_STEP = 5
export const REDIRECTS_LIMIT = 500

export const WRAPPER_PATH = 'redirects'
