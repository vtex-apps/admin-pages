import { State } from './index'
import {
  getAddConditionalTemplateState,
  getChangeConditionsConditionalTemplateState,
  getChangeTemplateConditionalTemplateState,
  getLoginToggleState,
  getRemoveConditionalTemplateState,
  getValidateFormState,
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

  it(`should clear form errors`, () => {
    const mockState = {
      data: {
        pages: [] as Page[],
      },
      formErrors: {
        title: 'oi',
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
        formErrors: {},
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
      }),
    )
  })

  it(`should clear form errors`, () => {
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
      formErrors: {
        title: 'oi',
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
        formErrors: {},
      }),
    )
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
      getChangeTemplateConditionalTemplateState(3, 'store/test')(mockState),
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
              template: 'store/test',
              uniqueId: 3,
            },
            {
              ...newPage,
              uniqueId: 5,
            },
          ],
        },
      }),
    )
  })

  it('should clear formError', () => {
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
      formErrors: {
        title: 'oi',
      },
    } as State

    expect(
      getChangeTemplateConditionalTemplateState(3, 'store/test')(mockState),
    ).toEqual(
      expect.objectContaining({
        formErrors: {},
      }),
    )
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
      getChangeConditionsConditionalTemplateState(3, [
        'condition1',
        'condition2',
      ])(mockState),
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
              conditions: ['condition1', 'condition2'],
              uniqueId: 3,
            },
            {
              ...newPage,
              uniqueId: 5,
            },
          ],
        },
      }),
    )
  })

  it('should clear formError', () => {
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
      formErrors: {
        title: 'oi',
      },
    } as State

    expect(
      getChangeConditionsConditionalTemplateState(3, [
        'condition1',
        'condition2',
      ])(mockState),
    ).toEqual(
      expect.objectContaining({
        formErrors: {},
      }),
    )
  })

})

describe('getValidateFormState', () => {
  it('should return empty object if there are no errors', () => {
    const mockState = {
      data: {
        pages: [
          {
            conditions: ['my-test'],
            template: 'myTemplate',
            uniqueId: 10,
          },
          {
            conditions: ['my-test-5'],
            template: 'myTemplate2',
            uniqueId: 5,
          },
        ] as any[],
        path: '/test',
        template: 'defaultTemplate',
        title: 'test',
      },
      formErrors: {},
    } as State

    expect(getValidateFormState(mockState)).toEqual(
      expect.objectContaining({ formErrors: {} }),
    )
  })

  it('should return error if path is falsy', () => {
    const mockState = {
      data: {
        pages: [
          {
            conditions: ['my-test'],
            template: 'myTemplate',
            uniqueId: 10,
          },
          {
            conditions: ['my-test-5'],
            template: 'myTemplate2',
            uniqueId: 5,
          },
        ] as any[],
        path: '',
        template: 'defaultTemplate',
        title: 'test',
      },
      formErrors: {},
    } as State

    expect(getValidateFormState(mockState)).toEqual(
      expect.objectContaining({
        formErrors: expect.objectContaining({
          path: 'pages.admin.pages.form.templates.field.required',
        }),
      }),
    )
  })

  it('should return error if template is falsy', () => {
    const mockState = {
      data: {
        pages: [
          {
            conditions: ['my-test'],
            template: 'myTemplate',
            uniqueId: 10,
          },
          {
            conditions: ['my-test-5'],
            template: 'myTemplate2',
            uniqueId: 5,
          },
        ] as any[],
        path: '/test',
        template: '',
        title: 'test',
      },
    } as State

    expect(getValidateFormState(mockState)).toEqual(
      expect.objectContaining({
        formErrors: expect.objectContaining({
          template: 'pages.admin.pages.form.templates.field.required',
        }),
      }),
    )
  })

  it('should return error if title is falsy', () => {
    const mockState = {
      data: {
        pages: [
          {
            conditions: ['my-test'],
            template: 'myTemplate',
            uniqueId: 10,
          },
          {
            conditions: ['my-test-5'],
            template: 'myTemplate2',
            uniqueId: 5,
          },
        ] as any[],
        path: '/test',
        template: 'defaultTemplate',
        title: '',
      },
    } as State

    expect(getValidateFormState(mockState)).toEqual(
      expect.objectContaining({
        formErrors: expect.objectContaining({
          title: 'pages.admin.pages.form.templates.field.required',
        }),
      }),
    )
  })

  describe('pages[] field errors', () => {
    it('should return error with if template of conditional template is falsy', () => {
      const mockState = {
        data: {
          pages: [
            {
              conditions: ['my-test'],
              template: 'myTemplate',
              uniqueId: 10,
            },
            {
              conditions: ['my-test-5'],
              template: '',
              uniqueId: 5,
            },
          ] as any[],
          path: '/test',
          template: 'defaultTemplate',
          title: 'defaultTemplate',
        },
      } as State

      expect(getValidateFormState(mockState)).toEqual(
        expect.objectContaining({
          formErrors: expect.objectContaining({
            pages: {
              5: {
                template: 'pages.admin.pages.form.templates.field.required',
              },
            },
          }),
        }),
      )
    })

    it('should return error with if template of conditional template is falsy', () => {
      const mockState = {
        data: {
          pages: [
            {
              conditions: [],
              template: 'myTemplate',
              uniqueId: 10,
            },
            {
              conditions: ['my-test-5'],
              template: 'myTemplate',
              uniqueId: 5,
            },
          ] as any[],
          path: '/test',
          template: 'defaultTemplate',
          title: 'defaultTemplate',
        },
      } as State

      expect(getValidateFormState(mockState)).toEqual(
        expect.objectContaining({
          formErrors: expect.objectContaining({
            pages: {
              10: {
                conditions: 'pages.admin.pages.form.templates.field.required',
              },
            },
          }),
        }),
      )
    })

    it('should return error for more than one page and field', () => {
      const mockState = {
        data: {
          pages: [
            {
              conditions: [],
              template: '',
              uniqueId: 10,
            },
            {
              conditions: [],
              template: '',
              uniqueId: 5,
            },
          ] as any[],
          path: '/test',
          template: 'defaultTemplate',
          title: 'defaultTemplate',
        },
      } as State

      expect(getValidateFormState(mockState)).toEqual(
        expect.objectContaining({
          formErrors: expect.objectContaining({
            pages: {
              5: {
                conditions: 'pages.admin.pages.form.templates.field.required',
                template: 'pages.admin.pages.form.templates.field.required',
              },
              10: {
                conditions: 'pages.admin.pages.form.templates.field.required',
                template: 'pages.admin.pages.form.templates.field.required',
              },
            },
          }),
        }),
      )
    })
  })

})
