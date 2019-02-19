import { PagesFormData } from 'pages'
import { State } from '../index'

const getMaxUniqueId: (pages: PagesFormData[]) => number = pages => {
  return pages.reduce((acc, { uniqueId: currentValue }) => {
    if (acc < currentValue) {
      return currentValue
    }
    return acc
  }, -1)
}

export const getAddConditionalTemplateState = (
  prevState: Pick<State, 'data'>
) => {
  const maxUniqueId = getMaxUniqueId(prevState.data.pages)
  const now = new Date()
  const newPage: PagesFormData = {
    condition: {
      allMatches: true,
      id: '',
      statements: [
        {
          error: '',
          object: { date: now },
          subject: 'date',
          verb: 'is',
        },
      ],
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
