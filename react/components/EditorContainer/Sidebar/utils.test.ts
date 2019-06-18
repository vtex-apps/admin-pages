import {
  generateWarningMessage,
  getComponents,
  getIsDefaultContent,
  getIsSitewide,
} from './utils'

describe('getComponents', () => {
  const mockExtensions = {
    'store/header': {
      component: 'vtex.LayoutContainer',
    },
    'store/home': {
      component: 'vtex.LayoutContainer',
      props: {
        elements: ['carousel', 'shelf'],
      },
    },
    'store/home/carousel': {
      component: 'vtex.carousel',
    },
    'store/home/no-schema': {
      component: 'vtex.no-schema',
    },
    'store/home/shelf': {
      component: 'vtex.shelf',
    },
    'store/home/shelf/arrow': {
      component: 'vtex.shelf-arrow',
    },
    'store/home/shelf/title': {
      component: 'vtex.shelf-title',
    },
  }

  const mockComponents = {
    'vtex.carousel': {
      schema: {
        title: 'Carousel',
      },
    },
    'vtex.no-schema': {},
    'vtex.shelf': {
      schema: {
        title: 'Shelf',
      },
    },
    'vtex.shelf-arrow': {
      schema: {
        title: 'Arrow',
      },
    },
    'vtex.shelf-title': {
      schema: {
        title: 'Shelf Title',
      },
    },
  }

  it('should filter out components without either a schema or a title', () => {
    expect(
      getComponents(mockExtensions as any, mockComponents as any, 'store/home')
    ).toEqual([
      {
        name: 'Carousel',
        treePath: 'store/home/carousel',
      },
      {
        name: 'Shelf',
        treePath: 'store/home/shelf',
      },
      {
        name: 'Arrow',
        treePath: 'store/home/shelf/arrow',
      },
      {
        name: 'Shelf Title',
        treePath: 'store/home/shelf/title',
      },
    ])
  })

  it('should use blocks from extension to determine order', () => {
    expect(
      getComponents(
        {
          ...mockExtensions,
          'store/home': {
            blocks: [
              {
                blockId: 'vtex.shelf@2.x:shelf',
                extensionPointId: 'shelf',
              },
              {
                blockId: 'vtex.carousel@2.x:carousel',
                extensionPointId: 'carousel',
              },
            ],
            component: 'vtex.LayoutContainer',
            props: {},
          },
        } as any,
        mockComponents as any,
        'store/home'
      )
    ).toEqual([
      {
        name: 'Shelf',
        treePath: 'store/home/shelf',
      },
      {
        name: 'Carousel',
        treePath: 'store/home/carousel',
      },
      {
        name: 'Arrow',
        treePath: 'store/home/shelf/arrow',
      },
      {
        name: 'Shelf Title',
        treePath: 'store/home/shelf/title',
      },
    ])
  })

  it('should get components with getSchema instead of schema', () => {
    const extensions = {
      'store/home/shelf': {
        component: 'vtex.shelf',
      },
    }
    const components = {
      'vtex.shelf': {
        getSchema: () => ({
          title: 'Shelf',
        }),
      },
    }
    expect(
      getComponents(extensions as any, components as any, 'store/home')
    ).toEqual([
      {
        name: 'Shelf',
        treePath: 'store/home/shelf',
      },
    ])
  })

  describe('Warning for titleless schema', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    })

    afterEach(() => {
      ;(console.warn as any).mockRestore()
    })

    it('should call console.warn when component has a schema with no title', () => {
      const extensions = {
        'store/home/shelf': {
          component: 'vtex.shelf',
        },
      }
      const components = {
        'vtex.shelf': {
          schema: {},
        },
      }
      expect(
        getComponents(extensions as any, components as any, 'store/home')
      ).toEqual([])

      expect(console.warn).toHaveBeenCalledTimes(1)
      expect(console.warn).toHaveBeenCalledWith(
        generateWarningMessage('vtex.shelf')
      )
    })

    it('should call console.warn when component returns a schema from getSchema with no title', () => {
      const extensions = {
        'store/home/shelf': {
          component: 'vtex.shelf',
        },
      }
      const components = {
        'vtex.shelf': {
          getSchema: () => ({}),
        },
      }
      expect(
        getComponents(extensions as any, components as any, 'store/home')
      ).toEqual([])

      expect(console.warn).toHaveBeenCalledTimes(1)
      expect(console.warn).toHaveBeenCalledWith(
        generateWarningMessage('vtex.shelf')
      )
    })
  })
})

describe('getIsSitewide', () => {
  const mockExtensions = {
    'store.home': {
      after: ['$after_footer'],
      around: [
        '$around_homeWrapper',
        '$around_storeWrapper',
        '$around_challenge',
      ],
      before: ['$before_header.full'],
      blockId: 'vtex.store-theme@2.x:store.home',
      blocks: [
        {
          blockId: 'vtex.store-theme@2.x:carousel#home',
          extensionPointId: 'carousel#home',
        },
      ],
      component: 'vtex.render-runtime@8.17.2/LayoutContainer',
      composition: 'children' as Extension['composition'],
      content: {},
      contentMapId: '',
      context: {},
      implementationIndex: 0,
      implements: [''],
      preview: { type: 'block' },
      props: {},
      render: 'server',
      track: [],
    },
    'store.home/$after_footer': {
      after: [],
      around: [],
      before: [],
      blockId: 'vtex.store-theme@2.x:footer',
      blocks: [],
      component: 'vtex.store-footer@2.6.15/index',
      composition: 'children' as Extension['composition'],
      content: {},
      contentMapId: 'gZQaBBQyU2DLvGaM9icNdg',
      context: {},
      implementationIndex: 0,
      implements: [''],
      preview: null,
      props: {
        showPaymentFormsInColor: false,
        showSocialNetworksInColor: true,
        showVtexLogoInColor: false,
      },
      render: 'server',
      track: [],
    },
    'store.home/$around_homeWrapper': {
      after: [],
      around: [],
      before: [],
      blockId: 'vtex.store@2.x:homeWrapper',
      blocks: [],
      component: 'vtex.store@2.11.0/HomeWrapper',
      composition: 'children' as Extension['composition'],
      content: {},
      contentMapId: '',
      context: {},
      implementationIndex: 0,
      implements: [''],
      preview: null,
      props: {},
      render: 'server',
      track: [],
    },
    'store.home/$before_header.full': {
      after: [],
      around: [],
      before: [],
      blockId: 'vtex.store-theme@2.x:header.full',
      blocks: [],
      component: 'vtex.store-header@2.11.0/index',
      composition: 'children' as Extension['composition'],
      content: {},
      contentMapId: 'gZQaBBQyU2DLvGaM9icNdg',
      context: {},
      implementationIndex: 0,
      implements: [''],
      preview: null,
      props: {},
      render: 'server',
      track: [],
    },
    'store.home/carousel#home': {
      after: [],
      around: [],
      before: [],
      blockId: 'vtex.store-theme@2.x:carousel#home',
      blocks: [],
      component: 'vtex.carousel@2.8.0/Carousel',
      composition: 'children' as Extension['composition'],
      content: {},
      contentMapId: 'eiYc7wanqAEYiPY5DJdRPT',
      context: {},
      implementationIndex: 0,
      implements: [''],
      preview: null,
      props: {},
      render: 'server',
      track: [],
    },
  }

  it('should return true for AFTER', () => {
    const mockEditTreePath = 'store.home/$after_footer'
    expect(getIsSitewide(mockExtensions, mockEditTreePath)).toBe(true)
  })

  it('should return true for AROUND', () => {
    const mockEditTreePath = 'store.home/$around_homeWrapper'
    expect(getIsSitewide(mockExtensions, mockEditTreePath)).toBe(true)
  })

  it('should return true for BEFORE', () => {
    const mockEditTreePath = 'store.home/$before_header.full'
    expect(getIsSitewide(mockExtensions, mockEditTreePath)).toBe(true)
  })

  it('should return false for blocks without role', () => {
    const mockEditTreePath = 'store.home/carousel#home'
    expect(getIsSitewide(mockExtensions, mockEditTreePath)).toBe(false)
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
