import { State } from '../index'
import { getAddConditionalTemplateState } from './getAddConditionalTemplateState'

import newPage from './__fixtures__/newPage'
import setupDate from './__fixtures__/setupDate'

describe('getAddConditionalTemplateState', () => {
  setupDate()

  it(`should add empty page with uniqueId if data.pages is empty`, () => {
    const mockState = ({
      data: {
        pages: [],
      },
    } as unknown) as State

    expect(getAddConditionalTemplateState(mockState)).toEqual(
      expect.objectContaining({
        data: {
          pages: [
            {
              ...newPage,
              uniqueId: 0,
            },
          ],
        },
      })
    )
  })

  it(`should add empty page with uniqueId === highest uniqueId + 1`, () => {
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
        ],
      },
    } as unknown) as State

    expect(getAddConditionalTemplateState(mockState)).toEqual(
      expect.objectContaining({
        data: {
          pages: [
            ...mockState.data.pages,
            {
              ...newPage,
              uniqueId: 11,
            },
          ],
        },
      })
    )
  })

  it(`should clear form errors`, () => {
    const mockState = ({
      data: {
        pages: [],
      },
      formErrors: {
        title: 'oi',
      },
    } as unknown) as State

    expect(getAddConditionalTemplateState(mockState)).toEqual(
      expect.objectContaining({
        data: {
          pages: [
            {
              ...newPage,
              uniqueId: 0,
            },
          ],
        },
        formErrors: {},
      })
    )
  })
})
