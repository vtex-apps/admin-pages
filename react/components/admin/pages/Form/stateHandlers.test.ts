import { State } from './index'
import {
  getAddConditionalTemplateState,
  getChangeOperatorConditionalTemplateState,
  getChangeStatementsConditionalTemplate,
  getChangeTemplateConditionalTemplateState,
  getLoginToggleState,
  getRemoveConditionalTemplateState,
  getValidateFormState,
} from './stateHandlers'

const newPage = {
  conditions: [],
  pageId: '',
  template: ''
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
        auth: true,
      },
    } as State

    expect(getLoginToggleState(mockState)).toEqual(
      expect.objectContaining({ data: { auth: false } }),
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

describe('getChangeOperatorConditionalTemplateState', () => {
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
      getChangeOperatorConditionalTemplateState(3, 'all')(mockState),
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
      }),
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
      getChangeOperatorConditionalTemplateState(3, 'all')(mockState),
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
                allMatches: true,
              },
              operator: 'all',
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
      getChangeOperatorConditionalTemplateState(3, 'any')(mockState),
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
                allMatches: false,
              },
              operator: 'any',
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
      getChangeOperatorConditionalTemplateState(3, 'all')(mockState),
    ).toEqual(
      expect.objectContaining({
        formErrors: {},
      }),
    )
  })
})

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
              statements: []
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
      getChangeStatementsConditionalTemplate(3, [{subject: 'Date', verb: '='}])(mockState),
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
                statements: [{subject: 'Date', verb: '='}]
              },
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
})

describe('getValidateFormState', () => {
  const baseMockState = {
    data: {
      auth: false,
      blockId: 'test.app@1.x:store.home#cool-home',
      context: null,
      declarer: 'user',
      domain: 'store',
      interfaceId: 'test.app@1.x:store.home',
      pages: [],
      path: '/',
      routeId: 'store.home#cool-home',
      title: null,
      uuid: undefined,
    },
    formErrors: {},
    isLoading: false
  }

  it('should return empty object if there are no errors', () => {
    const mockState = {
      ...baseMockState,
      data: {
        ...baseMockState.data,
        pages: [
          {
            conditions: ['my-test'],
            pageId: 'myTemplate',
            template: 'oi',
            uniqueId: 10,
          },
          {
            conditions: ['my-test-5'],
            pageId: 'myTemplate2',
            template: 'oi2',
            uniqueId: 5,
          },
        ] as any[],
        path: '/test',
        template: 'defaultTemplate',
        title: 'test',
      },
    } as State

    expect(getValidateFormState(mockState)).toEqual(
      expect.objectContaining({ formErrors: {} }),
    )
  })

  it('should return error if path is falsy', () => {
    const mockState = {
      ...baseMockState,
      data: {
        ...baseMockState.data,
        blockId: '',
        pages: [
          {
            conditions: ['my-test'],
            pageId: 'myTemplate',
            uniqueId: 10,
          },
          {
            conditions: ['my-test-5'],
            pageId: 'myTemplate2',
            uniqueId: 5,
          },
        ] as any[],
        path: '',
        title: 'test',
      },
    } as State

    expect(getValidateFormState(mockState)).toEqual(
      expect.objectContaining({
        formErrors: expect.objectContaining({
          path: 'pages.admin.pages.form.templates.field.required',
        }),
      }),
    )
  })

  it('should return error if pageId is falsy', () => {
    const mockState = {
      ...baseMockState,
      data: {
        ...baseMockState.data,
        blockId: '',
        pages: [
          {
            conditions: ['my-test'],
            pageId: 'myTemplate',
            uniqueId: 10,
          },
          {
            conditions: ['my-test-5'],
            pageId: 'myTemplate2',
            uniqueId: 5,
          },
        ] as any[],
        path: '/test',
        title: 'test',
      },
    } as State

    expect(getValidateFormState(mockState)).toEqual(
      expect.objectContaining({
        formErrors: expect.objectContaining({
          blockId: 'pages.admin.pages.form.templates.field.required',
        }),
      }),
    )
  })

  it('should return error if title is falsy', () => {
    const mockState = {
      ...baseMockState,
      data: {
        ...baseMockState.data,
        pages: [
          {
            conditions: ['my-test'],
            pageId: 'myPageId',
            uniqueId: 10,
          },
          {
            conditions: ['my-test-5'],
            pageId: 'myPageId2',
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
        ...baseMockState,
        data: {
          ...baseMockState.data,
          pages: [
            {
              conditions: ['my-test'],
              pageId: 'myTemplate',
              template: 'teste',
              uniqueId: 10,
            },
            {
              conditions: ['my-test-5'],
              pageId: 'lala',
              uniqueId: 5,
            },
          ] as any[],
          path: '/test',
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
        ...baseMockState,
        data: {
          ...baseMockState.data,
          pages: [
            {
              conditions: [],
              pageId: 'pageId',
              template: 'template',
              uniqueId: 10,
            },
            {
              conditions: ['my-test-5'],
              pageId: 'page-id',
              template: 'template',
              uniqueId: 5,
            },
          ] as any[],
          path: '/test',
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
        ...baseMockState,
        data: {
          ...baseMockState.data,
          pages: [
            {
              conditions: [],
              pageId: '',
              template: '',
              uniqueId: 10,
            },
            {
              conditions: [],
              pageId: '',
              template: '',
              uniqueId: 5,
            },
          ] as any[],
          path: '/test',
          title: 'defaultTemplate',
        },
      } as State

      expect(getValidateFormState(mockState)).toEqual(
        expect.objectContaining({
          formErrors: expect.objectContaining({
            pages: {
              5: {
                conditions: 'pages.admin.pages.form.templates.field.required',
                pageId: 'pages.admin.pages.form.templates.field.required',
                template: 'pages.admin.pages.form.templates.field.required',
              },
              10: {
                conditions: 'pages.admin.pages.form.templates.field.required',
                pageId: 'pages.admin.pages.form.templates.field.required',
                template: 'pages.admin.pages.form.templates.field.required',
              },
            },
          }),
        }),
      )
    })
  })

})
