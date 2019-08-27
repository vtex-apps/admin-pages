import NEW_PAGE from './__fixtures__/newPage'
import BASE_STATE from './__fixtures__/state'
import { getChangeTemplateConditionalTemplateState } from './getChangeTemplateConditionalTemplateState'

describe('getChangeTemplateConditionalTemplateState', () => {
  it('should modify template given a unique ID', () => {
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
            uniqueId: 3,
          },
          {
            ...NEW_PAGE,
            uniqueId: 5,
          },
        ],
      },
    }

    expect(
      getChangeTemplateConditionalTemplateState(3, 'store/test')(mockState)
    ).toMatchObject({
      data: {
        pages: [
          {
            ...NEW_PAGE,
            uniqueId: 10,
          },
          {
            ...NEW_PAGE,
            template: 'store/test',
            uniqueId: 3,
          },
          {
            ...NEW_PAGE,
            uniqueId: 5,
          },
        ],
      },
    })
  })

  it('should clear formError', () => {
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
            uniqueId: 3,
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

    expect(
      getChangeTemplateConditionalTemplateState(3, 'store/test')(mockState)
    ).toEqual(
      expect.objectContaining({
        formErrors: {},
      })
    )
  })
})
