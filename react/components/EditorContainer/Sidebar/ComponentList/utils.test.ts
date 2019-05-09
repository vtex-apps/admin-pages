import { SidebarComponent } from '../typings'

import { NormalizedComponent } from './typings'
import { getParentTreePath, isRootComponent, normalize } from './utils'

describe('getParentTreePath', () => {
  it('returns parent treePath', () => {
    expect(getParentTreePath('store.home/shelf#home')).toBe('store.home')
  })

  it('handles strings with no delimiter', () => {
    expect(getParentTreePath('store')).toBe('store')
  })
})

describe('normalize', () => {
  it('handles empty array inputs', () => {
    const input: SidebarComponent[] = []

    const expectedOutput: NormalizedComponent[] = []

    expect(normalize(input)).toEqual(expectedOutput)
  })

  it('nests store.home/ level components', () => {
    const input: SidebarComponent[] = [
      { name: 'editor.footer.title', treePath: 'store.home/$after_0' },
      { name: 'editor.header.title', treePath: 'store.home/$before_0' },
      {
        name: 'editor.category-menu.title',
        treePath: 'store.home/$before_0/category-menu',
      },
      { name: 'editor.login.title', treePath: 'store.home/$before_0/login' },
      { name: 'editor.menu', treePath: 'store.home/$before_0/menu-link' },
      {
        name: 'editor.minicart.title',
        treePath: 'store.home/$before_0/minicart',
      },
      { name: 'editor.carousel.title', treePath: 'store.home/carousel#home' },
      { name: 'editor.shelf.title', treePath: 'store.home/shelf#home' },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [
          {
            components: [],
            isSortable: false,
            name: 'editor.category-menu.title',
            treePath: 'store.home/$before_0/category-menu',
          },
          {
            components: [],
            isSortable: false,
            name: 'editor.login.title',
            treePath: 'store.home/$before_0/login',
          },
          {
            components: [],
            isSortable: false,
            name: 'editor.menu',
            treePath: 'store.home/$before_0/menu-link',
          },
          {
            components: [],
            isSortable: false,
            name: 'editor.minicart.title',
            treePath: 'store.home/$before_0/minicart',
          },
        ],
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
    ].map(val => expect.objectContaining(val))

    // Don't consider order here
    expect(normalize(input)).toEqual(expect.arrayContaining(expectedOutput))
  })

  it('keep multilevel components', () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        name: 'editor.header.title',
        treePath: 'store.home/$before_0/menu',
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store.home/shelf#home/product-summary',
      },
      {
        name: 'editor.product-rating.title',
        treePath: 'store.home/shelf#home/product-summary/product-rating',
      },
      {
        name: 'editor.product-rating.title',
        treePath: 'store.home/shelf#home/product-summary/product-rating/start',
      },
      {
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [
          {
            components: [],
            isSortable: false,
            name: 'editor.header.title',
            treePath: 'store.home/$before_0/menu',
          },
        ],
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    isSortable: false,
                    name: 'editor.product-rating.title',
                    treePath:
                      'store.home/shelf#home/product-summary/product-rating/start',
                  },
                ],
                isSortable: false,
                name: 'editor.product-rating.title',
                treePath:
                  'store.home/shelf#home/product-summary/product-rating',
              },
            ],
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf#home/product-summary',
          },
        ],
        isSortable: false,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
    ]

    expect(normalize(input)).toEqual(expectedOutput)
  })

  it.only('handles unordered components', () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store.home/shelf#home/product-summary',
      },
      {
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [],
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        components: [
          {
            components: [],
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf#home/product-summary',
          },
        ],
        isSortable: false,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
    ]

    expect(normalize(input)).toEqual(expectedOutput)
  })

  it(`handles components with 'around' blocks`, () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store.home/shelf#home/product-summary',
      },
      {
        name: 'editor.around-shelf.title',
        treePath: 'store.home/shelf#home/$around_0',
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        name: 'editor.around-carousel.title',
        treePath: 'store.home/carousel#home/$around_0',
      },
      {
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        isSortable: false,
        name: 'editor.around-carousel.title',
        treePath: 'store.home/carousel#home/$around_0',
      },
      {
        isSortable: false,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        isSortable: false,
        name: 'editor.around-shelf.title',
        treePath: 'store.home/shelf#home/$around_0',
      },
      {
        components: [
          {
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf#home/product-summary',
          },
        ],
        isSortable: false,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        isSortable: false,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
    ]

    expect(normalize(input)).toEqual(expectedOutput)
  })
})

describe('isRootComponent', () => {
  it(`returns true when called with 'store.home/header.full'`, () => {
    const input: SidebarComponent = {
      name: 'header',
      treePath: 'store.home/header.full',
    }

    const expectedOutput = true

    expect(isRootComponent(input)).toBe(expectedOutput)
  })

  it(`returns true when called with 'store.home/footer'`, () => {
    const input: SidebarComponent = {
      name: 'footer',
      treePath: 'store.home/footer',
    }

    const expectedOutput = true

    expect(isRootComponent(input)).toBe(expectedOutput)
  })

  it(`returns true when called with 'store.home/test'`, () => {
    const input: SidebarComponent = {
      name: 'test',
      treePath: 'store.home/test',
    }

    const expectedOutput = true

    expect(isRootComponent(input)).toBe(expectedOutput)
  })

  it(`returns false when called with 'store.home/header/login'`, () => {
    const input: SidebarComponent = {
      name: 'login',
      treePath: 'store.home/header.full/login',
    }

    const expectedOutput = false

    expect(isRootComponent(input)).toBe(expectedOutput)
  })

  it(`returns false when called with 'store.home/shelf/product-summary'`, () => {
    const input: SidebarComponent = {
      name: 'product-summary',
      treePath: 'store.home/shelf/product-summary',
    }

    const expectedOutput = false

    expect(isRootComponent(input)).toBe(expectedOutput)
  })
})

describe('getParentTreePath', () => {
  it('returns parent treePath (delimiter is "/")', () => {
    expect(getParentTreePath('store.home/shelf')).toBe('store.home')
  })

  it('handles strings with no delimiter ("/")', () => {
    expect(getParentTreePath('store')).toBe('store')
  })
})
