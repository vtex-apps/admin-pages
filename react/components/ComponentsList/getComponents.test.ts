import { getComponents } from './getComponents'

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

const mockPages = ['store/home', 'store/account', 'store/search']

describe('getComponents', () => {
  it('should filter out components without either a schema or a title', () => {
    expect(
      getComponents(
        mockExtensions,
        mockComponents as any,
        'store/home',
        mockPages,
      ),
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

  it('should use elements from props of LayoutContainer to determine order', () => {
    expect(
      getComponents(
        {
          ...mockExtensions,
          'store/home': {
            component: 'vtex.LayoutContainer',
            props: {
              elements: ['shelf', 'carousel'],
            },
          },
        },
        mockComponents as any,
        'store/home',
        mockPages,
      ),
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
      getComponents(extensions, components as any, 'store/home', [
        'store/home',
      ]),
    ).toEqual([
      {
        name: 'Shelf',
        treePath: 'store/home/shelf',
      },
    ])
  })
})
