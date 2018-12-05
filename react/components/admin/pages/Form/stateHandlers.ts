import { State } from './index'
import { ClientSideUniqueId, PageWithUniqueId } from './typings'

const getMaxUniqueId: (pages: PageWithUniqueId[]) => number = pages => {
  return pages.reduce((acc, { uniqueId: currentValue }) => {
    if (acc < currentValue) {
      return currentValue
    }
    return acc
  }, -1)
}

export const getLoginToggleState = (prevState: State) => ({
  ...prevState,
  data: {
    ...prevState.data,
    login: !!prevState.data && !prevState.data.login,
  },
})

export const getAddConditionalTemplateState = (prevState: State) => {
  const maxUniqueId = getMaxUniqueId(prevState.data.pages as PageWithUniqueId[])
  const newPage: Page & ClientSideUniqueId = {
    allMatches: false,
    conditions: [],
    configurationId: '',
    declarer: null,
    device: '',
    name: '',
    params: {},
    template: '',
    uniqueId: maxUniqueId + 1,
  }
  return {
    ...prevState,
    data: { ...prevState.data, pages: prevState.data.pages.concat(newPage) },
    formErrors: {},
  }
}

export const getRemoveConditionalTemplateState = (uniqueId: number) => (
  prevState: State,
) => {
  const newPages = (prevState.data.pages as PageWithUniqueId[]).filter(
    page => page.uniqueId !== uniqueId,
  )
  return {
    ...prevState,
    data: { ...prevState.data, pages: newPages },
    formErrors: {},
  }
}

export const getChangeTemplateConditionalTemplateState = (
  uniqueId: number,
  template: string,
) => (prevState: State) => {
  const newPages = (prevState.data.pages as PageWithUniqueId[]).map(page => {
    if (page.uniqueId === uniqueId) {
      return {
        ...page,
        template,
      }
    }
    return page
  })
  return {
    ...prevState,
    data: {
      ...prevState.data,
      pages: newPages,
    },
    formErrors: {},
  }
}

export const getChangeConditionsConditionalTemplateState = (
  uniqueId: number,
  conditions: string[],
) => (prevState: State) => {
  const newPages = (prevState.data.pages as PageWithUniqueId[]).map(page => {
    if (page.uniqueId === uniqueId) {
      return {
        ...page,
        conditions,
      }
    }
    return page
  })
  return {
    ...prevState,
    data: {
      ...prevState.data,
      pages: newPages,
    },
    formErrors: {},
  }
}

const requiredMessage = 'pages.admin.pages.form.templates.field.required'

const validateFalsyPath = (path: keyof Route) => (data: Route) =>
  !data[path] && { [path]: requiredMessage }

const validateConditionalTemplates = (data: Route) => {
  return (data.pages as PageWithUniqueId[]).reduce(
    (acc, { uniqueId, template, conditions }) => {
      const templateError = !template && { template: requiredMessage }
      const conditionsError = !conditions.length && {
        conditions: requiredMessage,
      }
      if (templateError || conditionsError) {
        acc.pages = {
          ...acc.pages,
          [uniqueId]: {
            ...templateError,
            ...conditionsError,
          },
        }
      }
      return acc
    },
    {} as any,
  )
}

export const getValidateFormState = (prevState: State) => {
  return {
    ...prevState,
    formErrors: {
      ...prevState.formErrors,
      ...validateFalsyPath('path')(prevState.data),
      ...validateFalsyPath('template')(prevState.data),
      ...validateFalsyPath('title')(prevState.data),
      ...validateConditionalTemplates(prevState.data),
    },
  }
}
