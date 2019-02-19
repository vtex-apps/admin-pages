import { State } from '../index'

export const getRemoveConditionalTemplateState = (uniqueId: number) => (
  prevState: State
) => {
  const newPages = prevState.data.pages.filter(
    page => page.uniqueId !== uniqueId
  )
  return {
    ...prevState,
    data: { ...prevState.data, pages: newPages },
    formErrors: {},
  }
}
