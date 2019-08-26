import COMPONENTS from './__fixtures__/components'
import EXTENSIONS from './__fixtures__/extensions'
import {
  generateWarningMessage,
  getComponents,
  getIsDefaultContent,
  getIsSitewide,
  hasContentPropsInSchema,
} from './utils'

const DEFAULT_EXTENSIONS_COMPONENTS = [
  {
    isEditable: true,
    name: 'admin/editor.carousel.title',
    treePath: 'store.home/carousel#home',
  },
  {
    isEditable: true,
    name: 'admin/editor.shelf.title',
    treePath: 'store.home/shelf#home',
  },
  {
    isEditable: true,
    name: 'admin/editor.productSummary.title',
    treePath: 'store.home/shelf#home/product-summary',
  },
]

describe('getComponents', () => {
  let spiedConsoleWarn: jest.MockInstance<
    ReturnType<Console['warn']>,
    Parameters<Console['warn']>
  >

  beforeEach(() => {
    spiedConsoleWarn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined)
  })

  afterEach(() => {
    spiedConsoleWarn.mockRestore()
  })

  it('should filter out components without either a schema or a title', () => {
    expect(getComponents(EXTENSIONS, COMPONENTS, 'store.home')).toEqual(
      DEFAULT_EXTENSIONS_COMPONENTS
    )
  })

  it('should use blocks from extension to determine order', () => {
    const swap = <T>(indexA: number, indexB: number, arr: T[]) => {
      const clonedArr = Array.from(arr)

      const temp = clonedArr[indexA]

      clonedArr[indexA] = clonedArr[indexB]

      clonedArr[indexB] = temp

      return clonedArr
    }

    const homeBlocks = EXTENSIONS['store.home'].blocks || []

    const shelfExtensionsIndex = homeBlocks.findIndex(item =>
      item.blockId.endsWith('shelf#home')
    )

    const carouselExtensionsIndex = homeBlocks.findIndex(item =>
      item.blockId.endsWith('carousel#home')
    )

    const reorderedHomeBlocks = swap(
      shelfExtensionsIndex,
      carouselExtensionsIndex,
      homeBlocks
    )

    const shelfComponentsIndex = DEFAULT_EXTENSIONS_COMPONENTS.findIndex(item =>
      item.treePath.endsWith('shelf#home')
    )

    const carouselComponentsIndex = DEFAULT_EXTENSIONS_COMPONENTS.findIndex(
      item => item.treePath.endsWith('carousel#home')
    )

    const reorderedDefaultComponentBlocks = swap(
      shelfComponentsIndex,
      carouselComponentsIndex,
      DEFAULT_EXTENSIONS_COMPONENTS
    )

    const extensions = {
      ...EXTENSIONS,
      'store.home': {
        ...EXTENSIONS['store.home'],
        blocks: reorderedHomeBlocks,
      },
    }

    expect(getComponents(extensions, COMPONENTS, 'store.home')).toEqual(
      reorderedDefaultComponentBlocks
    )
  })

  describe('schema with no titles', () => {
    it('should show extension that have only title in the blocks (extensions) and no schema', () => {
      const extensions: RenderRuntime['extensions'] = {
        ...EXTENSIONS,
        'store.home/title-in-blocks': {
          after: [],
          around: [],
          before: [],
          blockId: 'vtex.title-in-blocks@0.x:title-in-blocks',
          blocks: [],
          component: 'vtex.title-in-blocks@0.0.1/TitleInBlocks',
          composition: 'blocks',
          content: {},
          hasContentSchema: false,
          preview: null,
          props: {},
          render: 'server',
          title: 'admin/title-in-blocks.title',
          track: [],
        },
      }

      expect(getComponents(extensions, {}, 'store.home')).toEqual([
        {
          isEditable: false,
          name: 'admin/title-in-blocks.title',
          treePath: 'store.home/title-in-blocks',
        },
      ])
    })

    it('should filter out components whose extensions have falsy titles', () => {
      const extensions: RenderRuntime['extensions'] = {
        ...EXTENSIONS,
        'store.home/empty-string-title': {
          after: [],
          around: [],
          before: [],
          blockId: 'vtex.empty-string-title@0.x:empty-string-title',
          blocks: [],
          component: 'vtex.empty-string-title@0.0.1/EmptyStringTitle',
          composition: 'blocks',
          content: {},
          hasContentSchema: false,
          preview: null,
          props: {},
          render: 'server',
          track: [],
        },
        'store.home/null-title': {
          after: [],
          around: [],
          before: [],
          blockId: 'vtex.null-title@0.x:null-title',
          blocks: [],
          component: 'vtex.null-title@0.0.1/NullTitle',
          composition: 'blocks',
          content: {},
          hasContentSchema: false,
          preview: null,
          props: {},
          render: 'server',
          track: [],
        },
        'store.home/undefined-title': {
          after: [],
          around: [],
          before: [],
          blockId: 'vtex.undefined-title@0.x:undefined-title',
          blocks: [],
          component: 'vtex.undefined-title@0.0.1/UndefinedTitle',
          composition: 'blocks',
          content: {},
          hasContentSchema: false,
          preview: null,
          props: {},
          render: 'server',
          track: [],
        },
      }

      const components = {
        ...COMPONENTS,
        'vtex.empty-string-title@0.0.1/EmptyStringTitle': {
          schema: {
            title: '',
          },
        },
        'vtex.null-title@0.0.1/NullTitle': {
          schema: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            title: null as any,
          },
        },
        'vtex.undefined-title@0.0.1/UndefinedTitle': {
          schema: {
            title: undefined,
          },
        },
      }

      expect(getComponents(extensions, components, 'store.home')).toEqual(
        DEFAULT_EXTENSIONS_COMPONENTS
      )
    })
  })

  it('should use getSchema as fallback for schema', () => {
    const components = {
      'vtex.shelf@1.25.0/Shelf': {
        getSchema: () => ({
          properties: { mock: {} },
          title: 'admin/editor.shelf.title',
          type: 'object',
        }),
        schema: undefined,
      },
    }

    expect(getComponents(EXTENSIONS, components, 'store.home')).toEqual([
      {
        isEditable: true,
        name: 'admin/editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
    ])
  })

  describe('Warnings for schemas without title', () => {
    it('should call console.warn when component has a schema with no title', () => {
      const EXTENSION_ID = 'store.home/shelf#home/product-summary'

      const extensions = {
        [EXTENSION_ID]: EXTENSIONS[EXTENSION_ID],
      }

      const COMPONENT_ID = 'vtex.product-summary@2.31.0/ProductSummaryCustom'

      const components = {
        [COMPONENT_ID]: {
          schema: {},
        },
      }

      expect(getComponents(extensions, components, 'store.home')).toEqual([])

      expect(spiedConsoleWarn).toHaveBeenCalledTimes(1)
      expect(spiedConsoleWarn).toHaveBeenCalledWith(
        generateWarningMessage(COMPONENT_ID)
      )
    })

    it('should call console.warn when component returns a schema from getSchema with no title', () => {
      const COMPONENT_ID = 'vtex.shelf@1.25.0/Shelf'

      const components = {
        ...COMPONENTS,
        [COMPONENT_ID]: {
          getSchema: () => ({}),
        },
      }

      expect(getComponents(EXTENSIONS, components, 'store.home')).toEqual(
        DEFAULT_EXTENSIONS_COMPONENTS.filter(
          item => item.treePath !== 'store.home/shelf#home'
        )
      )

      expect(spiedConsoleWarn).toHaveBeenCalledTimes(1)
      expect(spiedConsoleWarn).toHaveBeenCalledWith(
        generateWarningMessage(COMPONENT_ID)
      )
    })
  })
})

describe('getIsSitewide', () => {
  it('should return true for AFTER', () => {
    const mockEditTreePath = 'store.home/$after_footer'

    expect(getIsSitewide(EXTENSIONS, mockEditTreePath)).toBe(true)
  })

  it('should return true for AROUND', () => {
    const mockEditTreePath = 'store.home/$around_homeWrapper'

    expect(getIsSitewide(EXTENSIONS, mockEditTreePath)).toBe(true)
  })

  it('should return true for BEFORE', () => {
    const mockEditTreePath = 'store.home/$before_header.full'

    expect(getIsSitewide(EXTENSIONS, mockEditTreePath)).toBe(true)
  })

  it('should return false for blocks without role', () => {
    const mockEditTreePath = 'store.home/carousel#home'

    expect(getIsSitewide(EXTENSIONS, mockEditTreePath)).toBe(false)
  })
})

describe('getIsDefaultContent', () => {
  it('should return true when origin is declared (comes from app)', () => {
    expect(getIsDefaultContent({ origin: 'comes from block' })).toBe(true)
  })

  it('should return false when origin is null (declared by user)', () => {
    expect(getIsDefaultContent({ origin: null })).toBe(false)
  })
})

describe('hasContentPropsInSchema', () => {
  it(`should return false when schema isn't type object`, () => {
    expect(hasContentPropsInSchema({ title: 'Test' })).toBe(false)
    expect(hasContentPropsInSchema({ type: 'number' })).toBe(false)
  })

  it(`should return true if there are properties with isLayout falsy`, () => {
    expect(
      hasContentPropsInSchema({
        properties: { test: { isLayout: false } },
        type: 'object',
      })
    ).toBe(true)
    expect(
      hasContentPropsInSchema({ type: 'object', properties: { test: {} } })
    ).toBe(true)
  })

  it(`should return true if there are nested properties with isLayout falsy`, () => {
    expect(
      hasContentPropsInSchema({
        properties: { test: { isLayout: false } },
        type: 'object',
      })
    ).toBe(true)
    expect(
      hasContentPropsInSchema({
        properties: { test: { type: 'object', properties: { lala: {} } } },
        type: 'object',
      })
    ).toBe(true)
  })
})
