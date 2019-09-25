import { RouteFormData } from 'pages'
import { State } from './index'

import { slugify } from '../../../helpers'

const requiredMessage = 'admin/pages.admin.pages.form.templates.field.required'

const validateFalsyPath = (path: keyof RouteFormData) => (
  data: RouteFormData
) => !data[path] && { [path]: requiredMessage }

const validatePathUrl = (path: string) => {
  if (!path) return { path: requiredMessage }
  if (!path.startsWith('/'))
    return {
      path: 'admin/pages.admin.pages.form.templates.path.validation-error',
    }
  if (slugify(path) !== path.slice(1))
    return {
      path: 'admin/pages.admin.pages.form.templates.path.invalid-format',
    }

  return {}
}

export const getValidateFormState = (prevState: State) => {
  return {
    ...prevState,
    formErrors: {
      ...prevState.formErrors,
      ...(validatePathUrl(prevState.data.path) as Record<string, string>),
      ...(prevState.isInfoEditable
        ? validateFalsyPath('title')(prevState.data)
        : {}),
    },
  }
}
