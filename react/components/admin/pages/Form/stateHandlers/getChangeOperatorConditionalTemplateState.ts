import { ConditionsProps } from 'vtex.styleguide'
import { State } from '../index'

export const getChangeOperatorConditionalTemplateState = (
  uniqueId: number,
  operator: ConditionsProps['operator']
) => (prevState: State) => {
  const newPages = prevState.data.pages.map(page => {
    if (page.uniqueId === uniqueId) {
      return {
        ...page,
        condition: {
          ...page.condition,
          allMatches: operator === 'all',
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
