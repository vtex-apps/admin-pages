export const BASE_URL = '/admin/cms/redirects'
export const CSV_HEADER = 'from;to;type;endDate'
export const CSV_SEPARATOR = ';'

export const CSV_TEMPLATE = `${CSV_HEADER}
/temporary;/;TEMPORARY;
/temporary-with-date;/;TEMPORARY;2025-01-01T00:00:00.000Z
/permanent;/;PERMANENT;
`

export const NEW_REDIRECT_ID = 'new'

export const PAGINATION_START = 0
export const PAGINATION_STEP = 10

export const WRAPPER_PATH = 'redirects'
