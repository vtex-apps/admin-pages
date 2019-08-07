import NEW_PAGE from './__fixtures__/newPage'
import setupDate from './__fixtures__/setupDate'
import BASE_STATE from './__fixtures__/state'
import { getAddConditionalTemplateState } from './getAddConditionalTemplateState'

describe('getAddConditionalTemplateState', () => {
  setupDate()

  it(`should add empty page with uniqueId if data.pages is empty`, () => {
    const mockState = {
      ...BASE_STATE,
      data: {
        ...BASE_STATE.data,
        pages: [],
      },
    }

    expect(getAddConditionalTemplateState(mockState)).toMatchObject({
      data: {
        pages: [
          {
            ...NEW_PAGE,
            uniqueId: 0,
          },
        ],
      },
    })
  })

  it(`should add empty page with uniqueId === highest uniqueId + 1`, () => {
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

    expect(getAddConditionalTemplateState(mockState)).toMatchObject({
      data: {
        pages: [
          ...mockState.data.pages,
          {
            ...NEW_PAGE,
            uniqueId: 11,
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
        pages: [],
      },
      formErrors: {
        title: 'oi',
      },
    }

    expect(getAddConditionalTemplateState(mockState)).toMatchObject({
      data: {
        pages: [
          {
            ...NEW_PAGE,
            uniqueId: 0,
          },
        ],
      },
      formErrors: {},
    })
  })
})
