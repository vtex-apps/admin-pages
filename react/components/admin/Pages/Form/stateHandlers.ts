import { compose, map, max, pathOr, pipe, reduce } from 'ramda'
export interface State {
  data: Route
  isLoading: boolean
}

export interface ClientSideUniqueId {
  uniqueId: number
}

type PageWithUniqueId = Page & ClientSideUniqueId

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
  }
}

export const getChangeTemplateConditionalTemplateState = (
  uniqueId: number,
  template: string,
) => (prevState: State) => {
  const newPages = (prevState.data.pages as PageWithUniqueId[]).map((page) => {
    if (page.uniqueId === uniqueId) {
      return {
        ...page,
        template
      }
    }
    return page
  })
  return {
    ...prevState,
    data: {
      ...prevState.data,
      pages: newPages
    }
  }
}

export const getChangeConditionsConditionalTemplateState = (
  uniqueId: number,
  conditions: string[],
) => (prevState: State) => {
  const newPages = (prevState.data.pages as PageWithUniqueId[]).map((page) => {
    if (page.uniqueId === uniqueId) {
      return {
        ...page,
        conditions
      }
    }
    return page
  })
  return {
    ...prevState,
    data: {
      ...prevState.data,
      pages: newPages
    }
  }
}