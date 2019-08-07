import NEW_PAGE from './__fixtures__/newPage'
import BASE_STATE from './__fixtures__/state'
import { getRemoveConditionalTemplateState } from './getRemoveConditionalTemplateState'

describe('getRemoveConditionalTemplateState', () => {
  it('should remove the given page with the given uniqueId from "data.pages"', () => {
    const mockState = {
      ...BASE_STATE,
      data: {
        ...BASE_STATE.data,
        pages: [
          {
            ...NEW_PAGE,
            uniqueId: 10,
          },
          {
            ...NEW_PAGE,
            uniqueId: 5,
          },
        ],
      },
    }

    expect(getRemoveConditionalTemplateState(10)(mockState)).toMatchObject({
      data: {
        pages: [
          {
            ...NEW_PAGE,
            uniqueId: 5,
          },
        ],
      },
    })
  })

  it(`should clear form errors`, () => {
    const mockState = {
      ...BASE_STATE,
      data: {
        ...BASE_STATE.data,
        pages: [
          {
            ...NEW_PAGE,
            uniqueId: 10,
          },
          {
            ...NEW_PAGE,
            uniqueId: 5,
          },
        ],
      },
      formErrors: {
        title: 'oi',
      },
    }

    expect(getRemoveConditionalTemplateState(10)(mockState)).toMatchObject({
      data: {
        pages: [
          {
            ...NEW_PAGE,
            uniqueId: 5,
          },
        ],
      },
      formErrors: {},
    })
  })
})
