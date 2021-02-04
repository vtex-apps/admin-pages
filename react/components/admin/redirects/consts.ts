export const BASE_URL = '/admin/app/cms/redirects'
export const CSV_SEPARATOR = ';'

export const getCSVHeader = (hasMultipleBindings: boolean) =>
  hasMultipleBindings ? 'from;to;type;binding;endDate' : 'from;to;type;endDate'

export const getCSVTemplate = (hasMultipleBindings: boolean) =>
  `${getCSVHeader(hasMultipleBindings)}
/temporary;/;TEMPORARY;
/temporary-with-date;/;TEMPORARY;2025-01-01T00:00:00.000Z
/permanent;/;PERMANENT;
`

export const NEW_REDIRECT_ID = 'new'

export const PAGINATION_START = 0
export const PAGINATION_STEP = 10
export const REDIRECTS_LIMIT = 500

export const WRAPPER_PATH = 'redirects'
