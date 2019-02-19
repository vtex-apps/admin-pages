import { ConditionsProps } from 'vtex.styleguide'
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
    auth: !!prevState.data && !prevState.data.auth,
  },
})

export const getAddConditionalTemplateState = (prevState: State) => {
  const maxUniqueId = getMaxUniqueId(prevState.data.pages as PageWithUniqueId[])
  const now = new Date()
  const newPage: Page & ClientSideUniqueId & { operator: 'all' | 'any' } = {
    condition: {
      allMatches: true,
      id: '',
      statements: [{subject: 'date', verb: 'is', objectJSON: JSON.stringify({date: now}), object: {date: now}, error: ''}]
    },
    operator: 'all',
    pageId: '',
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

export const getChangeOperatorConditionalTemplateState = (uniqueId: number, operator: ConditionsProps['operator']) => (
  prevState: State,
) => {
  const newPages = (prevState.data.pages as PageWithUniqueId[]).map(page => {
    if (page.uniqueId === uniqueId) {
      return {
        ...page,
        condition: {
          ...page.condition,
          allMatches: operator === 'all'
        },
        operator,
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

export const getChangeStatementsConditionalTemplate = (uniqueId: number, statements: any[]) => (
  prevState: State,
) => {
  const newPages = (prevState.data.pages as PageWithUniqueId[]).map(page => {
    if (page.uniqueId === uniqueId) {
      return {
        ...page,
        condition: {
          ...page.condition,
          statements
        },
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

const requiredMessage = 'pages.admin.pages.form.templates.field.required'

const validateFalsyPath = (path: keyof Route) => (data: Route) =>
  !data[path] && { [path]: requiredMessage }

const validateConditionalTemplates = (data: Route) => {
  return (data.pages as PageWithUniqueId[]).reduce(
    (acc, { uniqueId, condition, template }) => {
      const templateError = !template && { template: requiredMessage }
      const conditionsError = !condition.statements.length && {
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
      ...validateFalsyPath('blockId')(prevState.data),
      ...validateFalsyPath('title')(prevState.data),
      ...validateConditionalTemplates(prevState.data),
    },
  }
}
