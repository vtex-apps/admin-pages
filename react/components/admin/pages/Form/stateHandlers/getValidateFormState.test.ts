import { State } from '../index'

import { getValidateFormState } from './getValidateFormState'
import BASE_STATE from './__fixtures__/state'

describe('getValidateFormState', () => {
  it('should return empty object if there are no errors', () => {
    const mockState: State = {
      ...BASE_STATE,
      data: {
        ...BASE_STATE.data,
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
            operator: 'any',
            pageId: 'page1',
            template: 'myTemplate2',
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
            operator: 'any',
            pageId: 'page2',
            template: 'myTemplate2',
            uniqueId: 5,
          },
        ],
        path: '/test',
        title: 'test',
      },
    }

    expect(getValidateFormState(mockState)).toEqual(
      expect.objectContaining({ formErrors: {} })
    )
  })

  it('should return error if path is falsy', () => {
    const mockState: State = {
      ...BASE_STATE,
      data: {
        ...BASE_STATE.data,
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
            operator: 'any',
            pageId: 'page1',
            template: 'myTemplate1',
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
            operator: 'any',
            pageId: 'page2',
            template: 'myTemplate2',
            uniqueId: 5,
          },
        ],
        path: '',
        title: 'test',
      },
    }

    expect(getValidateFormState(mockState)).toEqual(
      expect.objectContaining({
        formErrors: expect.objectContaining({
          path: 'admin/pages.admin.pages.form.templates.field.required',
        }),
      })
    )
  })

  it(`should return error if path doesn't begin with '/'`, () => {
    const mockState = {
      ...BASE_STATE,
      data: {
        ...BASE_STATE.data,
        path: 'lalala',
        title: 'test',
      },
    }

    expect(getValidateFormState(mockState)).toEqual(
      expect.objectContaining({
        formErrors: expect.objectContaining({
          path: 'admin/pages.admin.pages.form.templates.path.validation-error',
        }),
      })
    )
  })

  it('should return error if pageId is falsy', () => {
    const mockState: State = {
      ...BASE_STATE,
      data: {
        ...BASE_STATE.data,
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
            operator: 'any',
            pageId: 'page1',
            template: 'myTemplate1',
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
            operator: 'any',
            pageId: 'page2',
            template: 'myTemplate2',
            uniqueId: 5,
          },
        ],
        path: '/test',
        title: 'test',
      },
    }

    expect(getValidateFormState(mockState)).toEqual(
      expect.objectContaining({
        formErrors: expect.objectContaining({
          blockId: 'admin/pages.admin.pages.form.templates.field.required',
        }),
      })
    )
  })

  it('should return error if title is falsy', () => {
    const mockState: State = {
      ...BASE_STATE,
      data: {
        ...BASE_STATE.data,
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
            operator: 'any',
            pageId: 'page1',
            template: 'myTemplate1',
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
            operator: 'any',
            pageId: 'page2',
            template: 'myTemplate2',
            uniqueId: 5,
          },
        ],
        path: '/test',
        title: '',
      },
    }

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
      ...BASE_STATE,
      data: {
        ...BASE_STATE.data,
        path: '/test',
        template: 'defaultTemplate',
        title: '',
      },
      isInfoEditable: false,
    }

    expect(getValidateFormState(mockState)).toEqual(
      expect.objectContaining({
        formErrors: {},
      })
    )
  })

  describe('pages[] field errors', () => {
    it('should return error with if template of conditional template is falsy', () => {
      const mockState: State = {
        ...BASE_STATE,
        data: {
          ...BASE_STATE.data,
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
              operator: 'any',
              pageId: 'page1',
              template: 'myTemplate1',
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
              operator: 'any',
              pageId: 'page2',
              template: '',
              uniqueId: 5,
            },
          ],
          path: '/test',
          title: 'defaultTemplate',
        },
      }

      expect(getValidateFormState(mockState)).toMatchObject({
        formErrors: expect.objectContaining({
          pages: {
            5: {
              template: 'admin/pages.admin.pages.form.templates.field.required',
            },
          },
        }),
      })
    })

    it('should return error with if template of conditional template is falsy', () => {
      const mockState: State = {
        ...BASE_STATE,
        data: {
          ...BASE_STATE.data,
          pages: [
            {
              condition: {
                allMatches: true,
                statements: [],
              },
              operator: 'any',
              pageId: 'page1',
              template: 'myTemplate1',
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
              operator: 'any',
              pageId: 'page2',
              template: 'myTemplate2',
              uniqueId: 5,
            },
          ],
          path: '/test',
          title: 'defaultTemplate',
        },
      }

      expect(getValidateFormState(mockState)).toMatchObject({
        formErrors: expect.objectContaining({
          pages: {
            10: {
              condition:
                'admin/pages.admin.pages.form.templates.field.required',
            },
          },
        }),
      })
    })

    it('should return error for more than one page and field', () => {
      const mockState: State = {
        ...BASE_STATE,
        data: {
          ...BASE_STATE.data,
          pages: [
            {
              condition: {
                allMatches: true,
                statements: [],
              },
              operator: 'any',
              template: 'myTemplate1',
              uniqueId: 10,
            },
            {
              condition: {
                allMatches: true,
                statements: [],
              },
              operator: 'any',
              template: 'myTemplate2',
              uniqueId: 5,
            },
          ],
          path: '/test',
          title: 'defaultTemplate',
        },
      }

      expect(getValidateFormState(mockState)).toMatchObject({
        formErrors: {
          pages: {
            5: {
              condition:
                'admin/pages.admin.pages.form.templates.field.required',
            },
            10: {
              condition:
                'admin/pages.admin.pages.form.templates.field.required',
            },
          },
        },
      })
    })
  })
})
