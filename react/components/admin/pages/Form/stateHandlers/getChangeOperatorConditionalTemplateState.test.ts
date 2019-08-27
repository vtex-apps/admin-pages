import NEW_PAGE from './__fixtures__/newPage'
import setupDate from './__fixtures__/setupDate'
import BASE_STATE from './__fixtures__/state'
import { getChangeOperatorConditionalTemplateState } from './getChangeOperatorConditionalTemplateState'

describe('getChangeOperatorConditionalTemplateState', () => {
  setupDate()

  it('should modify operator given a unique ID', () => {
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
      isInfoEditable: false,
    }

    expect(
      getChangeOperatorConditionalTemplateState(3, 'all')(mockState)
    ).toMatchObject({
      data: {
        pages: [
          {
            ...NEW_PAGE,
            uniqueId: 10,
          },
          {
            ...NEW_PAGE,
            operator: 'all',
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

  it('should set allMatches boolean to true given "all" as operator', () => {
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
      isInfoEditable: false,
    }

    expect(
      getChangeOperatorConditionalTemplateState(3, 'all')(mockState)
    ).toMatchObject({
      data: {
        pages: [
          {
            ...NEW_PAGE,
            uniqueId: 10,
          },
          {
            ...NEW_PAGE,
            condition: expect.objectContaining({
              allMatches: true,
            }),
            operator: 'all',
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

  it('should set allMatches boolean to false given "any" as operator', () => {
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
      isInfoEditable: false,
    }

    expect(
      getChangeOperatorConditionalTemplateState(3, 'any')(mockState)
    ).toMatchObject({
      data: {
        pages: [
          {
            ...NEW_PAGE,
            uniqueId: 10,
          },
          {
            ...NEW_PAGE,
            condition: expect.objectContaining({
              allMatches: false,
            }),
            operator: 'any',
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
      isInfoEditable: false,
    }

    expect(
      getChangeOperatorConditionalTemplateState(3, 'all')(mockState)
    ).toEqual(
      expect.objectContaining({
        formErrors: {},
      })
    )
  })
})
