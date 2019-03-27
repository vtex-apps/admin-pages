import { RouteFormData } from 'pages'
import { State } from '../index'

const requiredMessage = 'pages.admin.pages.form.templates.field.required'

const validateFalsyPath = (path: keyof RouteFormData) => (
  data: RouteFormData
) => !data[path] && { [path]: requiredMessage }

const validateConditionalTemplates: (data: RouteFormData) => { pages?: {} } = (
  data: RouteFormData
) => {
  return data.pages.reduce(
    (acc, { uniqueId, condition, template }) => {
      const templateError = !template && { template: requiredMessage }
      const conditionError = !condition.statements.length && {
        condition: requiredMessage,
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
    {} as any
  )
}

export const getValidateFormState = (prevState: State) => {
  return {
    ...prevState,
    formErrors: {
      ...prevState.formErrors,
      ...validateFalsyPath('path')(prevState.data),
      ...validateFalsyPath('blockId')(prevState.data),
      ...(prevState.isInfoEditable
        ? validateFalsyPath('title')(prevState.data)
        : {}),
      ...validateConditionalTemplates(prevState.data),
    },
  }
}
