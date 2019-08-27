import NEW_PAGE from './__fixtures__/newPage'
import BASE_STATE from './__fixtures__/state'
import { getChangeStatementsConditionalTemplate } from './getChangeStatementsConditionalTemplate'

describe('getChangeStatementsConditionalTemplate', () => {
  it('should change statement inside condition given a page uniqueId', () => {
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
            condition: {
              allMatches: false,
              statements: [],
            },
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
      getChangeStatementsConditionalTemplate(3, [
        { error: '', object: {}, subject: 'Date', verb: '=' },
      ])(mockState)
    ).toMatchObject({
      data: {
        pages: [
          {
            ...NEW_PAGE,
            uniqueId: 10,
          },
          {
            ...NEW_PAGE,
            condition: {
              allMatches: false,
              statements: [{ subject: 'Date', verb: '=' }],
            },
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
})
