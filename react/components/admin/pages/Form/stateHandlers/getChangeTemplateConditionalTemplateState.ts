import { State } from '../index'

export const getChangeTemplateConditionalTemplateState = (
  uniqueId: number,
  template: string
) => (prevState: State) => {
  const newPages = prevState.data.pages.map(page => {
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
