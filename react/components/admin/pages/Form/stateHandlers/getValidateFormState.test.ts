import { State } from '../index'
import { getValidateFormState } from './getValidateFormState'

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
    isDeletable: false,
    isInfoEditable: true,
    isLoading: false,
  }

  it('should return empty object if there are no errors', () => {
    const mockState = {
      ...baseMockState,
      data: {
        ...baseMockState.data,
        pages: [
          {
            condition: {
              allMatches: true,
              id: '1',
              statements: [
                {
                  error: '',
                  object: {
                    date: new Date('2019-02-01'),
                  },
                  subject: 'date',
                  verb: 'is',
                },
              ],
            },
            pageId: 'myTemplate',
            template: 'oi',
            uniqueId: 10,
          },
          {
            condition: {
              allMatches: true,
              id: '34',
              statements: [
                {
                  error: '',
                  object: {
                    date: new Date('2019-02-02'),
                  },
                  subject: 'date',
                  verb: 'is',
                },
              ],
            },
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
      expect.objectContaining({ formErrors: {} })
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
            condition: {
              allMatches: true,
              id: '1',
              statements: [
                {
                  error: '',
                  object: {
                    date: new Date('2019-02-01'),
                  },
                  subject: 'date',
                  verb: 'is',
                },
              ],
            },
            pageId: 'myTemplate',
            uniqueId: 10,
          },
          {
            condition: {
              allMatches: true,
              id: '34',
              statements: [
                {
                  error: '',
                  object: {
                    date: new Date('2019-02-02'),
                  },
                  subject: 'date',
                  verb: 'is',
                },
              ],
            },
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
          path: 'admin/pages.admin.pages.form.templates.field.required',
        }),
      })
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
            condition: {
              allMatches: true,
              id: '1',
              statements: [
                {
                  error: '',
                  object: {
                    date: new Date('2019-02-01'),
                  },
                  subject: 'date',
                  verb: 'is',
                },
              ],
            },
            pageId: 'myTemplate',
            uniqueId: 10,
          },
          {
            condition: {
              allMatches: true,
              id: '34',
              statements: [
                {
                  error: '',
                  object: {
                    date: new Date('2019-02-02'),
                  },
                  subject: 'date',
                  verb: 'is',
                },
              ],
            },
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
          blockId: 'admin/pages.admin.pages.form.templates.field.required',
        }),
      })
    )
  })

  it('should return error if title is falsy', () => {
    const mockState = {
      ...baseMockState,
      data: {
        ...baseMockState.data,
        pages: [
          {
            condition: {
              allMatches: true,
              id: '1',
              statements: [
                {
                  error: '',
                  object: {
                    date: new Date('2019-02-01'),
                  },
                  subject: 'date',
                  verb: 'is',
                },
              ],
            },
            pageId: 'myPageId',
            uniqueId: 10,
          },
          {
            condition: {
              allMatches: true,
              id: '34',
              statements: [
                {
                  error: '',
                  object: {
                    date: new Date('2019-02-02'),
                  },
                  subject: 'date',
                  verb: 'is',
                },
              ],
            },
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
          title: 'admin/pages.admin.pages.form.templates.field.required',
        }),
      })
    )
  })

  it(`shouldn't return error if title is falsy and field isn't editable`, () => {
    const mockState = {
      ...baseMockState,
      data: {
        ...baseMockState.data,
        path: '/test',
        template: 'defaultTemplate',
        title: '',
      },
      isInfoEditable: false,
    } as State

    expect(getValidateFormState(mockState)).toEqual(
      expect.objectContaining({
        formErrors: {},
      })
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
              condition: {
                allMatches: true,
                id: '1',
                statements: [
                  {
                    error: '',
                    object: {
                      date: new Date('2019-02-01'),
                    },
                    subject: 'date',
                    verb: 'is',
                  },
                ],
              },
              pageId: 'myTemplate',
              template: 'teste',
              uniqueId: 10,
            },
            {
              condition: {
                allMatches: true,
                id: '34',
                statements: [
                  {
                    error: '',
                    object: {
                      date: new Date('2019-02-02'),
                    },
                    subject: 'date',
                    verb: 'is',
                  },
                ],
              },
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
                template: 'admin/pages.admin.pages.form.templates.field.required',
              },
            },
          }),
        })
      )
    })

    it('should return error with if template of conditional template is falsy', () => {
      const mockState = {
        ...baseMockState,
        data: {
          ...baseMockState.data,
          pages: [
            {
              condition: {
                statements: [],
              },
              pageId: 'pageId',
              template: 'template',
              uniqueId: 10,
            },
            {
              condition: {
                allMatches: true,
                id: '34',
                statements: [
                  {
                    error: '',
                    object: {
                      date: new Date('2019-02-02'),
                    },
                    subject: 'date',
                    verb: 'is',
                  },
                ],
              },
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
                condition: 'admin/pages.admin.pages.form.templates.field.required',
              },
            },
          }),
        })
      )
    })

    it('should return error for more than one page and field', () => {
      const mockState = {
        ...baseMockState,
        data: {
          ...baseMockState.data,
          pages: [
            {
              condition: {
                statements: [],
              },
              template: '',
              uniqueId: 10,
            },
            {
              condition: {
                statements: [],
              },
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
                condition: 'admin/pages.admin.pages.form.templates.field.required',
                template: 'admin/pages.admin.pages.form.templates.field.required',
              },
              10: {
                condition: 'admin/pages.admin.pages.form.templates.field.required',
                template: 'admin/pages.admin.pages.form.templates.field.required',
              },
            },
          }),
        })
      )
    })
  })
})
