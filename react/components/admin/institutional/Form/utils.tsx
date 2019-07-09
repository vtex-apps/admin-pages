import { RouteFormData } from 'pages'

const requiredMessage = 'admin/pages.admin.pages.form.templates.field.required'

const validateFalsyPath = (path: keyof RouteFormData) => (
  data: RouteFormData
) => !data[path] && { [path]: requiredMessage }

const validateUrlBeginning = (path: string) => {
  if (path.startsWith('/')) {
    return {}
  }
  return {
    path: 'admin/pages.admin.pages.form.templates.path.validation-error',
  }
}

export const getValidateFormState = (prevState: any) => {
  return {
    ...prevState,
    formErrors: {
      ...prevState.formErrors,
      ...(validateUrlBeginning(prevState.data.path) as Record<string, string>),
      ...validateFalsyPath('path')(prevState.data),
      ...(prevState.isInfoEditable ? validateFalsyPath('title')(prevState.data) : {}),
    },
  }
}
