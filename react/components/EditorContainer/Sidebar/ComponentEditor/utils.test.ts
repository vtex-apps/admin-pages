import { getUiSchema } from './utils'

describe('getUiSchema', () => {
  const mockComponents = {
    'vtex.no-schema': {
      schema: {},
    },
    'vtex.schema-with-dependencies': {
      schema: {
        dependencies: {
          foo: {
            oneOf: [
              {
                properties: {
                  bar: { type: 'string', widget: { 'ui:widget': 'textarea' } },
                  foo: {
                    enum: ['0'],
                  },
                },
                required: ['bar'],
              },
              {
                properties: {
                  baz: { type: 'string', widget: { 'ui:widget': 'IOMessage' } },
                  foo: {
                    enum: ['1'],
                  },
                },
              },
            ],
          },
        },
        properties: {
          foo: {
            enum: ['0', '1'],
          },
        },
        required: ['foo'],
      },
    },
    'vtex.schema-with-nested-dependencies': {
      schema: {
        dependencies: {
          foo: {
            oneOf: [
              {
                dependencies: {
                  bar: {
                    oneOf: [
                      {
                        properties: {
                          baar: {
                            type: 'string',
                            widget: { 'ui:widget': 'textarea' },
                          },
                          bar: { enum: ['0'] },
                        },
                      },
                    ],
                  },
                },
                properties: {
                  bar: { enum: ['0'] },
                  foo: {
                    enum: ['0'],
                  },
                },
                required: ['bar'],
              },
              {
                properties: {
                  baz: { type: 'string', widget: { 'ui:widget': 'IOMessage' } },
                  foo: {
                    enum: ['1'],
                  },
                },
              },
            ],
          },
        },
        properties: {
          foo: {
            enum: ['0', '1'],
          },
        },
        required: ['foo'],
      },
    },
    'vtex.simple-schema': {
      schema: {
        properties: {
          foo: {
            properties: {
              bar: {
                widget: { 'ui:widget': 'textarea' },
              },
            },
            type: 'object',
          },
        },
      },
    },
  }

  it('should get ui schema for dependencies', () => {
    expect(
      getUiSchema({}, mockComponents['vtex.schema-with-dependencies']
        .schema as ComponentSchema)
    ).toEqual({
      bar: { 'ui:widget': 'textarea' },
      baz: { 'ui:widget': 'IOMessage' },
    })
  })

  it('should get ui schema for nested dependencies', () => {
    expect(
      getUiSchema({}, mockComponents['vtex.schema-with-nested-dependencies']
        .schema as ComponentSchema)
    ).toEqual({
      baar: { 'ui:widget': 'textarea' },
      baz: { 'ui:widget': 'IOMessage' },
    })
  })

  it('should deal with empty schemas', () => {
    expect(
      getUiSchema({}, mockComponents['vtex.no-schema']
        .schema as ComponentSchema)
    ).toEqual({})
  })

  it('should get ui schema for simple schemas', () => {
    expect(
      getUiSchema({}, mockComponents['vtex.simple-schema']
        .schema as ComponentSchema)
    ).toEqual({
      foo: { bar: { 'ui:widget': 'textarea' } },
    })
  })
})
