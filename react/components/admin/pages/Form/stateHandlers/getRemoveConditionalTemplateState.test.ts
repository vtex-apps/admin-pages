import { State } from '../index'
import newPage from './__fixtures__/newPage'
import { getRemoveConditionalTemplateState } from './getRemoveConditionalTemplateState'

describe('getRemoveConditionalTemplateState', () => {
  it('should remove the given page with the given uniqueId from "data.pages"', () => {
    const mockState = {
      data: {
        pages: [
          {
            ...newPage,
            uniqueId: 10,
          },
          {
            ...newPage,
            uniqueId: 5,
          },
        ] as any[],
      },
    } as State

    expect(getRemoveConditionalTemplateState(10)(mockState)).toEqual(
      expect.objectContaining({
        data: {
          pages: [
            {
              ...newPage,
              uniqueId: 5,
            },
          ],
        },
      })
    )
  })

  it(`should clear form errors`, () => {
    const mockState = ({
      data: {
        pages: [
          {
            ...newPage,
            uniqueId: 10,
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

    expect(getRemoveConditionalTemplateState(10)(mockState)).toEqual(
      expect.objectContaining({
        data: {
          pages: [
            {
              ...newPage,
              uniqueId: 5,
            },
          ],
        },
        formErrors: {},
      })
    )
  })
})
