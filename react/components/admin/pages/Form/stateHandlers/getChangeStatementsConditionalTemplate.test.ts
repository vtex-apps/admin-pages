import { State } from '../index'
import newPage from './__fixtures__/newPage'
import { getChangeStatementsConditionalTemplate } from './getChangeStatementsConditionalTemplate'

describe('getChangeStatementsConditionalTemplate', () => {
  it('should change statement inside condition given a page uniqueId', () => {
    const mockState = {
      data: {
        pages: [
          {
            ...newPage,
            uniqueId: 10,
          },
          {
            ...newPage,
            condition: {
              statements: [],
            },
            uniqueId: 3,
          },
          {
            ...newPage,
            uniqueId: 5,
          },
        ] as any[],
      },
    } as State

    expect(
      getChangeStatementsConditionalTemplate(3, [
        { subject: 'Date', verb: '=' },
      ])(mockState)
    ).toEqual(
      expect.objectContaining({
        data: {
          pages: [
            {
              ...newPage,
              uniqueId: 10,
            },
            {
              ...newPage,
              condition: {
                statements: [{ subject: 'Date', verb: '=' }],
              },
              uniqueId: 3,
            },
            {
              ...newPage,
              uniqueId: 5,
            },
          ],
        },
      })
    )
  })
})
