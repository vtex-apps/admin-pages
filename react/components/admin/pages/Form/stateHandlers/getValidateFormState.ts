import { RouteFormData } from 'pages'

import { State } from '../index'

const REQUIRED_MESSAGE = 'admin/pages.admin.pages.form.templates.field.required'

const validateFalsyPath = (path: keyof RouteFormData) => (
  data: RouteFormData
) => !data[path] && { [path]: REQUIRED_MESSAGE }

const validateUrlBeginning = (path: string) => {
  if (path.startsWith('/')) {
    return {}
  }
  return {
    path: 'admin/pages.admin.pages.form.templates.path.validation-error',
  }
}

const validateConditionalTemplates: (data: RouteFormData) => { pages?: {} } = (
  data: RouteFormData
) => {
  return data.pages.reduce<Record<string, unknown>>(
    (acc, { uniqueId, condition, template }) => {
      const templateError = !template && { template: REQUIRED_MESSAGE }
      const conditionError = !condition.statements.length && {
        condition: REQUIRED_MESSAGE,
      }

      if (templateError || conditionError) {
        acc.pages = {
          ...acc.pages,
          [uniqueId]: {
            ...templateError,
            ...conditionError,
          },
        }
      }
      return acc
    },
    {}
  )
}

export const getValidateFormState = (prevState: State) => {
  return {
    ...prevState,
    formErrors: {
      ...prevState.formErrors,
      ...(validateUrlBeginning(prevState.data.path) as Record<string, string>),
      ...validateFalsyPath('path')(prevState.data),
      ...validateFalsyPath('blockId')(prevState.data),
      ...(prevState.isInfoEditable
        ? validateFalsyPath('title')(prevState.data)
        : {}),
      ...validateConditionalTemplates(prevState.data),
    },
  }
}
