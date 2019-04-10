import { State } from '../index'
import newPage from './__fixtures__/newPage'
import setupDate from './__fixtures__/setupDate'
import { getChangeOperatorConditionalTemplateState } from './getChangeOperatorConditionalTemplateState'

describe('getChangeOperatorConditionalTemplateState', () => {
  setupDate()

  it('should modify operator given a unique ID', () => {
    const mockState = {
      data: {
        pages: [
          {
            ...newPage,
            uniqueId: 10,
          },
          {
            ...newPage,
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
      getChangeOperatorConditionalTemplateState(3, 'all')(mockState)
    ).toEqual(
      expect.objectContaining({
        data: {
          pages: [
            {
              ...newPage,
              uniqueId: 10,
            },
            expect.objectContaining({
              ...newPage,
              operator: 'all',
              uniqueId: 3,
            }),
            {
              ...newPage,
              uniqueId: 5,
            },
          ],
        },
      })
    )
  })

  it('should set allMatches boolean to true given "all" as operator', () => {
    const mockState = {
      data: {
        pages: [
          {
            ...newPage,
            uniqueId: 10,
          },
          {
            ...newPage,
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
      getChangeOperatorConditionalTemplateState(3, 'all')(mockState)
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
              condition: expect.objectContaining({
                allMatches: true,
              }),
              operator: 'all',
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

  it('should set allMatches boolean to false given "any" as operator', () => {
    const mockState = {
      data: {
        pages: [
          {
            ...newPage,
            uniqueId: 10,
          },
          {
            ...newPage,
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
      getChangeOperatorConditionalTemplateState(3, 'any')(mockState)
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
              condition: expect.objectContaining({
                allMatches: false,
              }),
              operator: 'any',
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

  it('should clear formError', () => {
    const mockState = ({
      data: {
        pages: [
          {
            ...newPage,
            uniqueId: 10,
          },
          {
            ...newPage,
            uniqueId: 3,
          },
          {
            ...newPage,
            uniqueId: 5,
          },
        ] as any[],
      },
      formErrors: {
        title: 'oi',
      },
    } as unknown) as State

    expect(
      getChangeOperatorConditionalTemplateState(3, 'all')(mockState)
    ).toEqual(
      expect.objectContaining({
        formErrors: {},
      })
    )
  })
})
