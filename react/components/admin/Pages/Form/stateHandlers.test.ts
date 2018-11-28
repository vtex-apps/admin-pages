import {
  getAddConditionalTemplateState,
  getChangeConditionsConditionalTemplateState,
  getChangeTemplateConditionalTemplateState,
  getLoginToggleState,
  getRemoveConditionalTemplateState,
  State,
} from './stateHandlers'

const newPage = {
  allMatches: false,
  conditions: [],
  configurationId: '',
  declarer: null,
  device: '',
  name: '',
  params: {},
  template: '',
}

describe('getAddConditionalTemplateState', () => {
  it(`should add empty page with uniqueId if data.pages is empty`, () => {
    const mockState = {
      data: {
        pages: [] as Page[],
      },
    } as State
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
      }),
    )
  })

  it(`should add empty page with uniqueId === highest uniqueId + 1`, () => {
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
      }),
    )
  })
})

describe('getLoginToggleState', () => {
  it('should negate data.login value', () => {
    const mockState = {
      data: {
        login: true,
      },
    } as State
    expect(getLoginToggleState(mockState)).toEqual(
      expect.objectContaining({ data: { login: false } }),
    )
  })
})

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
    expect(getRemoveConditionalTemplateState(10)(mockState)).toEqual({
      data: {
        pages: [
          {
            ...newPage,
            uniqueId: 5,
          },
        ],
      },
    })
  })
})

describe('getChangeTemplateConditionalTemplateState', () => {
  it('should modify template given a unique ID', () => {
    const mockState = {
      data: {
        pages: [
          {
            ...newPage,
            uniqueId: 10,
          },
          {
            ...newPage,
            uniqueId: 3
          },
          {
            ...newPage,
            uniqueId: 5,
          },
        ] as any[],
      },
    } as State
    expect(getChangeTemplateConditionalTemplateState(3, 'store/test')(mockState)).toEqual({
      data: {
        pages: [
          {
            ...newPage,
            uniqueId: 10,
          },
          {
            ...newPage,
            template: 'store/test',
            uniqueId: 3
          },
          {
            ...newPage,
            uniqueId: 5,
          },
        ],
      },
    })
  })
})

describe('getChangeConditionsConditionalTemplateState', () => {
  it('should modify conditions given a unique ID', () => {
    const mockState = {
      data: {
        pages: [
          {
            ...newPage,
            uniqueId: 10,
          },
          {
            ...newPage,
            uniqueId: 3
          },
          {
            ...newPage,
            uniqueId: 5,
          },
        ] as any[],
      },
    } as State
    expect(getChangeConditionsConditionalTemplateState(3, ['condition1', 'condition2'])(mockState)).toEqual({
      data: {
        pages: [
          {
            ...newPage,
            uniqueId: 10,
          },
          {
            ...newPage,
            conditions: ['condition1', 'condition2'],
            uniqueId: 3
          },
          {
            ...newPage,
            uniqueId: 5,
          },
        ],
      },
    })
  })
})